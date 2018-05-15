import React from 'react';
import styled from 'styled-components';

import { Column, SubSectionTitle } from './BuildingFacts.jsx';

const COLORS = {
    'low': 'red',
    'medium': 'yellow',
    'high': 'green'
};

const PerformanceMeterContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    align-items: space-between;
    align-content: center;
    justify-content: space-around;

    height: 22%;
`;

const MetricTypeImgContainer = styled.div`
    height: 70%;
    max-height: 80%;
    & > img {
        max-height: 100%;
    }
`;

const MeterContainer = styled.div`
    display: flex;
    flex-direction: row;

    width: 70%;
    height: 60%;
`;

const Meter = styled.div`
    height: 100%;
    flex-grow: 1;
    padding: 2px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: ${(props) => props.color};
    ${(props) => props.active ? 'border: solid thin black;' : 'opacity: .2;'}

    font-size: .5em;
    font-weight: lighter;
`;

const MetricTitle = styled.div`
    font-size: .8em;
    font-weight: 400;
    width: 100%;
`;

class PerformanceMeter extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        var title = this.props.title;
        var imgSrc = this.props.imgSrc;

        var that = this;
        var meterValues = ['low', 'medium', 'high'].map(function(val){
            var active = that.props.active == val;
            var value = val.toUpperCase();
            var color = COLORS[val];
            return (<Meter key={val} color={color} active={active}>{value}</Meter>);
        });
        return (
            <PerformanceMeterContainer>
                <MetricTypeImgContainer><img src={imgSrc} /></MetricTypeImgContainer>
                <MeterContainer>
                    {meterValues}
                </MeterContainer>
                <MetricTitle>{title}</MetricTitle>
            </PerformanceMeterContainer>
        );
    }
}

var performanceItems = [{
        key: 'envelope_constructions',
        name: 'Envelope Constructions',
        imgSrc: './imgs/envelope-constructions-icon.png'
    }, {
        key: 'internal_load',
        name: 'Internal Load Parameters',
        imgSrc: './imgs/load-parameters-icon.png'
    },{
        key: 'ventilation',
        name: 'Ventilation Strategies',
        imgSrc: './imgs/ventilation-icon.png'
    }
];

const Items = styled.div`
    height: 80%;
    width: 100%;
    padding-left: 5px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

export default class ModeledPerformance extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        var width = this.props.width ? this.props.width : '100%';
        var that = this;
        var items = performanceItems.map(function(item) {
            //var active = that.props.buildingData.performance_metrics[item.key];
            var active = 'low';
            return (<PerformanceMeter key={item.key} title={item.name} active={active} imgSrc={item.imgSrc} />);
        });
        return (
            <Column width={width}>
                <SubSectionTitle>Performance</SubSectionTitle>
                <Items>
                    {items}
                </Items>
            </Column>
        );
    }
}
