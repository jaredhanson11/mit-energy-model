import React from 'react';
import { Map, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
const GJV = require("geojson-validation");
import { actionCreators } from '../actions';

import { connect } from 'react-redux';

import _style from '../styles/MITMapStyle.js';

import chroma from 'chroma-js';
import DefaultBuildingStyle from '../styles/DefaultBuildingStyle.jsx';

class MITMap extends React.Component {

    constructor(props) {
        super(props);
        this.featureStyle = this.featureStyle.bind(this);
        this.getBuildingStyle = this.getBuildingStyle.bind(this);
        this.interpolate = this.interpolate.bind(this);
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

    interpolate(min, max, val) {
        return (val-min)/ (max-min)
    }

    getBuildingStyle(buildingDataEntireYear, metricsForBuildingType, EUI, buildingType) {
        var yearly_min = metricsForBuildingType.year_min;
        var yearly_max = metricsForBuildingType.year_max;
        var scale = chroma.scale(['#7d8180', '#d91111']);
        var newStyle = {
            weight: 1,
            opacity: 1,
            color: 'rgb(10, 10, 4)',
            fillOpacity: .5,
            dashCapacity: 3,
            fillColor: scale(this.interpolate(yearly_min, yearly_max, buildingDataEntireYear))
        };
        return newStyle;
    }

    featureStyle(feature) {
        var buildingNumber = feature.properties.building_number;
        var buildingType = feature.properties.building_type;
        var selectedResource = this.props.filterState.selectedResource;
        var selectedUnits = this.props.filterState.selectedUnits;
        var selectedBuildingTypes = this.props.filterState.selectedBuildingType;

        if (!(this.props.buildingMapApi.loaded) || this.props.buildingMapData.campus[buildingNumber] == undefined) { return DefaultBuildingStyle; }
        var includeBuildingBool = selectedBuildingTypes.includes(buildingType.toLowerCase()) ? true : false;
        if (!(includeBuildingBool)) { return DefaultBuildingStyle }

        var unit_alt_name = {'kwh' : 'measured_kwh_norm', 'co2' : 'measured_c02_norm',}
        var buildingDataEntireYear = this.props.buildingMapData.campus[buildingNumber].building_summary[unit_alt_name[selectedUnits]][selectedResource].year_total;
        var metricsForBuildingType = this.props.buildingMapData.campus_summary[buildingType][unit_alt_name[selectedUnits]][selectedResource];
        var EUI = this.props.buildingMapData.campus[buildingNumber].building_metadata.building_eui;

        var buildingStyle = this.getBuildingStyle(buildingDataEntireYear, metricsForBuildingType, EUI, selectedBuildingTypes);
        return buildingStyle;
    }

    render() {
        const mapStyle = Object.assign({}, _style.map, {
            width: this.props.width,
            borderRadius: '10px'
        });
        return (
            <Map style={mapStyle}
            minZoom={_style.zoomSettings.minZoom}
            center={_style.zoomSettings.center}
            zoom={_style.zoomSettings.zoom}
            maxBounds={_style.zoomSettings.maxBounds}
            zoomControl={false} >
                <ZoomControl position={_style.zoomControl.position} />
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png'
                    />
                <GeoJSON style={this.featureStyle}
                    data={this.props.geojsonData}
                    key={Math.random()}
                    onEachFeature={this.onEachFeature()} />
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
