import React from 'react';
import { connect } from 'react-redux';
import { actionCreators } from '../actions';

import { FilterContainer } from '../styles/MITMapFilterStyle.js';

import FilterType from './FilterType.jsx';

class MITMapFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FilterContainer>
                <FilterType filterKey={'resourceType'}
                    filterState={this.props.filterState}
                    selectFilter={this.props.selectResourceType}
                />
                <FilterType filterKey={'unitsType'}
                    filterState={this.props.filterState}
                    selectFilter={this.props.selectUnitsType}
                />
                <FilterType filterKey={'buildingType'}
                    filterState={this.props.filterState}
                    selectFilter={this.props.selectBuildingType}
                />
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
    return {
        selectFilter: (filterKey) => {dispatch(actionCreators.selectBuildingType(filterKey))},
        selectResourceType: (filterKey) => dispatch(actionCreators.selectResourceType(filterKey)),
        selectUnitsType: (filterKey) => dispatch(actionCreators.selectUnits(filterKey))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MITMapFilter);
