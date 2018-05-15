import { configureStore } from './';

import  MITEnergyModelReducer  from '../reducers/MITEnergyModelReducer.jsx';

var MITEnergyModelState = {

    filterState: {
        selectedResource: ['chw', 'stm', 'elec'],
        selectedBuildingType: ['laboratory', 'academic', 'residential', 'services'],
        selectedBuilding: '',
        selectedUnits: 'kwh',
        selectedUnitsNormalized: 'per_year',
        selectedDataSource: 'metered',
        selectedYear: '2018',
        selectedGraphToggle: 'overview'
    },

    buildingMapApi: {
        loading: false,
        loaded: false,
        error: false,
        errorMessage: ''
    },

    buildingMapData: {
    },

    geojsonData: {}
}

var configuredStore = configureStore(MITEnergyModelReducer, MITEnergyModelState);

export default configuredStore;
