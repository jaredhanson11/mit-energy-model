import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import actionCreators from '../../actions/actionCreators.jsx';

import { mainGraphOptions } from './graphConfig.jsx';
import MITGraphDataProcessor from '../../utils/dataProcessing/MITGraphDataProcessor.jsx';
import { ToggleFilter } from '../MITMapFilter/ToggleFilter.jsx';


var GraphSectionContainer = styled.div`
    height: 100%;
    width: 100%;

    padding: 5px;
    padding-top: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    align-content: center;

`;

var GraphSectionHeader = styled.div`
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 10px;
`;

var GraphTitle = styled.div`
    width: 30%;
    > :nth-child(2) {
        margin-left: 10px;
    }
`
var Title = styled.div`
    font-size: 1.3em;
    font-weight: bold;
`;

var ToggleContainer = styled.div`
    width: 30%;
    margin-left: 10px;
`;

var GraphContainer = styled.div`
    width: 100%;
    height: 90%;
`;

const GraphLegend = styled.img`
    height: 70%;
    margin-right: 10px;
`

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
        this.toggleFilter = this.toggleFilter.bind(this);
    }

    getGraph() {
        var graphOptions = mainGraphOptions(this.dataProcessor);
        var measuredDataset = graphOptions.createBarDataset('Measured', this.dataProcessor.getYearlyMeasuredData(graphOptions.labels));
        var simulatedDatasets = this.dataProcessor.getYearlySimulatedData(graphOptions.labels).map((sim) => {
            return graphOptions.createLineDataset(sim.label.toUpperCase(), sim.data);
        })
        var datasets = [];
        simulatedDatasets.map(function(obj){ datasets.push(obj) })
        var data = {
            datasets: datasets
        }
        datasets.push(measuredDataset);

        var graph = {};
        graph.title = graphOptions.title;
        graph.data = data;
        graph.options = graphOptions.options;

        return graph;
    }

    toggleFilter(toggleKey, val) {
        this.props.dispatch(actionCreators.selectGraphToggle(val))
    }

    render() {
        this.dataProcessor = new MITGraphDataProcessor(this.props.buildingData, this.props.filterState);
        var graph = this.getGraph();
        var noToggle = (this.props.filterState.selectedBuilding == "");
        return(
            <GraphSectionContainer>
                <GraphSectionHeader>
                    <GraphTitle><Title>{graph.title}</Title>
                    <ToggleFilter
                        noToggle={noToggle}
                        filterKey={'graphToggle'}
                        filterState={this.props.filterState}
                        changeFilter={this.toggleFilter} />
                    </GraphTitle>
                    <GraphLegend src='./imgs/graph-legend.png' />
                </GraphSectionHeader>
                <Graph
                    graph={graph}
                />
            </GraphSectionContainer>
        );
    }
}

export default GraphSection;
