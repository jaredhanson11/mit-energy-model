import { combineReducers } from 'redux';
import Immutable from 'immutable';
import { actionTypes } from '../actions';

import { getCampusSummary, reformatBackendData, summarizeMonthlyEnergyData } from './dataProcessing.jsx';

var filterStateReducer = function(state={}, action){
    switch (action.type) {
        case actionTypes.SELECT_RESOURCE_TYPE:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selectedResource = action.selectedResource;
            return newState;
        case actionTypes.SELECT_UNIT_TYPE:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selectedUnits = action.selectedUnits;
            return newState;
        case actionTypes.SELECT_BUILDING_TYPE:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selectedBuildingType = action.selectedBuildingType;
            return newState;
        case actionTypes.SELECT_BUILDING:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selectedBuilding = action.selectedBuilding;
            return newState;
        case actionTypes.SELECT_DATA_SOURCE:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selectedDataSource = action.selectedDataSource;
            return newState;
        case actionTypes.SELECT_UNITS_NORMALIZED:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.selectedUnitsNormalized = action.selectedUnitsNormalized;
            return newState;
        case actionTypes.TOGGLE_FILTER:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.filterExpanded = action.expandFilter;
            return newState;
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

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
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            newState.campus = reformatBackendData(action.payload.content.campus);
            for (var building in newState.campus) {
                newState.campus[building].building_summary = summarizeMonthlyEnergyData(newState.campus[building]['building_data']);
            }
            newState.campus_summary = getCampusSummary(newState.campus);
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

var historicalBuildingDataReducer = function(state={}, action) {
    switch(action.type) {
        case actionTypes.LOAD_HISTORICAL_DATA:
            var newState = action.historicalData;
            return newState;
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

var MITEnergyModelReducer = combineReducers({
    filterState: filterStateReducer,
    buildingMapApi: buildingMapApiReducer,
    buildingMapData: buildingMapDataReducer,
    geojsonData: geojsonDataReducer,
    historicalBuildingData: historicalBuildingDataReducer
})

export default MITEnergyModelReducer;
