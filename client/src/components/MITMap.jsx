import React from 'react';

import Building from './Building.jsx';
import {Map, TileLayer, GeoJSON, Marker, Popup} from 'react-leaflet';
const center = [42.358888, -71.093624];
const zoom = 15.5;
var GJV = require("geojson-validation");

import campus from './data.json';

// GJV.isFeature(campus, function(valid, errs){
//     //log the errors
//     if(!valid){
//        console.log(errs);
//     }
// });

class MITMap extends React.Component {

    constructor(props) {
      super(props);
      this.style = this.style.bind(this);
    }

    onEachFeature(feature, layer) {

      if (feature.properties && feature.properties.building_number) {
        layer.bindPopup(feature.properties.building_number);
      }
    }
    style(feature) {
        // console.log(feature.properties.building_number)
        if (this.props.utility == "Total") {
            return {
               weight: 2,
               opacity: 1,
               color: '#5c5c5c',
               dashArray: '3',
               fillOpacity: 0.5,
               fillColor: '#ff0000'
            };
        }
        else if (this.props.utility == "Electricity"){
            return {
                weight: 2,
                opacity: 1,
                color: '#5c5c5c',
                dashArray: '3',
                fillOpacity: 0.5,
                fillColor: '#f9fb0a'
            };
        }
        else if (this.props.utility == "Water"){
            return {
                weight: 2,
                opacity: 1,
                color: '#5c5c5c',
                dashArray: '3',
                fillOpacity: 0.5,
                fillColor: '#01ff1f'
            };
        }
        else {
            return {
               weight: 2,
               opacity: 1,
               color: '#5c5c5c',
               dashArray: '3',
               fillOpacity: 0.5,
               fillColor: '#ff8100'
            };
         }
    }
    render() {
        return (
            <div style={{marginTop:'20px'}}>
                <Map
                    center={center}
                    zoom={zoom}>
                    <TileLayer
                        attribution='© OpenStreetMap'
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />

                    <Marker position={[42.362432, -71.086086]}>
                        <Popup>
                            <div>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </div>
                        </Popup>
                    </Marker>
                    <GeoJSON data={campus} style={this.style} onEachFeature={this.onEachFeature}/>
                </Map>
            </div>
        )
    }
}

export default MITMap;
