import React from 'react';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {map} from "lodash/fp"
import { find } from 'lodash/fp';
import {handleMapClicked} from '../redux/actions/actions'

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 32.8092,
            lng: 35.0343,
            zoom: 10,
          }
        this.mapRef = React.createRef();
    }

    getMarkerIcon = (id) => {
      if(!this.mapMarkerIcon){
        this.mapMarkerIcon = new L.Icon({
          iconUrl: 'map-marker.svg',
          iconSize: [18,18],
          iconAnchor: [9, 9]
        })
      }
      if(!this.SelectedItemMapMarkerIcon){
        this.SelectedItemMapMarkerIcon = new L.Icon({
          iconUrl: 'selected-map-marker.svg',
          iconSize: [18,18],
          iconAnchor: [9, 9]
        })
      }
      return id === this.props.selected_id ? this.SelectedItemMapMarkerIcon : this.mapMarkerIcon
    }
    
    getCenter(){
      if(!this.props.selected_id){
        return [this.state.lat, this.state.lng]
      }
      const selectedItem = find({id: this.props.selected_id}, this.props.domainItems)
      return selectedItem.position
    }

    handleClick = () => {
      const map = this.mapRef.current
      if (map != null) {
        this.props.handleMapClickedAction()
      }
    }
  
    render() {
      
      return (
        <Div height="calc(100vh - 60px)">
            <LeafletMap onClick={this.handleClick} ref={this.mapRef} style={{"height": "100%"}}  center={this.getCenter()} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CoordinatesControl position="bottomleft"/>
                {
                  map(weightedItem => 
                  <Marker position={weightedItem.position} icon={this.getMarkerIcon(weightedItem.id)}>
                    <Popup>{weightedItem.name} <br/> score: {parseInt(weightedItem.score)} <br/> order: {weightedItem.currIdx + 1}</Popup>
                  </Marker> , 
                  this.props.domainItems)
                }
            </LeafletMap>
        </Div>
      )
    }
  }


  const mapStateToProps = state => ({
    domainItems: state.domainItems.items,
    selected_id: state.ui.selectedWeightedItemID,
  })

  export default connect(mapStateToProps, {handleMapClickedAction: handleMapClicked})(Map);