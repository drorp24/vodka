import layersConfig, {LAYER_TYPE} from "./mapLayersConfig"
import L from 'leaflet'
import {keyBy, flow, take, map, find, isNil, isEmpty, omit} from 'lodash/fp'

class LayerGroupWrapper {
    constructor(key, leafletLayerGroup){
        this.key = key
        this.leafletLayerGroup = leafletLayerGroup
    }
}

export default class MapLayers {
    constructor(){
        this.layerGroupWrrapers = []
        this.layersConfigMapByKey = keyBy("key", layersConfig)
        this.initialized = false
    }

    initialize(leafletMap){
        if(this.initialized) return
        layersConfig.forEach(layerConfig => {
            const layerGroupWrapper = new LayerGroupWrapper(layerConfig.key, L.layerGroup())
            this.layerGroupWrrapers.push(layerGroupWrapper)
            layerGroupWrapper.leafletLayerGroup.addTo(leafletMap)
        });
        this.initialized = true
    }

    clearLayers(){
        this.layerGroupWrrapers.forEach(layerGroupWrapper => {
            layerGroupWrapper.leafletLayerGroup.clearLayers()
        });
    }

    addLayer(key, items, layerParameters, top, calcIconCallBack) {
        const actualTop = isNil(top) ? items.length : top
        const layerConfig = this.layersConfigMapByKey[key]
        layerConfig.type === LAYER_TYPE.GEOJSON ? this._addGeojsonLayer(key, items, actualTop, layerParameters) : 
                                                  this._addMarkersLayer(key, items, actualTop, layerParameters, calcIconCallBack)
    }

    addLayersControl(leafletMap) {
        const overlayers = {}
        layersConfig.forEach(layerConfig => {
            const layerGroupWrrapers = find({key: layerConfig.key}, this.layerGroupWrrapers)
            overlayers[layerConfig.name] = layerGroupWrrapers.leafletLayerGroup
        });
        L.control.layers(null, overlayers).addTo(leafletMap)        
    }

    _addGeojsonLayer(key, items, top, layerParameters) {
        const layerConfig = this.layersConfigMapByKey[key]
        const geoJsonItems = flow([
            take(top),
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

    _addMarkersLayer(key, items, top, layerParameters, calcIconCallBack) {
        const layerConfig = this.layersConfigMapByKey[key]
        const markersArray = flow([
            take(top),
            map((item) => {
                const iconUrl = calcIconCallBack ? calcIconCallBack(item) : layerConfig.iconUrl
                const iconOptions = {icon: L.icon({iconUrl, iconSize: [layerConfig.iconSize, layerConfig.iconSize], iconAnchor: [layerConfig.iconAnchorX, layerConfig.iconAnchorY]})}
                const marker = L.marker(item[layerParameters.geoPropPath], iconOptions)
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