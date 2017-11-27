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

import SelectedBuilding from './SelectedBuilding.jsx';
import SelectedBuildingStyle from '../styles/SelectedBuildingStyle.jsx';

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
                <SelectedBuilding
                    buildingSelected={this.props.filterState.selectedBuilding}
                    deselectBuildingAction={this.props.deselectBuilding}
                    buildingData={this.props.buildingData[this.props.filterState.selectedBuilding]}
                    />
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

const mapDispatchToProps = (dispatch) => {
    return {
        selectBuilding: (buildingNumber) => dispatch(actionCreators.selectBuilding(buildingNumber)),
        deselectBuilding: () => dispatch(actionCreators.selectBuilding(''))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
