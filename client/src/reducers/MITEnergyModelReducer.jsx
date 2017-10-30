import { combineReducers } from 'redux';
import Immutable from 'immutable';

var buildingMapApiReducer = function(state={}, action){
    switch (action.type) {
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

var buildingMapDataReducer = function(state={}, action){
    switch (action.type) {
        default:
            var newState = Immutable.fromJS(state);
            newState = newState.toJS();
            return newState;
    }
}

var MITEnergyModelReducer = combineReducers({
    buildingMapApi: buildingMapApiReducer,
    buildingMapData: buildingMapDataReducer
})

export default MITEnergyModelReducer;
