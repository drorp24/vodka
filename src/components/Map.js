import React from 'react';
import L from 'leaflet'
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'
import { connect } from "react-redux"
import {map} from "lodash/fp"
import { find } from 'lodash/fp';

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 32.8092,
            lng: 35.0343,
            zoom: 10,
          }
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
      const selectedItem = find({id: this.props.selected_id}, this.props.weightedItems)
      return selectedItem.position
    }
  
    render() {
      
      return (
        <Div height="92vh">
            <LeafletMap style={{"height": "100%"}}  center={this.getCenter()} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CoordinatesControl position="bottomright"/>
                {
                  map(weightedItem => 
                  <Marker position={weightedItem.position} icon={this.getMarkerIcon(weightedItem.id)}>
                    <Popup>{weightedItem.name} <br/> score: {weightedItem.score}</Popup>
                  </Marker> , 
                  this.props.weightedItems)
                }
            </LeafletMap>
        </Div>
      )
    }
  }


  const mapStateToProps = state => ({
    weightedItems: state.weightedItems.items,
    selected_id: state.ui.selectedWeightedItemID,
  })

  export default connect(mapStateToProps)(Map);