import React from 'react';
import styled from 'styled-components';

import { getSelectFilterConfig } from '../../config.jsx';

var FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: center;
    justify-content: center;
    width: 100%;
    height: 48%;
`;

var TitleContainer = styled.div`
    width: 100%;
    font-size: 1.2em;
    font-color: lightblue;
    font-weight: light;

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: flex-start;
`;

var IconsContainer = styled.div`
    width: 90%;
    height: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    justify-content: center;
`;

var IconImg = styled.img`
    width: ${props => props.width}%;
    max-width: 28%;
    max-height: 95%;
    padding-left: 2px;
    padding-right: 2px;
    ${props => props.selected ? '' : 'opacity: .2;'}
    cursor: pointer;
`;

class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        this._config = getSelectFilterConfig(this.props.filterKey);
        this.changeFilter = this.changeFilter.bind(this);
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

    render() {
        var that = this;
        var widthPerIcon = 100 / this._config.keys.length;
        var icons = this._config.keys.map(function(key) {
            var selected = (that.reduxStateSelected() == key);
            var onclick = that.changeFilter(key);
            return (<IconImg key={key}
                selected={selected}
                width={widthPerIcon}
                src={that._config.icons[key]}
                onClick={onclick}
            />);
        });
        return (
            <FilterContainer>
                <TitleContainer><div>{this._config.title}</div></TitleContainer>
                <IconsContainer>{icons}</IconsContainer>
            </FilterContainer>
        );
    }
}

export default SelectFilter;
