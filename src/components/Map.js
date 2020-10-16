import React from 'react';
import 'leaflet/dist/leaflet.css'
import 'prunecluster-exportable/dist/LeafletStyleSheet.css'
import L from 'leaflet'
import _ from "../third_party/leaflet_conditional_layer"
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {getOr, find, map, set, drop, flow, take, last} from "lodash/fp"
import {handleMapClicked} from '../redux/actions/actions'

const MAX_ZOOM = 18
const MIN_ZOOM = 1
const INITIAL_ZOOM_LEVEL = 11

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 32.811,
            lng: 34.982,
            zoom: 14,
          }
        this.leafletMap = null
        this.layerGroup = L.layerGroup()
        this.geojsonLayer = null
        this.markersTopXLayer = null
        this.topMarkersCount = 0
    }

    componentDidUpdate(){
      if(this.leafletMap){
        this.refreshLayers()
      }
    }
    
    getCenterOnRender(){
      if(!this.props.selected_id){
        return [this.state.lat, this.state.lng]
      }
      const selectedItem = find({id: this.props.selected_id}, this.props.domainItems)
      return selectedItem.center
    }

    getZoomOnRender(){
      if(this.props.selected_id){
        return MAX_ZOOM
      }
      return INITIAL_ZOOM_LEVEL
    }

    getMapZoom = () => {
      if(this.leafletMap === null) return null
      return this.leafletMap.getZoom()
    }    

    handleClick() {
      if (this.leafletMap) {
        this.props.handleMapClickedAction()
      }
    }

    whenReadyCB = (obj) => {
      this.leafletMap = obj.target
      this.layerGroup.addTo(this.leafletMap)
      this.refreshLayers()
    }

    refreshLayers = () => {
      this.calcMarkersCount()
      this.layerGroup.clearLayers()
      const geoJsonItems = flow([
        take(this.topMarkersCount),
        map((domainItem) => domainItem.geogson)        
      ])(this.props.domainItems)
      this.geojsonLayer = L.geoJSON(geoJsonItems)
      const maxScore = getOr(0, "[0].score", this.props.domainItems)
      const minScore = getOr(0, "score", last(this.props.domainItems))      
      const markersArray = flow([
        take(this.topMarkersCount),
        map((domainItem) => {
          let iconSize =  Math.round((domainItem.score - minScore) / ((maxScore - minScore)/(13)))        
          iconSize += 18        
          const iconUrl = domainItem.id === this.props.selected_id ? 'selected-map-marker.svg' : "map-marker.svg"
          return L.marker(domainItem.center, {icon: L.icon({iconUrl, iconSize: [iconSize,iconSize],iconAnchor: [9, 9]})})
        })
      ])(this.props.domainItems)
      this.markersTopXLayer = L.conditionalMarkers(markersArray, {maxMarkers: this.props.domainItems.length})      
      this.layerGroup.addLayer(this.geojsonLayer)
      this.layerGroup.addLayer(this.markersTopXLayer)
    }

    calcMarkersCount = () => {
      const currZoom = this.getMapZoom()
      let topMarkersCount =  Math.round((currZoom - MIN_ZOOM) / ((MAX_ZOOM - MIN_ZOOM)/(this.props.domainItems.length)))      
      this.topMarkersCount = topMarkersCount * ((Math.pow(currZoom, 10))/Math.pow(MAX_ZOOM, 10))
      console.log(`top count for zoom: ${currZoom} is ${this.topMarkersCount}`)
    }

    handleZoomEnd = (eventParams) => {      
      this.refreshLayers()      
    }

    
    render() {
      
      return (
        <Div height="calc(100vh - 60px)">
            <LeafletMap useFlyTo maxZoom={MAX_ZOOM} onzoomend={this.handleZoomEnd} whenReady={this.whenReadyCB} onClick={this.handleClick} style={{"height": "100%"}}  center={this.getCenterOnRender()} zoom={this.getZoomOnRender()}>
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
    selected_id: state.ui.selectedDomainItemID
  })

  export default connect(mapStateToProps, {handleMapClickedAction: handleMapClicked})(Map);