import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';

import dataProcessing from './dataProcessing.js';

var GraphSectionContainer = styled.div`
    height: 100%;
    width: 100%;

    padding: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    align-content: center;

`;

var GraphSectionHeader = styled.div`
    font-size: 1.2em;
    font-weight: 500;
    width: 100%;
    height: 10%;
`;

var GraphContainer = styled.div`
    width: 100%;
    height: 90%;
`;

class Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    createGraph() {
        var title = 'Sample Graph Title';
        var data = {
            datasets: [{
                label: 'Measured',
                type: 'bar',
                data: [2000, 2060, 1970, 2200, 1840, 1800, 1760, 1890, null, null, null, null, null, null],
                fill: false
            },{
                label: 'Modeled',
                type: 'line',
                borderDash: [5],
                data: [2000, 2060, 1970, 2200, 1840, 1800, 1760, 1890, null, 2000, null, 2050, null, 2900],
                spanGaps: true,
                fill: false
            }]
        };

        var options = {
            maintainAspectRatio: false,
            legend: {display: false},
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    gridLines: {display: false},
                }],
                xAxes: [{
                    type: 'category',
                    display: true,
                    gridLines: {display: false},
                    labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', 'YTD',
                        '', '2030', '', '2050', '','2080']
                }]
            }
        };

        var graph = {};
        graph.title = title;
        graph.data = data;
        graph.options = options;

        return graph;
    }


    render() {
        var graph = this.createGraph();

        return(
                <GraphContainer>
                    <Bar
                        data={graph.data}
                        options={graph.options}
                    />
                </GraphContainer>
        );
    }
}

class GraphSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getTitle(filterState) {
        return "Sample Title"
    }

    render() {
        return(
            <GraphSectionContainer>
                <GraphSectionHeader>{this.getTitle()}</GraphSectionHeader>
                <Graph
                    filterState={this.props.filterState}
                    buildingData={this.props.BuildingData}
                />
            </GraphSectionContainer>
        );
    }
}

export default GraphSection;
