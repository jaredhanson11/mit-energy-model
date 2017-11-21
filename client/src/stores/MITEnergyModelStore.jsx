import { configureStore } from './';

import  MITEnergyModelReducer  from '../reducers/MITEnergyModelReducer.jsx';

var MITEnergyModelState = {

    filterState: {
        selectedResource: 'total',
        selectedBuildingType: '',
        selectedBuilding: '',
        selectedUnits: 'kwh',
        filterExpanded: false
    },

    buildingMapApi: {
        loading: false,
        loaded: false,
        error: false,
        errorMessage: ''
    },

    buildingMapData: {
          selected: 'total'
    },

    geojsonData: {}
}

var configuredStore = configureStore(MITEnergyModelReducer, MITEnergyModelState);

export default configuredStore;
