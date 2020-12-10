import layersConfig, {LAYER_TYPE} from "./mapLayersConfig"
import L from 'leaflet'
import {keyBy, flow, map, find, isEmpty, omit} from 'lodash/fp'

class LayerGroupWrapper {
    constructor(key, leafletLayerGroup){
        this.key = key
        this.leafletLayerGroup = leafletLayerGroup
        this.layersControl = null
    }
}

export default class MapLayers {
    constructor(){
        this.layerGroupWrrapers = []
        this.layersConfigMapByKey = keyBy("key", layersConfig.layers)
        this.initialized = false
        this.selectedItemLayer = null
    }

    initialize(leafletMap){
        if(this.initialized) return
        layersConfig.layers.forEach(layerConfig => {
            const layerGroupWrapper = new LayerGroupWrapper(layerConfig.key, L.layerGroup())
            this.layerGroupWrrapers.push(layerGroupWrapper)
            layerGroupWrapper.leafletLayerGroup.addTo(leafletMap)
        });
        if(layersConfig.selected_item_layer){
            this.selectedItemLayer = new LayerGroupWrapper("selected_item", L.layerGroup())
            this.selectedItemLayer.leafletLayerGroup.addTo(leafletMap)
        }        
        this.initialized = true
    }

    clearLayers(){
        this.layerGroupWrrapers.forEach(layerGroupWrapper => {
            layerGroupWrapper.leafletLayerGroup.clearLayers()
        });
    }

    addLayer(key, items, layerParameters, calcIconCallBack) {
        const layerConfig = this.layersConfigMapByKey[key]
        layerConfig.type === LAYER_TYPE.GEOJSON ? this._addGeojsonLayer(key, items, layerParameters) : 
                                                  this._addMarkersLayer(key, items, layerParameters, calcIconCallBack)
    }

    addLayersControl(leafletMap, intl) {
        const overlayers = {}
        layersConfig.layers.forEach(layerConfig => {
            const layerNameAndIconHtml = `<div style="display: inline-block"><img style="margin: 0px 10px 0px 0px" src="${layerConfig.iconUrl}" width="20" height="20"> &nbsp ${intl.formatMessage({id: layerConfig.key})}</div>`
            const layerGroupWrrapers = find({key: layerConfig.key}, this.layerGroupWrrapers)
            overlayers[layerNameAndIconHtml] = layerGroupWrrapers.leafletLayerGroup
        });
        this.layersControl = L.control.layers(null, overlayers, {collapsed:false})
        this.layersControl.addTo(leafletMap)
    }

    removeLayersControl(leafletMap) {
        if(this.layersControl){
            this.layersControl.remove()
        }
    }

    updateSelectedItem(item, layerParameters) {
        if(!this.selectedItemLayer) return
        this.selectedItemLayer.leafletLayerGroup.clearLayers()
        if(!item) return
        const layerConfig = layersConfig.selected_item_layer
        const markerOptions = {icon: L.icon({iconUrl: layerConfig.iconUrl, iconSize: [layerConfig.iconSize, layerConfig.iconSize], iconAnchor: [layerConfig.iconAnchorX, layerConfig.iconAnchorY]})}
        const marker = L.marker(item[layerParameters.geoPropPath], markerOptions)
        marker.setZIndexOffset(1000)
        this.selectedItemLayer.leafletLayerGroup.addLayer(marker)
    }

    _addGeojsonLayer(key, items, layerParameters) {
        const layerConfig = this.layersConfigMapByKey[key]
        const geoJsonItems = flow([
            map((item) => {
                const type = "Feature"
                const properties = {...omit(layerParameters.geoPropPath, item)}
                const geometry = item[layerParameters.geoPropPath]
                return {type, geometry, properties}
            })
          ])(items)
        const geojsonLayer = L.geoJSON(geoJsonItems, {
            style: layerConfig.style,
            onEachFeature: (feature, layer) => {
                const popupString = this._buildPopupString(feature.properties, layerParameters.popupKeyAndPathArr)
                if(!isEmpty(popupString))
                    layer.bindPopup(popupString);
              }
        })
        this._addLayerToGroup(geojsonLayer, key)
    }

    _addMarkersLayer(key, items, layerParameters, calcIconCallBack) {
        const layerConfig = this.layersConfigMapByKey[key]
        const markersArray = flow([
            map((item) => {
                const iconUrl = calcIconCallBack ? calcIconCallBack(item) : layerConfig.iconUrl
                const markerOptions = {icon: L.icon({iconUrl, iconSize: [layerConfig.iconSize, layerConfig.iconSize], iconAnchor: [layerConfig.iconAnchorX, layerConfig.iconAnchorY]})}
                const marker = L.marker(item[layerParameters.geoPropPath], markerOptions)
                const popupString = this._buildPopupString(item, layerParameters.popupKeyAndPathArr)
                if(!isEmpty(popupString))
                    marker.bindPopup(popupString)
                return marker
            })
        ])(items)
        const markersLayer = L.conditionalMarkers(markersArray, {maxMarkers: items.length})
        this._addLayerToGroup(markersLayer, key)
    }

    _addLayerToGroup(leafletLayer, groupKey) {
        const layerGroupWrapper = find({key: groupKey}, this.layerGroupWrrapers)
        layerGroupWrapper.leafletLayerGroup.addLayer(leafletLayer)
    }

    _buildPopupString(item, popupKeyAndPathArr){
        let popupString = ''
        popupKeyAndPathArr.forEach(popupKeyAndPath => {
            popupString += `${popupKeyAndPath.key}: ${popupKeyAndPath.countFromOne ? item[popupKeyAndPath.path] + 1 : item[popupKeyAndPath.path]} <br/>`
        });
        return popupString
    }
}