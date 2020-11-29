import React from 'react';
import 'leaflet/dist/leaflet.css'
import 'prunecluster-exportable/dist/LeafletStyleSheet.css'
import "../third_party/leaflet_conditional_layer"
import './leaflet_layers_control_style.css'
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {getOr, find, concat, filter, isNil, flow, map, max, min} from "lodash/fp"
import {handleMapClicked} from '../redux/actions/actions'
import {default_map_center} from '../configLoader';
import MapLayers from "./mapLayers"
import {LayerParameters} from "./mapLayersConfig"

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

    refreshLayers = () => {
      const topItemsCount = this.calcMarkersCount()
      this.mapLayers.clearLayers()
      // Buildings layer
      const buildings = concat(this.props.neighbors, this.props.domainItems)
      this.mapLayers.addLayer("buildings", buildings, new LayerParameters("geojson", []), topItemsCount)
      // Tasks layer
      this.mapLayers.addLayer("tasks", this.props.domainItems, new LayerParameters("geojson", []), topItemsCount)
      // "tfi" layer
      const tfiItems = filter((domainItem)=> {
        const tfiAttr = find((attr) => attr.key === "tfi"  ,domainItem.weightedAttributes)
        return !isNil(tfiAttr.value) &&  tfiAttr.value > 0
      }, this.props.domainItems)
      const popupConf = [{key: "name", path: "name"}, {key: "score", path: "score"}, {key: "priority", path: "currIdx"}]
      const maxTfiScore = flow([map((item) =>  find((attr)=> attr.key === "tfi", item.weightedAttributes).value)], max)(this.props.domainItems)
      const minTfiScore = flow([map((item) =>  find((attr)=> attr.key === "tfi", item.weightedAttributes).value)], min)(this.props.domainItems)
      this.mapLayers.addLayer("tfi", tfiItems, new LayerParameters("center", popupConf), topItemsCount, (domainItem) => {
        const item_tfi_value = find((attr)=> attr.key === "tfi", domainItem.weightedAttributes).value
        const relativ_score = (item_tfi_value - minTfiScore) / (maxTfiScore - minTfiScore)
        return relativ_score > 0.5 ? "high_tfi.svg" : "low_tfi.svg"
      })

      const maxMerScore = flow([map((item) =>  find((attr)=> attr.key === "mer", item.weightedAttributes).value)], max)(this.props.domainItems)
      const minMerScore = flow([map((item) =>  find((attr)=> attr.key === "mer", item.weightedAttributes).value)], min)(this.props.domainItems)
      const merItems = filter((domainItem)=> {
        const merAttr = find((attr) => attr.key === "mer"  ,domainItem.weightedAttributes)
        return !isNil(merAttr.value) &&  merAttr.value > 0
      }, this.props.domainItems)
      this.mapLayers.addLayer("mer", merItems, new LayerParameters("center", []), topItemsCount, (domainItem) => {
        const item_mer_value = find((attr)=> attr.key === "mer", domainItem.weightedAttributes).value
        const relativ_score = (item_mer_value - minMerScore) / (maxMerScore - minMerScore)
        return relativ_score < 1/3 ? "low_cen.svg" : relativ_score < 2/3 ? "med_cen.svg" : "high_cen.svg"
      })
    }

    calcMarkersCount = () => {
      let currZoom = Math.max(this.getMapZoom(), MIN_ZOOM + 1)
      currZoom = Math.min(currZoom, MAX_ZOOM)
      const degree = Math.round(Math.sqrt(this.props.domainItems.length))
      let topMarkersCount =  Math.ceil((Math.pow((currZoom - MIN_ZOOM), degree) / Math.pow(MAX_ZOOM - MIN_ZOOM, degree)) * this.props.domainItems.length)
      console.log(`top count for zoom: ${currZoom} is ${topMarkersCount} out of ${this.props.domainItems.length}`)
      return topMarkersCount
    }

    handleZoomEnd = (eventParams) => {      
      this.refreshLayers()      
    }

    refreshMap = () => {
      if(!this.leafletMap) return
      const zoom = getOr(null, "selected_id", this.props) ? MAX_ZOOM : INITIAL_ZOOM_LEVEL
      this.leafletMap.setZoom(zoom)      
      const center = getOr(null, "selected_id", this.props) ? find({id: this.props.selected_id}, this.props.domainItems).center : 
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
    domainItems: state.domainItems.items,
    neighbors: state.domainItems.neighbors,
    selected_id: state.domainItems.selectedDomainItemID
  })

  export default connect(mapStateToProps, {handleMapClickedAction: handleMapClicked})(Map);