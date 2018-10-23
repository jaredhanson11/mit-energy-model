import React from 'react';
import styled from 'styled-components';

import SelectFilter from '../BuildingFilter/SelectFilter.jsx';

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
        var _area = this.props.area;
        var _area_label = 'Area: ' + _area.toString() + ' m&#178;';
        var area = (<div dangerouslySetInnerHTML={{__html: _area_label}}></div>);
        return(
            <AreaLabelContainer>
                {area}
            </AreaLabelContainer>
        );
    }
}

var GOFWarningImg = styled.img`
    height: 17%;
`;

class GOFWarning extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.visible == true) {
            return (<GOFWarningImg src='./imgs/warning-mode-icon.png' />);
        } else {
            return (<div></div>);
        }
    }
};

var Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

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
        var warning = (<GOFWarning visible={this.props.gofWarning} />);
        return (
            <EUILabelContainer>
                <Row><EUI color={this.props.color}>{eui}</EUI> {warning} </Row>
                {units}
            </EUILabelContainer>
        );
    }
}
