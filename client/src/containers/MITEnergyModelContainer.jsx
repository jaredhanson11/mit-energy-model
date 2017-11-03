import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import MITMap from '../components/MITMap.jsx';

//some dummy data to test the redux flow, if it is successful these buildings will be red
const dummyBuildingData = {
    'sim1': {
        "1": 0.5,
        "2": 0.5,
        "3": 0.5,
        "4": 0.5,
        "5": 0.5,
        "6": 0.5,
    },
    'sim2': {
        '7': .5,
        '8': .5,
        '9': .5,
        '10': .5,
        '11': .5
    },
    'sim3': {
        '12': .5,
        '13': .5,
        '14': .5,
        '15': .5,
        '16': .5
    }
};

class MITEnergyModelContainer extends React.Component {

    constructor(props) {
      super(props);
      this.selectSim = this.selectSim.bind(this);
    }

    componentWillMount() {
      this.props.dispatch(actionCreators.getBuildingData());
      this.props.dispatch(actionCreators.loadGeojsonData());
      this.props.dispatch(actionCreators.addGeojsonGradient(dummyBuildingData['sim1']));
    }

    selectSim(event) {
        this.props.dispatch(actionCreators.loadGeojsonData());
        this.props.dispatch(actionCreators.addGeojsonGradient(dummyBuildingData[event.target.id]));
    }

    render() {
        return (
            <div>
                <a id='sim1' onClick={this.selectSim}>Simulation 1</a>
                <a id='sim2' onClick={this.selectSim}>Simulation 2</a>
                <a id='sim3' onClick={this.selectSim}>Simulation 3</a>
                <div>
                  <MITMap geojson={this.props.geojsonData}/>
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
