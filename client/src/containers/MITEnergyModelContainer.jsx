import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import styled from 'styled-components';

import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import MITMap from '../components/MITMap.jsx';
import MITMapFilter from '../components/MITMapFilter';
import MenuBarContainer from '../components/MenuBar.jsx';
import GraphSection from '../components/GraphSection';
import SubGraphSection from '../components/SubGraphSection';
import OverviewSection from '../components/OverviewSection';

import _style from '../styles/MITEnergyModelContainerStyle.js';

var FullScreenContainer = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
    flex-direction: column;
`;

var MainContainer = styled.div`
    width: 100%;
    height: 100%;
    flex-grow: 0;

    display: flex;
    flex-direction: row;

    align-items: center;
    align-content: center;
    justify-content: center;
`;

var MainColumn = styled.div`
    height: 100%;
    width: ${props => props.width};
    padding: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    &:not(:first-child) {
        padding-left: 0;
    }
`;

var MainColumnSection = styled.div`
    display: flex;
    flex-direction: column;

    height: ${props => props.height};
    width: 100%;
    padding: ${props => props.padding ? props.padding : '0'};

    border-radius: 5px;
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
            <FullScreenContainer>
                <MenuBarContainer title="MIT Campus Energy Model"></MenuBarContainer>
                <MainContainer>
                    <MainColumn width={'50%'} style={{paddingRight: '10px'}}>
                        <MainColumnSection height={'calc(30%)'} padding={'0px'} style={{paddingTop: 0}}>
                            <MITMapFilter />
                        </MainColumnSection>
                        <MainColumnSection height={'calc(70%)'}>
                            <MITMap
                                width={'100%'} />
                        </MainColumnSection>
                    </MainColumn>
                    <MainColumn width={'50%'} style={{paddingLeft: '10px'}}>
                        <MainColumnSection height={'calc(70%)'} padding={'0px'}>
                            <GraphSection
                                filterState={this.props.filterState}
                                buildingData={this.props.buildingMapData}
                                dispatch={this.props.dispatch}
                            />
                        </MainColumnSection>
                        <MainColumnSection height={'calc(30%)'} padding={'0px'}>
                            <SubGraphSection
                                filterState={this.props.filterState}
                                buildingData={this.props.buildingMapData}
                            />
                        </MainColumnSection>
                    </MainColumn>
                </MainContainer>
            </FullScreenContainer>
        )
    }
}

var mapStateToProps = function(state) {
    var immutableState = Immutable.fromJS(state);
    var newState = immutableState.toJS();
    return newState;
};

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