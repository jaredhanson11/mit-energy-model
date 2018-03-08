import React from 'react';
import { actionCreators } from '../actions';

import _style from '../styles/FilterTypeStyle.jsx';
import { getSelectFilterConfig } from '../config.jsx';

export default class FilterType extends React.Component {
    constructor(props) {
        super(props);
        this._config = getSelectFilterConfig(this.props.filterKey);
        this.state = {hover: false};
        this.toggleHover = this.toggleHover.bind(this);
        this._selectFilter = this._selectFilter.bind(this);
    }

    toggleHover(isHovered) {
        var that = this;
        function _toggleHover() {
            that.setState({hover: isHovered});
        }
        return _toggleHover
    }

    _getFilterKey() {
        return this.props.filterState[this._config.filterStateKey];
    }

    _selectFilter(key, selectFilter) {
        var closeHover = this.toggleHover(false);
        var _filter = (event) => {
            closeHover();
            return selectFilter(key);
        }
        return _filter;
    }

    _renderHoveredImg(key) {
        const imgUrl = this._config.icons[key];
        const imgDiv = (
            <div key={key} style={_style.hovered.imgContainer} onClick={this._selectFilter(key, this.props.selectFilter)} >
                <img style={_style.hovered.img} src={imgUrl} />
            </div>
        );
        return imgDiv;
    }

    renderHover() {
        const selectedFilterKey = this._getFilterKey();
        var expandedImgs = [];
        expandedImgs.push(this._renderHoveredImg(selectedFilterKey));
        var that = this;

        this._config.keys.forEach(function(ele){
            if (ele == selectedFilterKey) {
                return;
            }
            expandedImgs.push(that._renderHoveredImg(ele));
        });
        return (
            <div style={_style.hovered.container} onMouseLeave={this.toggleHover(false)} >
                {expandedImgs}
            </div>
        );
    }

    renderPreview() {

    }

    render() {
        if (this.state.hover) {
            return this.renderHover();
        }

        const selectedImgUrl = this._config.icons[this._getFilterKey()];
        return (
            <div style={_style.preview.container} onMouseEnter={this.toggleHover(true)} >
                <div style={_style.preview.imgContainer} >
                    <img style={_style.preview.img} src={selectedImgUrl} />
                </div>
            </div>
        );
    }
}
