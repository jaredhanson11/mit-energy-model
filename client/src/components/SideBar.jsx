import React from 'react';
const GJV = require("geojson-validation");
import { actionCreators } from '../actions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import store from '../stores/MITEnergyModelStore.jsx';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';

import _style from '../styles/SideBarStyle.js';


import BuildingSummary from './BuildingSummary.jsx';
import EnergyChart from './EnergyChart.jsx';

class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    renderCampusOverview() {
        return (
            <div style={_style.container} >
                <BuildingSummary
                    buildingData={this.props.buildingMapData}
                    selectedBuilding={this.props.filterState.selectedBuilding}
                />
            </div>
        );
    }

    renderSelectedBuilding() {
        return (
            <div style={_style.container}>
                {this.props.filterState.selectedBuilding}
            </div>
        );
    }

    render() {
        var selectedBuilding = this.props.filterState.selectedBuilding;
        if (selectedBuilding == '') {
            return this.renderCampusOverview();
        } else {
            return this.renderSelectedBuilding();
        }
    }
}

var mapStateToProps = function(state) {
    var immutableState = Immutable.fromJS(state);
    var newState = immutableState.toJS();
    return newState;
}

var mapDispatchToProps = function(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);

