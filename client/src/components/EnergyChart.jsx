import React from 'react';
import { actionCreators } from '../actions';

import { connect } from 'react-redux';

import _style from '../styles/EnergyChartStyle.js';

class EnergyChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{display:'flex', height: '400px'}}>
                <Bar width={'100px'} />
                <Bar width={'100px'} />
                <Bar width={'100px'} />
            </div>
        );
    }
}

class Bar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var style = _style.generateStyle(this.props);
        return (
            <div style={style.Bar.container} >
                <div style={style.Bar.stackedLayer(25, 100)} >
                </div>
                <div style={style.Bar.stackedLayer(30, 100)} >
                </div>
                <div style={style.Bar.stackedLayer(35, 100)} >
                </div>
                <div style={style.Bar.stackedLayer(10, 100)} >
                </div>
            </div>
        );
    }
}

export default EnergyChart;
