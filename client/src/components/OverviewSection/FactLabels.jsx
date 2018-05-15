import React from 'react';
import styled from 'styled-components';

import SelectFilter from '../MITMapFilter/SelectFilter.jsx';

var TypeLabelContainer = styled.div`
    width: 100%;

    >:first-child {
        height: auto;
        > img {
            cursor: inherit;
        }
    }
`;

export class TypeLabel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var doNothing = function(x) {return;};
        var spoofedFilterState = {selectedBuildingType: this.props.selectedBuildingTypes};
        return(
            <TypeLabelContainer>
            <SelectFilter iconsOnly filterKey={'buildingType'}
                filterState={spoofedFilterState}
                changeFilter={doNothing}
            />
            </TypeLabelContainer>
        );
    }
}

var AreaLabelContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export class AreaLabel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var area = this.props.area;
        var units = (<div dangerouslySetInnerHTML={{__html: 'm&#178;'}}></div>);
        return(
            <AreaLabelContainer>
                Area: {area}&nbsp;{units}
            </AreaLabelContainer>
        );
    }
};

var EUILabelContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

var EUI = styled.div`
    font-size: 2.5em;
    font-weight: 800;
    ${props => props.color ? 'color:' + props.color + ';' : ''}
    ${props => props.color ? 'opacity:' + '.75;' : ''}
`;

export class EUILabel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var eui = this.props.eui;
        var units = (<div dangerouslySetInnerHTML={{__html: this.props.unitsHTML}}></div>);
        var euiProps = {};
        if (this.props.color) {
            euiProps.color = this.props.color;
        }
        return (
            <EUILabelContainer>
                <EUI color={this.props.color}>{eui}</EUI>
                {units}
            </EUILabelContainer>
        );
    }
}
