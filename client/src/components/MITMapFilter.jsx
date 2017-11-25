import React from 'react';
import { connect } from 'react-redux';
import { actionCreators } from '../actions';

import _style from '../styles/MITMapFilterStyle.js';
import config from '../config.jsx';

import FilterType from './FilterType.jsx';

class MITMapFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={_style.container}>
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
            </div>
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
        selectBuildingType: (filterKey) => {dispatch(actionCreators.selectBuildingType(filterKey))},
        selectResourceType: (filterKey) => dispatch(actionCreators.selectResourceType(filterKey)),
        selectUnitsType: (filterKey) => dispatch(actionCreators.selectUnits(filterKey))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MITMapFilter);
