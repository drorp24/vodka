import React from 'react';
import 'leaflet/dist/leaflet.css'
import 'prunecluster-exportable/dist/LeafletStyleSheet.css'
import L from 'leaflet'
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {getOr, find, map, set} from "lodash/fp"
import {handleMapClicked} from '../redux/actions/actions'

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 32.8092,
            lng: 35.0343,
            zoom: 14,
          }
        this.leafletMapInstance = null
        this.leafletGeojsonLayer = null
    }

    componentDidUpdate(){
      if(this.leafletMapInstance){
        this.renderData()
      }
    }
    
    getCenter(){
      if(!this.props.selected_id){
        return [this.state.lat, this.state.lng]
      }
      const selectedItem = find({id: this.props.selected_id}, this.props.domainItems)
      return selectedItem.center
    }

    getZoom(){
      if(!this.props.selected_id){
        return this.state.zoom
      }
      return 18
    }

    handleClick() {
      if (this.leafletMapInstance) {
        this.props.handleMapClickedAction()
      }
    }

    whenReadyCB = (obj) => {
      this.leafletMapInstance = obj.target      
      this.renderData()
    }

    renderData() {
      if(!getOr(null, 'length', this.props.domainItems)){
        return null
      }
      const geoJsonItems = map((domainItem) => set("properties", {id: domainItem.id}, domainItem.geogson), this.props.domainItems)      
      // remove previous datalayer      
      if(this.leafletGeojsonLayer){
        this.leafletMapInstance.removeLayer(this.leafletGeojsonLayer)
      }
      // add layer again
      this.leafletGeojsonLayer = L.geoJSON(geoJsonItems, {
        style: (feature) => {
          return {color: getOr(null, "geometry.properties.id", feature) === this.props.selected_id ? "#ff0000" : "#000000"}
        } 
      })
      this.leafletGeojsonLayer.addTo(this.leafletMapInstance)
      geoJsonItems.forEach(geogson => {
        this.leafletGeojsonLayer.addData(geogson)
      });      
    }
  
    render() {
      
      return (
        <Div height="calc(100vh - 60px)">
            <LeafletMap whenReady={this.whenReadyCB} onClick={this.handleClick} style={{"height": "100%"}}  center={this.getCenter()} zoom={this.getZoom()}>
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


  // getMarkerIcon = (id) => {
    //   if(!this.mapMarkerIcon){
    //     this.mapMarkerIcon = new L.Icon({
    //       iconUrl: 'map-marker.svg',
    //       iconSize: [18,18],
    //       iconAnchor: [9, 9]
    //     })
    //   }
    //   if(!this.SelectedItemMapMarkerIcon){
    //     this.SelectedItemMapMarkerIcon = new L.Icon({
    //       iconUrl: 'selected-map-marker.svg',
    //       iconSize: [18,18],
    //       iconAnchor: [9, 9]
    //     })
    //   }
    //   return id === this.props.selected_id ? this.SelectedItemMapMarkerIcon : this.mapMarkerIcon
    // }
    // renderData = () => {
    //   if(getOr(null, 'length', this.props.domainItems) === null){
    //     return null
    //   }
    //   if(!this.pruneCluster){
    //     this.pruneCluster = new PruneClusterForLeaflet();
    //   }
    //   // remove previous datalayer      
    //   if(this.leafletDataLayer){
    //     this.pruneCluster.RemoveMarkers()
    //     this.leafletMapInstance.removeLayer(this.leafletDataLayer)        
    //   }      
    //   // add layer again
    //   this.props.domainItems.forEach(domainItem => {
    //     const marker = new PruneCluster.Marker(domainItem.center[0], domainItem.center[1]);
    //     marker.data.icon = this.getMarkerIcon(domainItem.id)
    //     marker.data.popup = `${domainItem.name} <br/> score: ${parseInt(domainItem.score)} <br/> order: ${domainItem.currIdx + 1}`
    //     this.pruneCluster.RegisterMarker(marker);
    //   });
    //   this.leafletDataLayer = this.leafletMapInstance.addLayer(this.pruneCluster);
    //   this.pruneCluster.ProcessView();
    // }