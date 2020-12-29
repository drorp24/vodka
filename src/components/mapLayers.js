import ReactDOMServer from 'react-dom/server';
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
        // const overlayers = {}
        // layersConfig.layers.forEach(layerConfig => {
        //     const layerNameAndIconHtml = `<div><i class="circle icon outline unselected"></i> <i class="check circle icon outline selected"></i> <img style="margin: 0px 10px 0px 0px" src="${layerConfig.iconUrl}" width="20" height="20"> &nbsp ${intl.formatMessage({id: layerConfig.key})}</div>`
        //     const layerGroupWrrapers = find({key: layerConfig.key}, this.layerGroupWrrapers)
        //     overlayers[layerNameAndIconHtml] = layerGroupWrrapers.leafletLayerGroup
        // });
        // //'topleft' | 'topright' | 'bottomleft' | 'bottomright'
        // this.layersControl = L.control.layers(null, overlayers, {collapsed:false, position: this.locale === LOCALES.HEBREW ? "topleft" : "topright"})
        // this.layersControl.addTo(leafletMap)
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
        if(!this.selectedItemLayer) return
        this.selectedItemLayer.leafletLayerGroup.clearLayers()
        if(!item) return
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
                    return layerConfig.style
                },
                onEachFeature: (feature, layer) => {
                    const popupString = this._buildPopup(calcPopupKeyValueArr, feature.properties)
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
                const popupString = this._buildPopup(calcPopupKeyValueArr, feature.properties)
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
                const popupString = this._buildPopup(calcPopupKeyValueArr, item)
                if(!isEmpty(popupString))
                    marker.bindPopup(popupString, {autoPan: false})
                    marker.on('mouseover', (e) => {
                            if(!isNil(marker)){
                                try {
                                    marker.openPopup()                                
                                } catch (error) {
                                    console.log(error)
                                }                            
                            }                        
                        });
                    marker.on('mouseout', (e) => {
                        marker.closePopup();
                    });
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

    _buildPopup(cb, item){
        if(isNil(cb)){
            return ""
        }
        const popupComponent = cb(item)
        return ReactDOMServer.renderToString(popupComponent)
    }
}