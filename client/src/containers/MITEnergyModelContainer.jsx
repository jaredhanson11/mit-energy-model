import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import MITMap from '../components/MITMap.jsx';

class MITEnergyModelContainer extends React.Component {

    constructor(props) {
      super(props);
    }

    componentWillMount() {
      this.props.dispatch(actionCreators.getBuildingData());
    }

    render() {
        return (
            <div>
                <div>
                  <MITMap/>
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
