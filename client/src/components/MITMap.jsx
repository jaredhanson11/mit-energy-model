import React from 'react';
import { Map, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
const GJV = require("geojson-validation");
import campus from '../data.json';
import { actionCreators } from '../actions';

import { connect } from 'react-redux';

import _style from '../styles/MITMapStyle.js';
import MITMapFilter from './MITMapFilter.jsx';

class MITMap extends React.Component {

    constructor(props) {
        super(props);
        this.featureStyle = this.featureStyle.bind(this);
    }

    onEachFeature() {

        var that = this;

        function _onEachFeature(feature, layer) {
            layer.on('click', function(e) {
                if (feature.properties && feature.properties.building_number) {
                    const building_number = feature.properties.building_number;
                    that.props.selectBuilding(building_number);
                }
            });
        }
        return _onEachFeature;
    }

    featureStyle(feature) {

        var defaultStyle = {
            weight: 1,
            opacity: 1,
            color: 'rgb(10, 10, 4)',
            fillOpacity: 0.5,
            dashCapacity: 3,
            fillColor: 'rgb(54, 230, 77)'
        };

        var building_number = feature.properties.building_number;
        var energy_type = this.props.buildingMapData.selected;
        if (building_number && this.props.buildingMapData.campus) {
            var building = this.props.buildingMapData.campus[building_number];
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
            <Map style={_style.map}
            minZoom={_style.zoomSettings.minZoom}
            center={_style.zoomSettings.center}
            zoom={_style.zoomSettings.zoom}
            maxBounds={_style.zoomSettings.maxBounds}
            zoomControl={false}
            >
                <ZoomControl position={_style.zoomControl.position} />
                <TileLayer
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png'
                />
                <GeoJSON style={this.featureStyle}
                    data={this.props.geojsonData}
                    key={Math.random()}
                    onEachFeature={this.onEachFeature()} />
                <MITMapFilter />
            </Map>
        )}
    }


const mapStateToProps = (state) => {
    return {
        filterState: state.filterState,
        buildingMapApi: state.buildingMapApi,
        buildingMapData: state.buildingMapData,
        geojsonData : state.geojsonData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectBuilding: (buildingNumber) => dispatch(actionCreators.selectBuilding(buildingNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MITMap);
