import layersConfig, {LAYER_TYPE} from "./mapLayersConfig"
import L from 'leaflet'
import {keyBy, flow, map, find, isEmpty, omit, isNil} from 'lodash/fp'
import LOCALES from "../i18n/locales"

class LayerGroupWrapper {
    constructor(key, leafletLayerGroup){
        this.key = key
        this.leafletLayerGroup = leafletLayerGroup
        this.layersControl = null
    }
}

export default class MapLayers {
    constructor(locale){
        this.layerGroupWrrapers = []
        this.layersConfigMapByKey = keyBy("key", layersConfig.layers)
        this.initialized = false
        this.selectedItemLayer = null
        this.locale = locale
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

    updateLocale(locale) {
        this.locale = locale
    }

    clearLayers(){
        this.layerGroupWrrapers.forEach(layerGroupWrapper => {
            layerGroupWrapper.leafletLayerGroup.clearLayers()
        });
    }

    addLayer(key, items, geometryPath, calcStyleCallBack, calcPopupKeyValueArr) {
        const layerConfig = this.layersConfigMapByKey[key]
        layerConfig.type === LAYER_TYPE.GEOJSON ? 
                        this._addGeojsonLayer(key, items, geometryPath, calcStyleCallBack, calcPopupKeyValueArr) : 
                        this._addMarkersLayer(key, items, geometryPath, calcStyleCallBack, calcPopupKeyValueArr)
    }

    addLayersControl(leafletMap, intl) {
        const overlayers = {}
        layersConfig.layers.forEach(layerConfig => {
            const layerNameAndIconHtml = `<div><i class="circle icon outline unselected"></i> <i class="check circle icon outline selected"></i> <img style="margin: 0px 10px 0px 0px" src="${layerConfig.iconUrl}" width="20" height="20"> &nbsp ${intl.formatMessage({id: layerConfig.key})}</div>`
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

    updateSelectedItem(item, geomertyPath) {
        if(!this.selectedItemLayer) return
        this.selectedItemLayer.leafletLayerGroup.clearLayers()
        if(!item) return
        const layerConfig = layersConfig.selected_item_layer
        const markerOptions = {icon: L.icon({iconUrl: layerConfig.iconUrl, iconSize: [layerConfig.iconSize, layerConfig.iconSize], iconAnchor: [layerConfig.iconAnchorX, layerConfig.iconAnchorY]})}
        const marker = L.marker(item[geomertyPath], markerOptions)
        marker.setZIndexOffset(1000)
        this.selectedItemLayer.leafletLayerGroup.addLayer(marker)
    }

    _addGeojsonLayer(key, items, geomertyPath, calcStyleCallBack, calcPopupKeyValueArr) {
        const layerConfig = this.layersConfigMapByKey[key]
        const geoJsonItems = flow([
            map((item) => {
                const type = "Feature"
                const properties = {...omit(geomertyPath, item)}
                const geometry = item[geomertyPath]
                return {type, geometry, properties}
            })
          ])(items)
        const geojsonLayer = L.geoJSON(geoJsonItems, {
            style: (feature) => {
                return isNil(calcStyleCallBack) ? layerConfig.style : calcStyleCallBack(feature.properties)
            },
            onEachFeature: (feature, layer) => {
                const popupString = this._buildPopupString(calcPopupKeyValueArr, feature.properties)
                if(!isEmpty(popupString))
                    layer.bindPopup(popupString);
              }
        })
        this._addLayerToGroup(geojsonLayer, key)
    }

    _addMarkersLayer(key, items, geomertyPath, calcIconCallBack, calcPopupKeyValueArr) {
        const layerConfig = this.layersConfigMapByKey[key]
        const markersArray = flow([
            map((item) => {
                const iconUrl = calcIconCallBack ? calcIconCallBack(item) : layerConfig.iconUrl
                const markerOptions = {icon: L.icon({iconUrl, iconSize: [layerConfig.iconSize, layerConfig.iconSize], iconAnchor: [layerConfig.iconAnchorX, layerConfig.iconAnchorY]})}
                const marker = L.marker(item[geomertyPath], markerOptions)
                const popupString = this._buildPopupString(calcPopupKeyValueArr, item)
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

    _buildPopupString(cb, item){
        if(isNil(cb)){
            return ""
        }
        const popupKeyValueArr = cb(item)
        let popupString = ''
        popupKeyValueArr.forEach(keyValue => {
            popupString += `${keyValue.key}: ${keyValue.countFromOne ? keyValue.value + 1 : keyValue.value} <br/>`
        });
        return `<div style="text-align: ${this.locale === LOCALES.HEBREW ? 'right' : 'left'}"> ${popupString}</div>`
    }
}