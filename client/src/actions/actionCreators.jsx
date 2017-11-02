import { CALL_API } from 'redux-api-middleware';
import { API_CONFIG } from '../config.jsx';
import actionTypes from './actionTypes.jsx';

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

export default {
    getBuildingData
}
