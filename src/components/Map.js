import React from 'react';
import 'leaflet/dist/leaflet.css'
import 'prunecluster-exportable/dist/LeafletStyleSheet.css'
import L from 'leaflet'
import "../third_party/leaflet_conditional_layer"
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {getOr, find, map, flow, take, last} from "lodash/fp"
import {handleMapClicked} from '../redux/actions/actions'
import {default_map_center} from '../configLoader';

const MAX_ZOOM = 18
const MIN_ZOOM = 1
const INITIAL_ZOOM_LEVEL = 11

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: default_map_center[0],
            lng: default_map_center[1],
            zoom: 14,
          }
        this.leafletMap = null
        this.layerGroup = L.layerGroup()
        this.geojsonLayer = null
        this.markersTopXLayer = null
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
      this.layerGroup.addTo(this.leafletMap)
      this.refreshLayers()
    }

    refreshLayers = () => {
      const topMarkersCount = this.calcMarkersCount()
      this.layerGroup.clearLayers()
      const geoJsonItems = flow([
        take(topMarkersCount),
        map((domainItem) => domainItem.geogson)        
      ])(this.props.domainItems)
      this.geojsonLayer = L.geoJSON(geoJsonItems)
      const maxScore = getOr(0, "[0].score", this.props.domainItems)
      const minScore = getOr(0, "score", last(this.props.domainItems))
      const markersArray = flow([
        take(topMarkersCount),
        map((domainItem) => {
          const selectedId = getOr(null, "selected_id", this.props)
          let iconSize =  Math.round((domainItem.score - minScore) / ((maxScore - minScore)/(13)))        
          iconSize += 18        
          const iconUrl = domainItem.id === selectedId ? 'selected-map-marker.svg' : "map-marker.svg"
          const marker = L.marker(domainItem.center, {icon: L.icon({iconUrl, iconSize: [iconSize,iconSize],iconAnchor: [9, 9]})})
          marker.bindPopup(`${domainItem.name} <br/> score: ${parseInt(domainItem.score)} <br/> importance: ${domainItem.currIdx + 1}`)          
          return marker
        })
      ])(this.props.domainItems)
      this.markersTopXLayer = L.conditionalMarkers(markersArray, {maxMarkers: this.props.domainItems.length})      
      this.layerGroup.addLayer(this.geojsonLayer)
      this.layerGroup.addLayer(this.markersTopXLayer)
    }

    calcMarkersCount = () => {
      const currZoom = this.getMapZoom()
      let topMarkersCount =  Math.round((currZoom - MIN_ZOOM) / ((MAX_ZOOM - MIN_ZOOM)/(this.props.domainItems.length)))
      topMarkersCount = topMarkersCount * ((Math.pow(currZoom, 2))/Math.pow(MAX_ZOOM, 2))
      console.log(`top count for zoom: ${currZoom} is ${topMarkersCount}`)
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
    selected_id: state.domainItems.selectedDomainItemID
  })

  export default connect(mapStateToProps, {handleMapClickedAction: handleMapClicked})(Map);