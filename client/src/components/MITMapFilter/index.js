import React from 'react';
import { connect } from 'react-redux';
import { actionCreators } from '../../actions';

import { FilterContainer, FilterColumn } from '../../styles/MITMapFilterStyle.js';

import SelectFilter from './SelectFilter.jsx';
import ToggleFilter from './ToggleFilter.jsx';

class MITMapFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    later() {
        return (<div><ToggleFilter
                        filterKey={'unitsType'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                    <ToggleFilter
                        filterKey={'unitsNormalized'}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    /></div>
                );
    }
    render() {
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
                    <ToggleFilter
                        filterKeys={['unitsType', 'unitsNormalized']}
                        filterState={this.props.filterState}
                        changeFilter={this.props.changeFilter}
                    />
                    <SelectFilter
                        filterKey={'dataSource'}
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
        filterState: state.filterState
    }
}

const mapDispatchToProps = (dispatch) => {

    const functionMap = {
        unitsNormalized: actionCreators.selectUnitsNormalizedType,
        resourceType: actionCreators.selectResourceType,
        unitsType: actionCreators.selectUnits,
        buildingType: actionCreators.selectBuildingType,
        dataSource: actionCreators.selectDataSource
    };
    return {
        changeFilter: (filterTypeKey, filterKey) => dispatch(functionMap[filterTypeKey](filterKey))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MITMapFilter);
