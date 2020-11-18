import React from 'react';
import 'leaflet/dist/leaflet.css'
import 'prunecluster-exportable/dist/LeafletStyleSheet.css'
import L from 'leaflet'
import "../third_party/leaflet_conditional_layer"
import './leaflet_layers_control_style.css'
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
        this.markersGroup = L.layerGroup()
        this.neighborsPolygonsGroup = L.layerGroup()
        this.polygonsGroup  = L.layerGroup()
        this.geojsonLayer = null
        this.geojsonNeighborsLayer = null
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
      this.markersGroup.addTo(this.leafletMap)
      this.neighborsPolygonsGroup.addTo(this.leafletMap)
      this.polygonsGroup.addTo(this.leafletMap)
      this.refreshLayers()
      this.initLayersControl()
    }

    initLayersControl = () => {
      const overlayers = {
        "Tasks Polygons": this.polygonsGroup,
        "Tasks Neigbors": this.neighborsPolygonsGroup,
        "Tasks Location": this.markersGroup
      }
      L.control.layers(null, overlayers).addTo(this.leafletMap)
    }

    refreshLayers = () => {
      const topMarkersCount = this.calcMarkersCount()
      this.markersGroup.clearLayers()
      this.polygonsGroup.clearLayers()
      this.neighborsPolygonsGroup.clearLayers()
      const geoJsonItems = flow([
        take(topMarkersCount),
        map((domainItem) => domainItem.geogson)        
      ])(this.props.domainItems)
      this.geojsonLayer = L.geoJSON(geoJsonItems)

      const geoJsonNeighborsItems = flow([
        take(topMarkersCount),
        map((domainItem) => domainItem.geogson)
      ])(this.props.neighbors)
      this.geojsonNeighborsLayer = L.geoJSON(geoJsonNeighborsItems,
        {
          style: {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        }
        })

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

      this.polygonsGroup.addLayer(this.geojsonLayer)
      this.neighborsPolygonsGroup.addLayer(this.geojsonNeighborsLayer)
      this.markersGroup.addLayer(this.markersTopXLayer)
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