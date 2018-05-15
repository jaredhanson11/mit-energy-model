import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';

import dataProcessing from './dataProcessing.js';
import { getLabels } from './dataProcessing.js';

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


    render() {
        var graph = this.props.graph;

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

    getGraph(filterState, historicalBuildingData, currentBuildingData) {
        var title = 'TRENDS';
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

        var measuredDataset = dataProcessing.getMeasuredData(this.props.filterState, this.props.buildingData, this.props.historicalBuildingData);
        var simulatedDatasets = dataProcessing.getSimulatedData(this.props.filterState, this.props.buildingData, this.props.historicalBuildingData);
        var datasets = [];
        datasets.push(measuredDataset);
        simulatedDatasets.map(function(obj){ datasets.push(obj) })


        data = {
            datasets: datasets
        }

        var options = {
            maintainAspectRatio: false,
            legend: {display: false},
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    gridLines: {display: false},
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    type: 'category',
                    display: true,
                    gridLines: {display: false},
                    labels: getLabels()
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
        if (this.props.buildingData.campus) {
        var graph = this.getGraph();
        } else{ return (<GraphSectionContainer />)};
        return(
            <GraphSectionContainer>
                <GraphSectionHeader>{graph.title}</GraphSectionHeader>
                <Graph
                    graph={graph}
                />
            </GraphSectionContainer>
        );
    }
}

export default GraphSection;
