import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-bootstrap-treeview/public/css/react-bootstrap-treeview.css';
import 'react-bootstrap-treeview/public/js/react-bootstrap-treeview.js';

import MITEnergyModelContainer from './containers/MITEnergyModelContainer.jsx';

ReactDOM.render(
    <MITEnergyModelContainer />
    , document.getElementById('main')
)
