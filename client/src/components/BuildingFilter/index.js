import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { actionCreators } from '../../actions';

import SelectFilter from './SelectFilter.jsx';

let FilterContainer = styled.div`
    width: 100%;
    height: 100%;

    padding: 5px;

    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: space-around;
    justify-content: flex-start;

    background-color: white;
`;

let FilterColumn = styled.div`
    width: ${props => props.width};
    height: 100%;

    display: flex;
    flex-flow: column nowrap;
`;

class BuildingFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FilterContainer>
                <FilterColumn 
                    width={'50%'}>
                    <SelectFilter
                        filterKey={'buildingType'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                    <SelectFilter
                        filterKey={'resourceType'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                </FilterColumn>
                <FilterColumn 
                    width={'50%'}>
                    <SelectFilter
                        filterKey={'dataSource'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                    <SelectFilter
                        filterKey={'upgradesCompleted'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                </FilterColumn>
            </FilterContainer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterState: state.filterState,
        buildingData: state.buildingMapData
    }
}

const mapDispatchToProps = (dispatch) => {

    const functionMap = {
        unitsNormalized: actionCreators.selectUnitsNormalizedType,
        resourceType: actionCreators.selectResourceType,
        unitsType: actionCreators.selectUnits,
        buildingType: actionCreators.selectBuildingType,
        dataSource: actionCreators.selectDataSource,
        upgradesCompleted: actionCreators.selectUpgradesCompleted,
    };
    return {
        changeFilter: (filterTypeKey, filterKey) => dispatch(functionMap[filterTypeKey](filterKey)),
        changeYear: (value) => dispatch(actionCreators.selectTimelineYear(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildingFilter);
