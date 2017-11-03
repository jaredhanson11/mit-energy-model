import { combineReducers } from 'redux';
import Immutable from 'immutable';
import { actionTypes } from '../actions';

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
            var newState = action.payload;
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
        case actionTypes.ADD_GEOJSON_GRADIENT:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            for (var building_number in action.data) {
                for (var i = 0; i < newState.features.length; i++) {
                    if (state.features[i].properties.building_number == building_number) {
                        newState.features[i].properties.gradient = action.data[building_number];
                    }
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
