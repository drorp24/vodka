import layersConfig, {LAYER_TYPE} from "./mapLayersConfig"
import L from 'leaflet'
import {keyBy, flow, map, find, isEmpty, omit, isNil} from 'lodash/fp'
import LOCALES from "../i18n/locales"

class LayerGroupWrapper {
    constructor(key, leafletLayerGroup){
        this.key = key
        this.leafletLayerGroup = leafletLayerGroup        
    }
}

export default class MapLayers {
    constructor(locale){
        this.layerGroupWrrapers = []
        this.layersConfigMapByKey = keyBy("key", layersConfig.layers)
        this.initialized = false
        this.selectedItemLayer = null
        this.locale = locale
        this.layersControl = null
        this.zoomControl = null
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

    addLayer(key, items, geometryPath, calcStyleCallBack, calcPopupKeyValueArr, onItemClick) {
        const layerConfig = this.layersConfigMapByKey[key]
        layerConfig.type === LAYER_TYPE.GEOJSON ? 
                        this._addGeojsonLayer(key, items, geometryPath, calcStyleCallBack, calcPopupKeyValueArr, onItemClick) : 
                        this._addMarkersLayer(key, items, geometryPath, calcStyleCallBack, calcPopupKeyValueArr, onItemClick)
    }

    addMapControls(leafletMap, intl) {
        const overlayers = {}
        layersConfig.layers.forEach(layerConfig => {
            const layerNameAndIconHtml = `<div><i class="circle icon outline unselected"></i> <i class="check circle icon outline selected"></i> <img style="margin: 0px 10px 0px 0px" src="${layerConfig.iconUrl}" width="20" height="20"> &nbsp ${intl.formatMessage({id: layerConfig.key})}</div>`
            const layerGroupWrrapers = find({key: layerConfig.key}, this.layerGroupWrrapers)
            overlayers[layerNameAndIconHtml] = layerGroupWrrapers.leafletLayerGroup
        });
        //'topleft' | 'topright' | 'bottomleft' | 'bottomright'
        this.layersControl = L.control.layers(null, overlayers, {collapsed:false, position: this.locale === LOCALES.HEBREW ? "topleft" : "topright"})
        this.layersControl.addTo(leafletMap)
        this.zoomControl = L.control.zoom({position: this.locale === LOCALES.HEBREW ? "topright" : "topleft"});
        this.zoomControl.addTo(leafletMap)
    }

    removeMapControl(leafletMap) {
        if(this.layersControl){
            this.layersControl.remove()
        }
        if(this.zoomControl){
            this.zoomControl.remove()
        }
    }

    updateSelectedItem(item, geomertyPath, calcPopupKeyValueArr, onItemClick) {
        if(!item || !this.selectedItemLayer) return

        console.log('updateSelectedItem:')
        console.log('item: ', item);
        console.log('geomertyPath: ', geomertyPath);
        console.log(" ")

        this.selectedItemLayer.leafletLayerGroup.clearLayers()
        
        const layerConfig = layersConfig.selected_item_layer
        if(geomertyPath === "center"){
            const markerOptions = {icon: L.icon({iconUrl: layerConfig.iconUrl, iconSize: [layerConfig.iconSize, layerConfig.iconSize], iconAnchor: [layerConfig.iconAnchorX, layerConfig.iconAnchorY]})}
            const marker = L.marker(item[geomertyPath], markerOptions)
            marker.setZIndexOffset(1000)
            this.selectedItemLayer.leafletLayerGroup.addLayer(marker)
        }
        else if(geomertyPath === "geojson"){
            const geojsonLayer = L.geoJSON({type: "Feature", geometry: item[geomertyPath], properties: item}, {
                style: (feature) => {
                    console.log('updateSelectedItem style:')
                    console.log('layerConfig.style: ', layerConfig.style);
                    console.log(" ")
                    return layerConfig.style
                },
                onEachFeature: (feature, layer) => {
                    console.log('updateSelectedItem onEachFeature:')
                    console.log('feature: ', feature);
                    console.log('layer: ', layer);
                    console.log(" ")
                    const popupString = this._buildPopupString(calcPopupKeyValueArr, feature.properties)
                    if(!isEmpty(popupString))
                        layer.bindPopup(popupString);
                    if(!isNil(onItemClick)){
                        layer.on({
                            click: onItemClick
                        })                    
                    }                
                }
            })            
            this.selectedItemLayer.leafletLayerGroup.addLayer(geojsonLayer)
        }
    }

    _addGeojsonLayer(key, items, geomertyPath, calcStyleCallBack, calcPopupKeyValueArr, onItemClick) {
        
        console.log('_addGeoJsonLayer:')
        console.log('key: ', key);
        console.log('items: ', items);
        console.log('geomertyPath: ', geomertyPath);
        console.log(" ")

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
                console.log('_addGeojsonLayer style:')
                if (isNil(calcStyleCallBack)) {
                    console.log('no calcStyleCallBack for this feature. layConfig.style is used:')
                    console.log('layerConfig.style: ', layerConfig.style);
                    return layerConfig.style
                } else {
                    console.log('calcStyleCallBack exists for this feature:')
                    console.log('feature.properties: ', feature.properties);
                    const style = calcStyleCallBack(feature.properties)
                    console.log('calcStyleCallBack(feature.properties): ', style);
                    console.log(" ")
                    return style
                }
            },
            onEachFeature: (feature, layer) => {
                console.log('_addGeojsonLayer onEachFeature:')
                console.log('feature: ', feature);
                console.log('layer: ', layer);
                console.log(" ")      
                const popupString = this._buildPopupString(calcPopupKeyValueArr, feature.properties)
                if(!isEmpty(popupString))
                    layer.bindPopup(popupString);
                if(!isNil(onItemClick)){
                    layer.on({
                        click: onItemClick
                    })                    
                }                
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