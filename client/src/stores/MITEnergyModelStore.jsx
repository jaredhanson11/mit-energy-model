import { configureStore } from './';

import  MITEnergyModelReducer  from '../reducers/MITEnergyModelReducer.jsx';

var MITEnergyModelState = {

    buildingMapApi: {
        loading: false,
        loaded: false,
        error: false,
        errorMessage: ''
    },

    buildingMapData: {}
}

var configuredStore = configureStore(MITEnergyModelReducer, MITEnergyModelState);

export default configuredStore;
