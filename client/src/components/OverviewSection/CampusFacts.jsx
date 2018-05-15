import React from 'react';
import styled from 'styled-components';

import { Container, Column, SubSectionTitle, OverviewItem, items } from './BuildingFacts.jsx';
import { TypeLabel, AreaLabel, EUILabel } from './FactLabels.jsx';

export default class CampusFacts extends React.Component {
    constructor(props) {
        super(props);
    }

    crunchCampusData(buildingData) {
        console.log(buildingData);
    }

    render() {
        var that = this;
        var dataProcessor = this.props.dataProcessor;
        var type = (<TypeLabel key={1} selectedBuildingTypes={that.props.selectedBuildingTypes} />);
        var area = (<AreaLabel key={2} area={dataProcessor.printCampusArea()} />);
        var eui = (<EUILabel key={3} eui={dataProcessor.printCampusEnergyUsage()} unitsHTML={dataProcessor.printEnergyUnitsHTML()} />);
        var Items = [type, area, eui];
        return (
        <Container>
            <Column width={'100%'} >
                <SubSectionTitle>OVERVIEW</SubSectionTitle>
                <Column width={'100%'} style={{justifyContent: 'space-around'}}>
                    {Items}
                </Column>
            </Column>
        </Container>
        );
    }

}
