import React from 'react';
import { Map, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
const GJV = require("geojson-validation");
import { actionCreators } from '../../actions';

import { connect } from 'react-redux';

import _style from '../../styles/MITMapStyle.js';
import MITMapDataProcessor from '../../utils/dataProcessing/MITMapDataProcessor.jsx';
import MapGradientLegend from '../GraphSection/MapGradientLegend.jsx';
import OverviewDataProcessor from '../../utils/dataProcessing/OverviewDataProcessor.jsx';

import chroma from 'chroma-js';
import DefaultBuildingStyle from '../../styles/DefaultBuildingStyle.jsx';

class MITMap extends React.Component {
    constructor(props) {
        super(props);
        this.featureStyle = this.featureStyle.bind(this);
        this.filterFeatures = this.filterFeatures.bind(this);
        this.getBuildingStyle = this.getBuildingStyle.bind(this);
        this.interpolate = this.interpolate.bind(this);
    }

    onEachFeature() {
        var that = this;
        function _onEachFeature(feature, layer) {
            layer.bindPopup('<h3>Building ' + feature.properties.building_number.toUpperCase() + '</h3>');
            layer.on('click', function (e) {
                if (feature.properties && feature.properties.building_number) {
                    //here when building is clicked
                    const building_number = feature.properties.building_number;
                    that.props.selectBuilding(building_number);
                    this.closePopup();
                }
            });
            layer.on('mouseover', function () { this.openPopup() })
            layer.on('mouseout', function () { this.closePopup() })
        }
        return _onEachFeature;
    }

    filterFeatures(feature) {
        return this.dataProcessing.containsBuilding(feature.properties.building_number);
    }

    interpolate(min, max, val) {
        return (val - min) / (max - min)
    }

    getBuildingStyle(campus_min, campus_max, buildingEnergyData, selected) {
        var scale = chroma.scale(['#7d8180', '#d91111']).domain([campus_min, campus_max]);
        var newStyle = {
            weight: 1,
            opacity: 1,
            color: 'rgb(10, 10, 4)',
            fillOpacity: .5,
            dashCapacity: 3,
            fillColor: scale(buildingEnergyData)
        };
        if (selected) {
            newStyle.color = 'black';
            newStyle.weight = 3;
        }
        return newStyle;
    }

    featureStyle(feature) {
        var buildingNumber = feature.properties.building_number.toLowerCase();

        if (!(this.dataProcessing.containsBuilding(buildingNumber))) {
            return DefaultBuildingStyle;
        }

        var buildingEnergyData = this.dataProcessing.getBuildingEnergyUsage(buildingNumber);
        var campusMax = this.dataProcessing.getCampusMax();
        var campusMin = this.dataProcessing.getCampusMin();
        var selected = (buildingNumber == this.props.filterState.selectedBuilding.toLowerCase());
        var buildingStyle = this.getBuildingStyle(campusMin, campusMax, buildingEnergyData, selected);
        return buildingStyle;
    }

    render() {
        this.dataProcessing = new MITMapDataProcessor(this.props.buildingMapData, this.props.filterState);

        var dataProcessor = new OverviewDataProcessor(this.props.buildingMapData, this.props.filterState);

        const mapStyle = Object.assign({}, _style.map, {
            width: this.props.width
        });
        
        return (
            <Map style={mapStyle}
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
                    onEachFeature={this.onEachFeature()}
                    filter={this.filterFeatures}
                />
                <MapGradientLegend
                    dataProcessor={dataProcessor}
                    selectedBuilding={this.props.filterState.selectedBuilding}>
                </MapGradientLegend>
            </Map>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterState: state.filterState,
        buildingMapApi: state.buildingMapApi,
        buildingMapData: state.buildingMapData,
        geojsonData: state.geojsonData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectBuilding: (buildingNumber) => dispatch(actionCreators.selectBuilding(buildingNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MITMap);
