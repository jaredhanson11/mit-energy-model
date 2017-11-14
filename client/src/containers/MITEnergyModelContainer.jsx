import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import MITMap from '../components/MITMap.jsx';
import SideBar from '../components/SideBar.jsx';


class MITEnergyModelContainer extends React.Component {

    constructor(props) {
      super(props);
      this.selectSim = this.selectSim.bind(this);
    }

    componentWillMount() {
      this.props.dispatch(actionCreators.getBuildingData());
      this.props.dispatch(actionCreators.loadGeojsonData());
    }

    selectSim(event) {
        this.props.dispatch(actionCreators.selectResourceType(event.target.id));
    }

    render() {
        return (
            <div style={{marginTop: '20px'}} >
                <a id='total' onClick={this.selectSim}>Total</a>
                <a id='chw' onClick={this.selectSim}>Chilled Water</a>
                <a id='stm' onClick={this.selectSim}>Steam</a>
                <a id='elec' onClick={this.selectSim}>Electricity</a>
                <div>
                    <MITMap
                        uiState={this.props.uiState}
                        geojson={this.props.geojsonData}
                        campusData={this.props.buildingMapData}
                        dispatch={this.props.dispatch} />
                    <SideBar
                        buildingData={this.props.buildingMapData}
                        uiState={this.props.uiState} />
                </div>
            </div>
        )
    }
}

var mapStateToProps = function(state) {
    var immutableState = Immutable.fromJS(state);
    var newState = immutableState.toJS();
    return newState;
}

var _MITEnergyModelContainer = connect(mapStateToProps)(MITEnergyModelContainer);

class MITEnergyModelProvider extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <_MITEnergyModelContainer />
            </Provider>
        )
    }
}

export default MITEnergyModelProvider;
