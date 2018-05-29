import React from 'react';
import styled from 'styled-components';

import ModeledPerformance from './ModeledPerformance.jsx';
import chroma from 'chroma-js';
import { TypeLabel, AreaLabel, EUILabel } from './FactLabels.jsx';


export var Container = styled.div`
    border: solid medium lightgrey;
    width: 47%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;

    > * {
        padding: 10px
    }
`;

export var Column = styled.div`
    width: ${(props) => props.width};
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

export default class BuildingFacts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <BuildingOverview
                    width={'39%'}
                    selectedBuilding={this.props.selectedBuilding}
                    dataProcessor={this.props.dataProcessor}
                />
            </Container>
        );

    }
}

export const SubSectionTitle = styled.div`
    width: 100%;
    font-size: 1.2em;
    font-weight: bold;
    padding-bottom: 5px;
`;

const EmptyBuilding = styled.div`
    padding-left: 5px;
    font-size: .75em;
`;

export const items = [{
    name: 'Type',
    key: 'building_type',
    imgUrl: (val) => {
        const imgs = {
            academic: './imgs/academic-icon.png',
            laboratory: './imgs/laboratory-icon.png',
            residential: './imgs/residential-icon.png',
            services: './imgs/services-icon.png'
        };
        return imgs[val];
    }
},{
    name: 'Area',
    key: 'area_m2',
    units: 'm&#178;'
},{
    name: 'Building EUI',
    key: 'building_eui',
    units: 'kWh / m&#178; / year'
}
];

class BuildingOverview extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        var selectedBuilding = this.props.selectedBuilding;

        if (selectedBuilding) {
            var that = this;
            var dataProcessor = this.props.dataProcessor;
            var isGOFWarning = dataProcessor.isGOFWarning(selectedBuilding);

            var type = (<TypeLabel key={1} selectedBuildingTypes={dataProcessor.getBuildingType(selectedBuilding)} />)

            var area = (<AreaLabel key={2} area={dataProcessor.printBuildingArea(selectedBuilding)} />);

            var campus_min = dataProcessor.getCampusMin();
            var campus_max = dataProcessor.getCampusMax();
            var energy_use = dataProcessor.getBuildingEnergyUsage(selectedBuilding);
            var color = chroma.scale(['#7d8180', '#d91111']).domain([campus_min, campus_max])(energy_use);
            var eui = (<EUILabel key={3} eui={dataProcessor.printBuildingEnergyUsage(selectedBuilding)} unitsHTML={dataProcessor.printEnergyUnitsHTML()} color={color} gofWarning={isGOFWarning}/> );

            var Items = [type, area, eui];
        } else {
            var Items = (<EmptyBuilding>Click a building on the map.</EmptyBuilding>);
        }
        var title = ("building " + this.props.selectedBuilding).toUpperCase();
        return (
                <Column width={'100%'} >
                <SubSectionTitle>{title}</SubSectionTitle>
                <Column width={'100%'} style={{justifyContent: 'space-around'}}>
                    {Items}
                </Column>
            </Column>
        );
    }
}

const Item = styled.div`
    width: 100%;
    height: 32%;
    display: flex;
    flex-direction: column;
    padding-left: 5px;

    & > .valueContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
    }

    & > .valueContainer > .value {
        font-weight: bold;
        font-size: 1.1em;
        padding-left: 10px;
    }

    & > .valueContainer > .value > .units {
        font-size: .6em;
        font-weight: 500;
        display: inline-block;
    }

    & > .label {
        font-size: .8em;
    }
`;

export class OverviewItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var label = this.props.name;
        var value = this.props.value;
        var units;
        if (this.props.units) {
            units = (<div className='units' dangerouslySetInnerHTML={{__html: this.props.units}}></div>);
        }

        return (
            <Item>
                <div className='label'>{label}:</div>
                <div className='valueContainer'>
                    <div className='value'>{value} {units ? units : ''}</div>
                </div>
            </Item>
        );
    }
}
