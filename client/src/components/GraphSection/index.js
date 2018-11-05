import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import actionCreators from '../../actions/actionCreators.jsx';

import { mainGraphOptions } from './graphConfig.jsx';
import MITGraphDataProcessor from '../../utils/dataProcessing/MITGraphDataProcessor.jsx';
import { ToggleFilter } from '../BuildingFilter/ToggleFilter.jsx';

var GraphSectionContainer = styled.div`
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
`;

var GraphSectionHeader = styled.div`
    width: 100%;
    height: 10%;

    margin-bottom: 10px;
`;

var GraphOptions = styled.div`
    height: 100%;
    width: 30%;

    display: flex;
    flex-flow: column nowrap;

    float: left;
`
var Title = styled.div`
    font-size: 2.25em;
    height: 100%;
    width: 40%;

    display: flex;

    float: left;
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
    max-height: 100%;
    max-width: 30%;

    display: block;
    width: auto;
    height: auto;

    margin: auto;
`

class Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var graph = this.props.graph;

        return (
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
        simulatedDatasets.map(function (obj) { datasets.push(obj) })
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

        return (
            <GraphSectionContainer>
                <GraphSectionHeader>
                    <GraphOptions>
                        <ToggleFilter
                            filterKey={'unitsType'}
                            filterState={this.props.filterState}
                            changeFilter={this.props.changeFilter}
                        />
                        <ToggleFilter
                            filterKey={'unitsNormalized'}
                            filterState={this.props.filterState}
                            changeFilter={this.props.changeFilter}
                        />
                    </GraphOptions>
                    <Title>
                        <div
                            style={{
                                margin: 'auto'
                            }}>
                            {/* {graph.title} */}
                            Energy Usage
                        </div>
                    </Title>
                    <GraphLegend src='./imgs/graph-legend.png' />
                </GraphSectionHeader>
                <Graph
                    graph={graph}
                />
            </GraphSectionContainer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterState: state.filterState,
        buildingData: state.buildingMapData
    }
}

const mapDispatchToProps = (dispatch) => {

    const functionMap = {
        unitsNormalized: actionCreators.selectUnitsNormalizedType,
        resourceType: actionCreators.selectResourceType,
        unitsType: actionCreators.selectUnits,
        buildingType: actionCreators.selectBuildingType,
        dataSource: actionCreators.selectDataSource,
        upgradesCompleted: actionCreators.selectUpgradesCompleted,
    };
    return {
        changeFilter: (filterTypeKey, filterKey) => dispatch(functionMap[filterTypeKey](filterKey)),
        changeYear: (value) => dispatch(actionCreators.selectTimelineYear(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphSection);
