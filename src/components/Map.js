import React from 'react';
import 'leaflet/dist/leaflet.css'
import 'prunecluster-exportable/dist/LeafletStyleSheet.css'
import {injectIntl} from "react-intl"
import "../third_party/leaflet_conditional_layer"
import './leaflet_layers_control_style.css'
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {getOr, find, concat, filter, isNil, flow, map, max, min, keyBy, take, sortBy, reverse} from "lodash/fp"
import {handleMapClicked} from '../redux/actions/actions'
import {default_map_center, reveal_geolayer_zoom_threshold, reveal_markerlayer_zoom_threshold} from '../configLoader';
import MapLayers from "./mapLayers"
import {LayerParameters} from "./mapLayersConfig"
import layersConfig from "./mapLayersConfig"

const MAX_ZOOM = 18
const MIN_ZOOM = 1
const INITIAL_ZOOM_LEVEL = 15

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: default_map_center[0],
            lng: default_map_center[1],
            zoom: INITIAL_ZOOM_LEVEL,
          }
        this.leafletMap = null
        this.mapLayers = new MapLayers()
        this.layersControlAdded = false
    }

    componentDidUpdate(){
      if(this.leafletMap){
        this.refreshLayers()
      }
    }

    getMapZoom = () => {
      if(this.leafletMap === null) return null
      return this.leafletMap.getZoom()
    }    

    handleClick = () => {
      if (this.leafletMap) {
        this.props.handleMapClickedAction()
      }
    }

    whenReadyCB = (obj) => {
      this.leafletMap = obj.target
      this.mapLayers.initialize(this.leafletMap)
      this.mapLayers.addLayersControl(this.leafletMap)
      this.refreshLayers()      
    }

    _calcWeightedAttrLayerItems = (top, attrName,includedItems) => {      
      return flow([
        filter((item) => {
          const weightedAttrValue = find(weightedAttr => weightedAttr.key === attrName, item.weightedAttributes).value
          return !isNil(weightedAttrValue) && weightedAttrValue > 0
        }),
        sortBy((item) => find(weightedAttr => weightedAttr.key === attrName,item.weightedAttributes).value),
        reverse,
        take(top)
      ])(includedItems)
    }

    _addAttrLayer = (layerKey, items, allItem, attrName, icons) => {
      if(isNil(items) || items.length < 1) return
      const maxAttrScore = flow([
        map((item) => find((attr)=> attr.key === attrName, item.weightedAttributes).value),
        max
      ])(allItem)
      const minAttrScore = flow([map((item) =>  find((attr)=> attr.key === attrName, item.weightedAttributes).value), 
        min
      ])(allItem)
      this.mapLayers.addLayer(layerKey, items, new LayerParameters("center", []), (domainItem) => {
        const itemAttrValue = find((attr)=> attr.key === attrName, domainItem.weightedAttributes).value
        const relativ_score = (itemAttrValue - minAttrScore) / (maxAttrScore - minAttrScore)        
        let iconCnt = 0
        const iconLength = icons.length
        while (iconCnt < iconLength){
          if(relativ_score <= (iconCnt + 1)/iconLength) return icons[iconCnt]
          iconCnt += 1
        }
        return null
      })
    }

    refreshLayers = () => {      
      const layersConfigMapByKey = keyBy("key", layersConfig.layers)
      const popupConf = [{key: this.props.intl.formatMessage({id: "name"}), path: "name"}, {key: this.props.intl.formatMessage({id: "score"}), path: "score"}, {key: this.props.intl.formatMessage({id: "priority"}), path: "currIdx", countFromOne: true}]
      this.mapLayers.clearLayers()
      // Tasks layer
      const topItemsCount = this.calcItemsCountPerZoom(reveal_geolayer_zoom_threshold, this.props.domainItems)
      const taskItems = take(topItemsCount, this.props.domainItems)
      this.mapLayers.addLayer("tasks", taskItems, new LayerParameters("geojson", popupConf))
      // "tfi" layer
      const itemsAndNeighbors = concat(this.props.domainItems, this.props.neighbors)
      const tfiConf = layersConfigMapByKey["tfi"]
      const topTfiMarkersCount = this.calcItemsCountPerZoom(reveal_markerlayer_zoom_threshold, itemsAndNeighbors)
      const tfiItems = this._calcWeightedAttrLayerItems(topTfiMarkersCount, tfiConf.by_attr, itemsAndNeighbors)
      this._addAttrLayer(tfiConf.key, tfiItems, itemsAndNeighbors, tfiConf.by_attr, ["low_act.svg", "med_act.svg", "high_act.svg"])
      // "mer" layer
      const merConf = layersConfigMapByKey["mer"]
      const topMerMarkersCount = this.calcItemsCountPerZoom(reveal_markerlayer_zoom_threshold, this.props.domainItems)
      const merItems = this._calcWeightedAttrLayerItems(topMerMarkersCount, merConf.by_attr, this.props.domainItems)
      this._addAttrLayer(merConf.key, merItems, this.props.domainItems, merConf.by_attr, ["low_cen.svg", "med_cen.svg", "high_cen.svg"])
      const selectedDomainItem = find({id: this.props.selectedDomainItemID}, this.props.domainItems)
      this.mapLayers.updateSelectedItem(selectedDomainItem, new LayerParameters("center", popupConf))
    }

    calcItemsCountPerZoom = (max_zoom, items) => {
      let currZoom = Math.max(this.getMapZoom(), MIN_ZOOM + 1)
      currZoom = Math.min(currZoom, max_zoom)
      const degree = Math.round(Math.sqrt(items.length))
      let topItemsCount =  Math.ceil((Math.pow((currZoom - MIN_ZOOM), degree) / Math.pow(max_zoom - MIN_ZOOM, degree)) * items.length)
      return topItemsCount
    }

    handleZoomEnd = (eventParams) => {      
      this.refreshLayers()
    }

    refreshMap = () => {
      if(!this.leafletMap) return
      const zoom = getOr(null, "selectedDomainItemID", this.props) ? MAX_ZOOM : INITIAL_ZOOM_LEVEL
      this.leafletMap.setZoom(zoom)
      const center = getOr(null, "selectedDomainItemID", this.props) ? find({id: this.props.selectedDomainItemID}, this.props.domainItems).center : 
      [this.state.lat, this.state.lng]
      this.leafletMap.flyTo(center)
    }

    
    render() {
      this.refreshMap()
      return (
        <Div height="calc(100vh - 60px)">
            <LeafletMap maxZoom={MAX_ZOOM} onzoomend={this.handleZoomEnd} whenReady={this.whenReadyCB} onClick={this.handleClick} style={{"height": "100%"}} center={[this.state.lat, this.state.lng]} zoom={INITIAL_ZOOM_LEVEL}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CoordinatesControl position="bottomleft"/>
            </LeafletMap>
        </Div>
      )
    }
  }


  const mapStateToProps = state => ({
    domainItems: filter((item) => !isNil(getOr(null, "center[0]", item)) && !isNil(item.geojson), state.domainItems.items),
    neighbors: filter((nei) => !isNil(getOr(null, "center[0]", nei)) && !isNil(nei.geojson), state.domainItems.neighbors),
    selectedDomainItemID: state.domainItems.selectedDomainItemID
  })

  export default connect(mapStateToProps, {handleMapClickedAction: handleMapClicked})(injectIntl(Map));