import React from 'react';
import { connect } from 'react-redux';
import { actionCreators } from '../../actions';

import { FilterContainer, FilterColumn } from '../../styles/MITMapFilterStyle.js';
import OverviewDataProcessor from '../../utils/dataProcessing/OverviewDataProcessor.jsx';

import SelectFilter from './SelectFilter.jsx';
import ToggleFilter from './ToggleFilter.jsx';
import MapGradientLegend from './MapGradientLegend.jsx';
import MapTimelineFilter from './MapTimelineFilter.jsx';

class MITMapFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var dataProcessor = new OverviewDataProcessor(this.props.buildingData, this.props.filterState);
        return (
            <FilterContainer>
                <FilterColumn width={'24%'}>
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
                <FilterColumn width={'24%'}>
                    <SelectFilter
                        filterKey={'dataSource'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                    <ToggleFilter
                        filterKeys={['unitsType', 'unitsNormalized']}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                </FilterColumn>
                <FilterColumn width={'48%'}>
                    <MapTimelineFilter
                        changeYear={this.props.changeYear}
                        filterState={this.props.filterState} />
                    <MapGradientLegend
                        dataProcessor={dataProcessor}
                        selectedBuilding={this.props.filterState.selectedBuilding}
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

    };
    return {
        changeFilter: (filterTypeKey, filterKey) => dispatch(functionMap[filterTypeKey](filterKey)),
        changeYear: (value) => dispatch(actionCreators.selectTimelineYear(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MITMapFilter);
