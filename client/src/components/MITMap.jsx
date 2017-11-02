import React from 'react';
import Building from '../components/Building.jsx';
import {Map, TileLayer, GeoJSON, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
const GJV = require("geojson-validation");
import campus from '../data.json';

//Map Data and Constraints
const zoomSettings = {
    minZoom: 15,
    zoom: 15.5,
    center: [42.358888, -71.093624],
    maxBounds: L.latLngBounds(L.latLng(42.368482, -71.117361), L.latLng(42.352833, -71.068609))
}

class MITMap extends React.Component {

    constructor(props) {
        super(props);
        this.style = this.style.bind(this);
    }

    onEachFeature(feature, layer) {

        //calculate the correct color here, get the API call and load

        if (feature.properties && feature.properties.building_number) {
            layer.bindPopup(feature.properties.building_number);
        }
    }

    style(feature) {

        var defaultStyle = {
            weight: 2,
            opacity: 1,
            color: 'rgb(10, 10, 4)',
            dashArray: '3',
            fillOpacity: 0.5,
            fillColor: 'rgb(54, 230, 77)'
        };

        if (feature.properties && feature.properties.building_number) {
            if (feature.properties.building_number < 30) {
                var newStyle = Object.assign({}, defaultStyle);
                newStyle.fillColor = 'rgb(200, 50, 85)';
                return newStyle;
            }
        }
        return defaultStyle;

    }

    render() {
        return (
            <div style={{marginTop:'20px'}}>
                <Map
                minZoom={zoomSettings.minZoom}
                center={zoomSettings.center}
                zoom={zoomSettings.zoom}
                maxBounds={zoomSettings.maxBounds}
                >
                    <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png'
                    />
                    <GeoJSON data={campus} style={this.style} onEachFeature={this.onEachFeature}/>
                </Map>
            </div>
        )}
    }

    export default MITMap;
