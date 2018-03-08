import React from 'react';
import styled from 'styled-components';

import ModeledPerformance from './ModeledPerformance.jsx';


var Container = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
                    buildingData={this.props.buildingData}
                />
                <ModeledPerformance
                    width={'59%'}
                    buildingData={this.props.buildingData}
                />
            </Container>
        );

    }
}

export const SubSectionTitle = styled.div`
    width: 100%;
    font-size: 1.2em;
    font-weight: 400;
`;

const items = [{
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
        var that = this;
        console.log(this.props);
        var Items = items.map(function(item) {
            var value = that.props.buildingData.building_metadata[item.key];
            return (<OverviewItem key={item.name} name={item.name} value={value} units={item.units}/>);
        });
        return (
                <Column width={this.props.width} >
                <SubSectionTitle>Overview</SubSectionTitle>
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

class OverviewItem extends React.Component {
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
