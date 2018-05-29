import React from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';

import { TitleContainer } from './SelectFilter.jsx';

var Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    width: 100%;
    height: 48%;

    >:first-child {
        width: 90%;
    }
`;

var TimelineDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: center;
    justify-content: center;
    width: 85%;
    padding-bottom: 20px;
    margin:auto;
`;

var marks = {
    0: '2014',
    1: '2015',
    2: '2016',
    3: '2017',
    4: '2018',
    6: {style: {color: 'rgb(200,200,200)'}, label: '2020'},
    8: {style: {color: 'rgb(200,200,200)'}, label: '2050'},
    10: {style: {color: 'rgb(200,200,200)'}, label: '2080'}
};

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.selectYear = this.selectYear.bind(this);
    }

    selectYear(value) {
        var year = marks[value];
        if (year.label) {
            year = year.label;
        }
        this.props.changeYear(year);
    }

    render() {
        return(
            <TimelineDiv>
                <Slider onAfterChange={this.selectYear} step={null} marks={marks} defaultValue={3} min={0} max={10} included={false}/>
            </TimelineDiv>
        );
    }
}

export default class MapTimelineFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Container>
                <TitleContainer>TIMELINE</TitleContainer>
                <Timeline changeYear={this.props.changeYear} filterState={this.props.filterState} />
            </Container>
        );
    }
}
