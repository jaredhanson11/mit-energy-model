import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import styled from 'styled-components';

import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import MITMap from '../components/MITMap.jsx';
import MITMapFilter from '../components/MITMapFilter';
import SideBar from '../components/SideBar.jsx';
import SiteTitle from '../components/SiteTitle.jsx';

import _style from '../styles/MITEnergyModelContainerStyle.js';

var MapColumn = styled.div`
    height: 100%;
    width: 70%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: space-between;
`;

var MapHeaderContainer = styled.div`
    height: 30%;
    width: 100%;
    padding: 10px;

    border-radius: 5px;
    box-shadow: 0 3px 7px grey;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: center;
    justify-content: center;
`;

var MapContainer = styled.div`
    height: 69%; // for margin betweeen
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 3px 7px grey;
`;


class MITEnergyModelContainer extends React.Component {

    constructor(props) {
      super(props);
    }

    componentWillMount() {
      this.props.dispatch(actionCreators.getBuildingData());
      this.props.dispatch(actionCreators.loadGeojsonData());
    }

    render() {
        return (
            <div style={_style.fullScreenContainer} >
                <MapColumn>
                    <MapHeaderContainer>
                        <SiteTitle title="MIT GHG Emissions Management" />
                        <MITMapFilter />
                    </MapHeaderContainer>
                    <MapContainer>
                        <MITMap
                            width={_style.MITMap.width} />
                    </MapContainer>
                </MapColumn>
                <SideBar
                    filterState={this.props.filterState}
                    buildingData={this.props.buildingMapData} />
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
