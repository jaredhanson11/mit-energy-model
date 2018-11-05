import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import MITEnergyModelContainer from './containers/MITEnergyModelContainer.jsx';

ReactDOM.render(
    <MITEnergyModelContainer />
    , document.getElementById('main')
)
