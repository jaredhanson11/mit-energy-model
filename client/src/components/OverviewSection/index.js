import React from 'react';
import styled from 'styled-components';

//import SectionHeader from './SectionHeader.jsx';
import BuildingFacts from './BuildingFacts.jsx';
import CampusFacts from './CampusFacts.jsx';
import OverviewDataProcessor from '../../utils/dataProcessing/OverviewDataProcessor.jsx';

var SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
`;

var BodyContainer = styled.div`
    width: calc(100% - 5px);
    height: 100%;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export default class OverviewSection extends React.Component {
    constructor(props) {
        super(props);
    }

    isBuildingSelected() {
        return this.props.filterState.selectedBuilding != '';
    }

    getTitle() {
        if (!this.isBuildingSelected()) {
            return 'Campus Overview'
        } else {
            return 'Building ' + this.props.filterState.selectedBuilding;
        }
    }

    render() {
        var Body;
        var campusDataProcessor = new OverviewDataProcessor(this.props.buildingData, this.props.filterState);

        var spoofedFilterState = Object.assign({}, this.props.filterState, {selectedBuildingType: ['laboratory', 'services', 'academic', 'residential']});
        var buildingDataProcessor = new OverviewDataProcessor(this.props.buildingData, spoofedFilterState);
        return(
            <SectionContainer>
                <BodyContainer>
                    <CampusFacts
                        selectedBuildingTypes={this.props.filterState.selectedBuildingType}
                        dataProcessor={campusDataProcessor}
                    />
                    <BuildingFacts
                        selectedBuilding={this.props.filterState.selectedBuilding}
                        dataProcessor={buildingDataProcessor}
                    />
                </BodyContainer>
            </SectionContainer>
        );
    }
}
