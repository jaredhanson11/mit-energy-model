import { CALL_API } from 'redux-api-middleware';
import { API_CONFIG } from '../config.jsx';
import actionTypes from './actionTypes.jsx';

import campus from '../data/geojson/campus.json';
import { historical_data } from '../data/energy/historic';

// UI State
function selectResourceType(resourceType) {
    return {
        type: actionTypes.SELECT_RESOURCE_TYPE,
        selectedResource: resourceType
    }
}

function selectUnits(selectedUnits) {
    return {
        type: actionTypes.SELECT_UNIT_TYPE,
        selectedUnits: selectedUnits
    }
}

function selectBuildingType(selectedBuildingType) {
    return {
        type: actionTypes.SELECT_BUILDING_TYPE,
        selectedBuildingType: selectedBuildingType
    }
}

function selectBuilding(selectedBuilding) {
    return {
        type: actionTypes.SELECT_BUILDING,
        selectedBuilding: selectedBuilding
    }
}

function selectUnitsNormalizedType(unitsNormalized) {
    return {
        type: actionTypes.SELECT_UNITS_NORMALIZED,
        selectedUnitsNormalized: unitsNormalized
    }
}

function selectDataSource(dataSourceSelected) {
    return {
        type: actionTypes.SELECT_DATA_SOURCE,
        selectedDataSource: dataSourceSelected
    }
}

function selectTimelineYear(year) {
    return {
        type: actionTypes.SELECT_YEAR,
        selectedYear: year
    }
}

function selectGraphToggle(selectedGraphToggle) {
    return {
        type: actionTypes.SELECT_GRAPH_TOGGLE,
        selectedGraph: selectedGraphToggle
    }
}

function toggleFilter(expandFilter) {
    return {
        type: actionTypes.TOGGLE_FILTER,
        expandFilter: expandFilter
    }
}

function getBuildingData() {
    return {
        [CALL_API] : {
            method: 'get',
            endpoint: API_CONFIG.building_data_endpoint,
            headers: API_CONFIG.default_headers,
            types: [actionTypes.GET_BUILDING_DATA, actionTypes.GET_BUILDING_DATA_SUCCESS, actionTypes.GET_BUILDING_DATA_FAILURE]
        }
    }
}

function loadGeojsonData() {
    return {
        type: actionTypes.LOAD_GEOJSON_DATA,
        geojson: campus
    }
}

function loadHistoricalData() {
    return {
        type: actionTypes.LOAD_HISTORICAL_DATA,
        historicalData: historical_data
    }
}

export default {
    getBuildingData,
    loadGeojsonData,
    loadHistoricalData,
    selectResourceType,
    selectBuildingType,
    selectUnits,
    selectUnitsNormalizedType,
    selectBuilding,
    selectDataSource,
    selectTimelineYear,
    selectGraphToggle,
    toggleFilter
}
