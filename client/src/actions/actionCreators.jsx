import { CALL_API } from 'redux-api-middleware';
import { API_CONFIG } from '../config.jsx';
import actionTypes from './actionTypes.jsx';

import campus from '../data.json';

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

function addGeojsonGradient(buildingColorsDictionary) {
    return {
        type: actionTypes.ADD_GEOJSON_GRADIENT,
        data: buildingColorsDictionary
    }
}

export default {
    getBuildingData,
    loadGeojsonData,
    addGeojsonGradient
}
