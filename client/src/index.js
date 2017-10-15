import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';

import MITEnergyModelContainer from './containers/MITEnergyModelContainer.jsx';

// var initialState = {};

// var store = configureStore(initialState);

ReactDOM.render(
    <MITEnergyModelContainer />
    , document.getElementById('main')
)
