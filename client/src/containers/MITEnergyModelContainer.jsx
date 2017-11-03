import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import MITMap from '../components/MITMap.jsx';

//some dummy data to test the redux flow, if it is successful these buildings will be red
const dummyBuildingData = {
    "1": 0.5,
    "2": 0.5,
    "3": 0.5,
    "4": 0.5,
    "5": 0.5,
    "6": 0.5,
};

class MITEnergyModelContainer extends React.Component {

    constructor(props) {
      super(props);
    }

    componentWillMount() {
      this.props.dispatch(actionCreators.getBuildingData());
      this.props.dispatch(actionCreators.loadGeojsonData());
      this.props.dispatch(actionCreators.addGeojsonGradient(dummyBuildingData));
    }

    render() {
        return (
            <div>
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
