import React from 'react';
import {Div} from './common/StyledElements';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { CoordinatesControl } from 'react-leaflet-coordinates'

export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 31.04,
            lng: 34.8,
            zoom: 10,
          }
    }    
  
    render() {
      const position = [this.state.lat, this.state.lng]
      return (
        <Div height="92vh">
            <LeafletMap style={{"height": "100%"}}  center={position} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CoordinatesControl position="bottomright"/>
            </LeafletMap>
        </Div>
      )
    }
  }