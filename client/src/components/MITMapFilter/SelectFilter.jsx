import React from 'react';
import styled from 'styled-components';

import { getSelectFilterConfig } from '../../config.jsx';

export var FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 50%;
`;

export var TitleContainer = styled.div`
    width: 100%;
    font-size: 1em;
    color: rgb(46, 117, 182);
    font-weight: light;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: flex-start;
`;

var IconsContainer = styled.div`
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    align-content: center;
    justify-content: center;
    padding-top: 3px;
`;

var Icon = styled.div`
    width: ${props => props.width}%;
    max-width: 28%;
    max-height: 95%;
    padding-left: 2px;
    padding-right: 2px;
    display: flex;
    flex-direction: column;
    ${props => props.selected ? '' : 'opacity: .2;'}
`;

var IconImg = styled.img`
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
    ${props => props.noClick ? 'cursor: not-allowed;' : ''}
    margin-bottom: 2px;
`;

var IconCaption = styled.div`
    font-size: .5em;
    width: 100%;
    text-align: center;
`;

class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        this._config = getSelectFilterConfig(this.props.filterKey);
        this.changeFilter = this.changeFilter.bind(this);
        this.selectAll = this.selectAll.bind(this);
    }

    reduxStateSelected() {
        return this.props.filterState[this._config.filterStateKey];
    }

    changeFilter(value) {
        var that = this;
        function _changeFilter() {
            that.props.changeFilter(that.props.filterKey, value);
        }
        return _changeFilter;
    }

    selectAll() {
        var allSelected = (this.reduxStateSelected().length == this._config.keys.length);
        var that = this;
        this._config.keys.map(function(key) {
            if (!that.reduxStateSelected().includes(key) && !allSelected) {
                that.changeFilter(key)();
            } else if (allSelected){
                that.changeFilter(key)();
            }
        })
    }

    render() {
        var that = this;
        var n_imgs = this._config.selectAll ? this._config.keys.length + 1 : this._config.keys.length;
        if (n_imgs <= 3) {n_imgs = 4};
        var widthPerIcon = 100 / n_imgs;
        var icons = this._config.keys.map(function(key) {
            var selected;
            if (Array.isArray(that.reduxStateSelected())) {
                selected = that.reduxStateSelected().includes(key);
            } else {
                selected = (that.reduxStateSelected() == key);
            }
            var onclick = that.changeFilter(key);
            var _IconCaption = (
                    <IconCaption
                        dangerouslySetInnerHTML={{__html: that._config.translations[key].toUpperCase().replace(" ", "&nbsp;")}}
                    />
            );
            if (that.props.iconsOnly) {
                _IconCaption = (<div></div>);
            }
            return (
                <Icon key={key}
                    width={widthPerIcon}
                    selected={selected}
                >
                    <IconImg
                        src={that._config.icons[key]}
                        onClick={onclick}
                    />
                    {_IconCaption}
                </Icon>
            );
        });
        if (this.props.iconsOnly) {
            return (<IconsContainer>{icons}</IconsContainer>);
        }
        if (this._config.selectAll){
            var that = this;
            var allSelected = (this.reduxStateSelected().length == this._config.keys.length);
            var SelectAll = (<Icon key={"select-all"}
                                width={widthPerIcon}
                                selected={allSelected}
                            >
                                <IconImg src={that._config.icons.all}
                                    onClick={that.selectAll}
                                />
                                <IconCaption>All</IconCaption>
                            </Icon>);
            icons.push(SelectAll);
        }
        return (
            <FilterContainer>
                <TitleContainer><div>{this._config.title.toUpperCase()}</div></TitleContainer>
                <IconsContainer>{icons}</IconsContainer>
            </FilterContainer>
        );
    }
}

export default SelectFilter;
