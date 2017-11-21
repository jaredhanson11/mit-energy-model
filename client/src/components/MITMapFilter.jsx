import React from 'react';
import { actionCreators } from '../actions';

import _style from '../styles/MITMapFilterStyle.js';
import config from '../config.jsx';

import ResourceTypeFilter from './ResourceTypeFilter.jsx';

class MITMapFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={_style.container}>
                <ResourceTypeFilter filterState={this.props.filterState} />
            </div>
        );
    }
}

export default MITMapFilter;
