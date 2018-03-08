import React from 'react';
import styled from 'styled-components';

import SectionHeader from './SectionHeader.jsx';
import BuildingFacts from './BuildingFacts.jsx';

var SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
`;

var BodyContainer = styled.div`
    width: calc(100% - 5px);
    height: 80%;
    padding-left: 5px;
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
        if (this.isBuildingSelected()) {
            var selectedBuilding = this.props.filterState.selectedBuilding;
            var selectedBuildingData = this.props.buildingData.campus[selectedBuilding];
            console.log(selectedBuilding, selectedBuildingData);
            Body = (
                <BuildingFacts
                    selectedBuilding={selectedBuilding}
                    buildingData={selectedBuildingData} />
                );
        } else {
            Body = (<div>Campus Overview</div>);
        }
        return(
            <SectionContainer>
                <SectionHeader title={this.getTitle()} />
                <BodyContainer>
                    { Body }
                </BodyContainer>
            </SectionContainer>
        );
    }
}
