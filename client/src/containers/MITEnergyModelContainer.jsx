import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';

import store from '../stores/MITEnergyModelStore.jsx';

import MITMap from '../components/MITMap.jsx';

class MITEnergyModelContainer extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        clickedButton: "Total"
      }

      this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
      this.setState({
        clickedButton: "Total"
      })
    }


    handleClick(e) {

      this.setState({
        clickedButton : e.target.id
      })
    }

    render() {
        return (
            <div>
                <div>
                  <p>You are looking at: {this.state.clickedButton}</p>
                  <button id="Total" onClick={(e) => this.handleClick(e)}> Total </button>
                  <button id="Electricity" onClick={(e) => this.handleClick(e)}> Electricity </button>
                  <button id="Water" onClick={(e) => this.handleClick(e)}> Chilled Water </button>
                  <button id="Steam" onClick={(e) => this.handleClick(e)}> Steam </button>
                </div>
                <div>
                  <MITMap utility={this.state.clickedButton}/>
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
