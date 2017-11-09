import { combineReducers } from 'redux';
import Immutable from 'immutable';
import { actionTypes } from '../actions';

import { summarizeMonthlyEnergyData } from './dataProcessing.jsx';

var buildingMapApiReducer = function(state={}, action){
    switch (action.type) {
        case actionTypes.GET_BUILDING_DATA:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.loading = true;
            newState.loaded = false;
            newState.error = false;
            newState.errorMessage = '';
            return newState;
        case actionTypes.GET_BUILDING_DATA_SUCCESS:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.loading = false;
            newState.loaded = true;
            return newState;
        case actionTypes.GET_BUILDING_DATA_FAILURE:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.loaded = false;
            newState.loading = false;
            newState.error = true;
            newState.errorMessage = 'There was an error';
            return newState;
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

var buildingMapDataReducer = function(state={}, action){
    switch (action.type) {
        case actionTypes.GET_BUILDING_DATA_SUCCESS:
            var newState = {selected: 'total'};
            newState.campus = action.payload.content.campus;
            newState.campus_summary = {};

            for (var building in newState.campus) {
                const data_summary = summarizeMonthlyEnergyData(newState.campus[building]);
                newState.campus[building].measured_summary = data_summary;
            }
            return newState;
        case 'SELECT_ENERGY_TYPE':
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selected = action.selected;
            return newState;
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

var geojsonDataReducer = function (state={}, action) {
    switch (action.type) {
        case actionTypes.LOAD_GEOJSON_DATA:
            var newState = action.geojson;
            return newState;
        case actionTypes.ADD_GEOJSON_PROPERTY:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            for (var i = 0; i < newState.features.length; i++) {
                if (state.features[i].properties.building_number == action.data.building_number) {
                    newState.features[i].properties[action.data.key] = action.data.value;
                }
            }
            return newState;
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

var MITEnergyModelReducer = combineReducers({
    buildingMapApi: buildingMapApiReducer,
    buildingMapData: buildingMapDataReducer,
    geojsonData: geojsonDataReducer
})

export default MITEnergyModelReducer;
