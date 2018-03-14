import { configureStore } from './';

import  MITEnergyModelReducer  from '../reducers/MITEnergyModelReducer.jsx';

var MITEnergyModelState = {

    filterState: {
        selectedResource: 'total',
        selectedBuildingType: 'all',
        selectedBuilding: '',
        selectedUnits: 'kwh',
        selectedUnitsNormalized: 'per_year',
        selectedDataSource: 'metered'
    },

    buildingMapApi: {
        loading: false,
        loaded: false,
        error: false,
        errorMessage: ''
    },

    buildingMapData: {
    },

    geojsonData: {},

    historicalBuildingData: {}
}

var configuredStore = configureStore(MITEnergyModelReducer, MITEnergyModelState);

export default configuredStore;
