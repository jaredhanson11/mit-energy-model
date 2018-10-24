import React from 'react';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';
import styled from 'styled-components';

import { actionCreators } from '../actions';
import store from '../stores/MITEnergyModelStore.jsx';
import BuildingFilter from '../components/BuildingFilter';
import TitleBarContainer from '../components/TitleBar.jsx';
import GraphSection from '../components/GraphSection';
import SubGraphSection from '../components/SubGraphSection';
import OverviewSection from '../components/OverviewSection';
import ListMapSelector from '../components/ListMapSelector.jsx';

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
                <TitleBarContainer title="MIT Campus Energy Model"></TitleBarContainer>

                <MainContainer>
                    
                    {/* Selection panel */}
                    <MainColumn 
                        width={'50%'} 
                        style={{
                            paddingRight: '0px'
                        }}>
                        <MainColumnSection 
                            height={'calc(30%)'} 
                            padding={'0px'} 
                            style={{
                                paddingTop: 0,
                                backgroundColor: 'white'
                            }}>
                            <BuildingFilter>

                            </BuildingFilter>
                        </MainColumnSection>
                        <MainColumnSection 
                            height={'calc(70%)'}
                            style={{
                                backgroundColor: 'green'
                            }}>
                            <ListMapSelector>

                            </ListMapSelector>
                        </MainColumnSection>
                    </MainColumn>

                    {/* Graph panel */}
                    <MainColumn 
                        width={'50%'} 
                        style={{
                            paddingLeft: '0px'
                        }}>
                        <MainColumnSection 
                            height={'calc(70%)'} 
                            padding={'20px'}
                            style={{
                                backgroundColor: 'white'
                            }}>
                            <GraphSection
                                filterState={this.props.filterState}
                                buildingData={this.props.buildingMapData}
                                dispatch={this.props.dispatch}
                            >
                            </GraphSection>
                        </MainColumnSection>
                        <MainColumnSection 
                            height={'calc(30%)'} 
                            padding={'20px'}
                            style={{
                                backgroundColor: 'white',
                                paddingTop: '0'
                            }}>
                            <SubGraphSection
                                filterState={this.props.filterState}
                                buildingData={this.props.buildingMapData}
                            />
                        </MainColumnSection>
                    </MainColumn>

                    {/* Updates/budget panel */}
                    <MainColumn 
                        width={'50%'} 
                        style={{
                            paddingLeft: '10px',
                            display: 'none',
                            backgroundColor: 'brown'
                        }}>
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