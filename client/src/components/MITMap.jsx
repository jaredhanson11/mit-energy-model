import React from 'react';
import {Map, TileLayer, GeoJSON, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
const GJV = require("geojson-validation");
import campus from '../data.json';
import { actionCreators } from '../actions';


//Map Data and Constraints
const zoomSettings = {
    minZoom: 15,
    zoom: 15.5,
    center: [42.358888, -71.093624],
    maxBounds: L.latLngBounds(L.latLng(42.368482 + .005, -71.117361 - .005), L.latLng(42.352833 - .005, -71.068609 + .005))
}

class MITMap extends React.Component {

    constructor(props) {
        super(props);
        this.style = this.style.bind(this);
    }


    onEachFeature(dispatch) {
        function _onEachFeature(feature, layer) {
            layer.on('click', function(e) {
                if (feature.properties && feature.properties.building_number) {
                    const building_number = feature.properties.building_number;
                    dispatch(actionCreators.selectBuilding(building_number));
                }
            });
        }
        return _onEachFeature;
    }

    style(feature) {

        var defaultStyle = {
            weight: 1,
            opacity: 1,
            color: 'rgb(10, 10, 4)',
            fillOpacity: 0.5,
            dashCapacity: 3,
            fillColor: 'rgb(54, 230, 77)'
        };

        var building_number = feature.properties.building_number;
        var energy_type = this.props.campusData.selected;
        if (building_number && this.props.campusData.campus) {
            var building = this.props.campusData.campus[building_number];
            if (building && building.measured_summary) {
                if (building.measured_summary[energy_type].month_total > building.measured_summary[energy_type].monthly_avg){
                var newStyle = Object.assign({}, defaultStyle);
                newStyle.fillColor = 'rgb(200, 50, 85)';
                return newStyle;
                }
            }
        }

        return defaultStyle;

    }

    render() {
        return (
            <div style={{height: '100%', width: '70%', display:'inline-block', outline:'1px solid grey'}}>
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
                    <GeoJSON key={Math.random()} data={this.props.geojson} style={this.style} onEachFeature={this.onEachFeature(this.props.dispatch)}/>
                </Map>
            </div>
        )}
    }

    export default MITMap;
