import React from 'react';
import ToggleButton from 'react-toggle-button';
import styled from 'styled-components';

import { getToggleFilterConfig } from '../../config.jsx';

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

var FiltersContainer = styled.div`
    width: 100%;
    height: 70%;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
`;

var SwitchContainer = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;
    align-items: space-around;
    justify-content: space-around;
    align-content: space-around;
`;

var FilterLabel = styled.div`
    min-width: 25%;
    font-size: .8em;
    font-weight: bold;
    ${props => props.selected ? '' : 'opacity: .2;'}
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
`;

class ToggleFilter extends React.Component {
    constructor(props) {
        super(props);
        this._config = getToggleFilterConfig(this.props.filterKey);
        this.state = {checked: this.isChecked()};
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentDidMount() {
        this.setDimensions();
    }

    setDimensions() {
        const height = this.divElement.clientHeight;
        const width = this.divElement.clientWidth;
        this.setState({ height: height, width: width});
    }

    isChecked() {
        if (this._config.keys[0] == this.getReduxFilterState()){
            return false;
        } else if (this._config.keys[1] == this.getReduxFilterState()) {
            return true;
        }
    }

    getKey(checked) {
        if (checked) {
            return this._config.keys[0];
        } else {
            return this._config.keys[1];
        }
    }

    getReduxFilterState() {
        return this.props.filterState[this._config.filterStateKey];
    }

    setReduxFilterState(checked) {
    }

    handleToggle(checked) {
        var selectedKey = this.getKey(!checked);
        this.props.changeFilter(this.props.filterKey, selectedKey);
        this.setState({checked: !checked});
    }

    getName(checked) {
        if (checked) {
            return this._config.names[this._config.keys[0]];
        } else {
            return this._config.names[this._config.keys[1]];
        }
    }

    render() {
        var height = this.state.height ? this.state.height - 4 : 20;
        var width = this.state.width? this.state.width / 3 : 40;

        return(
        <SwitchContainer
            innerRef={(divElement) => this.divElement = divElement}
        >
            <FilterLabel selected={!this.state.checked}
                dangerouslySetInnerHTML={{__html: this.getName(true)}}></FilterLabel>
            <ToggleButton
                onToggle={this.handleToggle}
                value={this.state.checked}
                thumbStyle={{borderRadius: 2}}
                trackStyle={{borderRadius: 2}}
                activeLabel={''}
                inactiveLabel={''}
                colors={{
                    activeThumb: {
                        base: 'rgb(173,216,230)'
                    },
                    inactiveThumb: {
                        base: 'rgb(173,216,230)'
                    },
                    active: {
                        base: 'rgb(240,240,240)'
                    },
                    inactive: {
                        base: 'rgb(220,220,220)'
                    }
                }}
            />
            <FilterLabel selected={this.state.checked}
                dangerouslySetInnerHTML={{__html: this.getName(false)}}></FilterLabel>
        </SwitchContainer>
        );
    }
}

export default class ToggleFilterSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var that = this;
        var filters = this.props.filterKeys.map(function(key){
            return(
                <ToggleFilter
                    key={key}
                    filterKey={key}
                    filterState={that.props.filterState}
                    changeFilter={that.props.changeFilter}
                />
            );
        })
        return (
            <FilterContainer>
                <TitleContainer>Display Units</TitleContainer>
                <FiltersContainer>
                    {filters}
                </FiltersContainer>
            </FilterContainer>
        );
    }
}
