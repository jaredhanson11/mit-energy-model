import { CALL_API } from 'redux-api-middleware';
import { API_CONFIG } from '../config.jsx';
import actionTypes from './actionTypes.jsx';

import campus from '../data.json';

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

export default {
    getBuildingData,
    loadGeojsonData,
    selectResourceType,
    selectBuildingType,
    selectBuilding,
    toggleFilter
}
