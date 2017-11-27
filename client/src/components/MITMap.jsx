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

        console.log(this.props);

        //building specific
        var buildingNumber = feature.properties.building_number;
        var buildingType = feature.properties.building_type;

        //selected
        var selectedResource = this.props.filterState.selected_resource;
        var selectedUnits = this.props.filterState.selectedUnits;
        var selectedBuildingType = this.props.filterState.selectedBuildingType;

        //dynamic stuff
        var includeBuildingBool = true;
        if (!(selectedBuildingType == 'all')) {
            var includeBuildingBool = buildingType == selectedBuildingType ? true : false;
        }

        resource_alt_name = {
            'kwh' : 'measured_kwh',
            'co2' : 'measured_c02',
            'kwh_normalized' : 'measured_kwh_norm',
            'co2_normalized' : 'measured_c02_norm'
        }

        // var selectedResourceValue = this.props.buildingMapData.campus.buildingNumber.building_data[resource_alt_name[selectedResource]]

        var defaultStyle = {
            weight: 1,
            opacity: 1,
            color: 'rgb(10, 10, 4)',
            fillOpacity: 0.5,
            dashCapacity: 3,
            fillColor: 'rgb(137, 37, 213)'
        };

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
