import React from 'react';
import { actionCreators } from '../actions';

import _style from '../styles/ResourceTypeFilterStyle.jsx';
import config from '../config.jsx';

export default class ResourceTypeFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hover: false};
        this.toggleHover = this.toggleHover.bind(this);
    }

    toggleHover(isHovered) {
        var that = this;
        function _toggleHover() {
            that.setState({hover: isHovered});
        }
        return _toggleHover
    }

    renderHover() {
        var resources = ['total', 'stm', 'chw', 'elec'];
        var resourceImgs = resources.map(function(ele){
            const resourceImgUrl = config.getImgUrl('filterIcons', ele);
            return (
                <div>
                    <img style={_style.preview.img} src={resourceImgUrl} />
                </div>
            );
        });
        return (
            <div style={_style.hovered.container} onMouseLeave={this.toggleHover(false)} >
                {resourceImgs}
            </div>
        );
    }

    render() {
        if (this.state.hover) {
            return this.renderHover();
        }

        const selectedResourceImgUrl = config.getImgUrl('filterIcons', this.props.filterState.selectedResource);
        return (
            <div style={_style.preview.container} onMouseEnter={this.toggleHover(true)} >
                <img style={_style.preview.img} src={selectedResourceImgUrl} />
            </div>
        );
    }
}
