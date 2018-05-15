import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';

import MITGraphDataProcessor from '../../utils/dataProcessing/MITGraphDataProcessor.jsx';


var SubGraphsContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

var SubGraphDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 30%;
`;

var SubGraphTitle = styled.div``;

var SubGraphContainer = styled.div`
    height: 92%;
    width: 100%;
`;

class SubGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var graph = this.props.graph;
        return (
            <SubGraphDiv>
                <SubGraphTitle>{graph.title.toUpperCase()}</SubGraphTitle>
                <SubGraphContainer>
                    <Line
                        data={graph.data}
                        options={graph.options}
                    />
                </SubGraphContainer>
            </SubGraphDiv>
        );
    }
}

export default class SubGraphSection extends React.Component {
    constructor(props) {
        super(props);
    }

    getGraph(resourceType) {
        var createMeasuredDataset = function(data) {
            return {
                label: 'Measured',
                type: 'line',
                data: data,
                fill: false,
                borderColor: 'rgb(191, 191, 191)'
            }
        }

        var createModeledDataset = function(data) {
            return {
                label: 'Modeled',
                type: 'line',
                data: data,
                borderDash: [5],
                fill: false,
                borderColor: 'rgb(0, 0, 0)'
            }
        }

        var measuredData = createMeasuredDataset(this.dataProcessor.getMonthlyMeasuredData(resourceType));
        var simulatedData = createModeledDataset(this.dataProcessor.getMonthlySimulatedData(resourceType));

        var datasets = [measuredData, simulatedData];

        var data = {
            datasets: datasets
        }

        var graph = {};
        var titles = {'elec': 'Electricity', 'stm': 'Steam', 'chw': 'Chilled Water'};
        graph.title = titles[resourceType];
        graph.data = data;
        var makeOptions = function(dataProcessor) {
            return {
                maintainAspectRatio: false,
                legend: {display: false},
                elements: {point: {radius: 0}},
                scales: {
                    yAxes: [{
                        type: 'linear',
                        display: false,
                        gridLines: {display: false},
                        ticks: {
                            min: 0,
                            max: dataProcessor.getMaxMonth()
                        }
                    }],
                    xAxes: [{
                        type: 'category',
                        display: false,
                        gridLines: {display: false},
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    }]
                }
            }
        }
        graph.options = makeOptions(this.dataProcessor);
        return graph;
    }

    render() {
        this.dataProcessor = new MITGraphDataProcessor(this.props.buildingData, this.props.filterState);
        var elecGraph = this.getGraph('elec');
        var stmGraph = this.getGraph('stm');
        var chwGraph = this.getGraph('chw');
        return (
            <SubGraphsContainer>
                <SubGraph graph={elecGraph} />
                <SubGraph graph={stmGraph} />
                <SubGraph graph={chwGraph} />
            </SubGraphsContainer>
        );
    }
}
