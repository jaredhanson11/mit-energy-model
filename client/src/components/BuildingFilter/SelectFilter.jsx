import React from 'react';
import styled from 'styled-components';

import { getSelectFilterConfig } from '../../config.jsx';

export var FilterContainer = styled.div`
    width: calc(100% - 10px);
    height: calc(50% - 10px);

    margin: 5px;
    overflow: hidden;

    border-width: 1px;
    border-style: solid;

    background-color: white;
`;

//box around all the icons & captions
var IconsContainer = styled.div`
    margin: auto;
    height: 70%;
    width: 100%;

    display: flex;
    flex-flow: row nowrap;

    align-items: flex-start;
    align-content: center;
    justify-content: center;
`;

//box around each icon and image
var Icon = styled.div`
    max-width: ${props => props.width}%;
    min-width: 15%;
    height: 100%;

    margin: 0 3px;

    display: flex;
    flex-flow: column nowrap;

    ${props => props.selected ? '' : 'opacity: .2;'}
`;

var IconImg = styled.img`
    display: block;
    max-width: 100%;
    max-height: 65%;
    width: auto;
    height: auto;
    cursor: pointer;
    ${props => props.noClick ? 'cursor: not-allowed;' : ''}

    z-index: 0;
    margin: auto;
    margin-top: 0;
    margin-bottom: 0;
`;

var IconCaption = styled.div`
    font-size: 1em;
    width: 100%;
    height: 35%;
    text-align: center;
    
    margin-top: auto;
    margin-bottom: 0;

    z-index: 1;
`;

export var TitleContainer = styled.div`
    width: 100%;
    height: 30%;

    font-size: 1.5em;
    color: black;

    display: flex;
    flex-direction: row;
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
                        dangerouslySetInnerHTML={{__html: that._config.translations[key].replace(" ", "&nbsp;")}}
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
            return (
                <IconsContainer>{icons}</IconsContainer>
            );
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
                <TitleContainer>
                    <div
                        style={{
                            margin: 'auto',
                            marginBottom: '0px',
                            zIndex: 1
                        }}>
                        {this._config.title.toUpperCase()}
                    </div>
                </TitleContainer>
                <IconsContainer>
                    {icons}
                </IconsContainer>
            </FilterContainer>
        );
    }
}

export default SelectFilter;
