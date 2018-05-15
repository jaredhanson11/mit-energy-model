import React from 'react';
import styled from 'styled-components';

import { TitleContainer } from './SelectFilter.jsx';

var Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: flex-start;
    width: 100%;
    height: 48%;

    >:first-child {
        width: 90%;
        padding-bottom: 15px;
    }
`;

var Gradient = styled.div`
    display: flex;
    align-items: center;
    height: 30%;
    max-height: 40px;
    width: 85%;
    background: linear-gradient(to right, ${(props) => props.min}, ${(props) => props.max});
    opacity: .5;
`;

var ScaleDiv = styled.div`
    padding-top: 5px;
    width: 85%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

var SelectedBuilding = styled.div`
    border-right: 3px dashed black
    height: calc(100% + 8px);
    width: ${(props)=> 100 * (props.selected-props.min)/(props.max-props.min)}%;
    position: relative;
`;

var BuildingName = styled.div`
    font-size: 10px;
    position: absolute;
    top: -13px;
    right: -30px;
`;

const gradient_colors = ['#7d8180', '#d91111'];

class Scale extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScaleDiv>
                <div>{this.props.min}</div>
                <div dangerouslySetInnerHTML={{__html: this.props.units}}></div>
                <div>{this.props.max}</div>
            </ScaleDiv>
        );
    }
}

export default class MapGradientLegend extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var max_min = gradient_colors;
        var minColor = max_min[0];
        var maxColor =  max_min[1];
        var campusMin = this.props.dataProcessor.printCampusMin();
        var campusMax = this.props.dataProcessor.printCampusMax();
        var unitsHTML = this.props.dataProcessor.printEnergyUnitsHTML();
        var selectedBuilding = (<div></div>);
        if (this.props.selectedBuilding) {
            var buildingEnergy = this.props.dataProcessor.getBuildingEnergyUsage(this.props.selectedBuilding);
            var min = this.props.dataProcessor.getCampusMin();
            var max = this.props.dataProcessor.getCampusMax();
            if (!this.props.dataProcessor.unitsNormalized() && !this.props.dataProcessor.filterState.selectedDataSource=='warning') {
                buildingEnergy = parseInt(buildingEnergy / 1000);
                min = parseInt(min / 1000);
                max = parseInt(max/ 1000);
            }
            selectedBuilding = (
                <SelectedBuilding max={max} min={min} selected={buildingEnergy}>
                    <BuildingName>BUILDING&nbsp;{this.props.selectedBuilding.toUpperCase()}</BuildingName>
                </SelectedBuilding>
            );
        }
        return(
            <Container>
                <TitleContainer>SCALE</TitleContainer>
                <Gradient max={maxColor} min={minColor}>
                    {selectedBuilding}
                </Gradient>
                <Scale min={campusMin} max={campusMax} units={unitsHTML}/>
            </Container>
        );
    }
}
