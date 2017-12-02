import React from 'react';
import { actionCreators } from '../actions';

import { connect } from 'react-redux';

import style from '../styles/EnergyChartStyle.js';

var YEARS = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
var CHART_YEARS = ['data_2010', 'data_2011', 'data_2012', 'data_2013',
        'data_2014', 'data_2015', 'data_2016', 'data_2017'];
var DATA_PATH = '/historical_data/';
var HISTORICAL_DATA = [];
for (var i in CHART_YEARS) {
    var year = CHART_YEARS[i];
    var json = window[year];
    HISTORICAL_DATA.push(json);
}

class EnergyChart extends React.Component {
    constructor(props) {
        super(props);
        // require width, height, data
        // data: {
        //     <name-of-bar>: [
        //         {
        //             value: '',
        //             name: '',
        //             metadata:
        //         }, ...
        //     ], ...
        // }
    }

    generateBar(yearData) {
        var year = [];
        for (var month = 0; month < 12; month ++) {
            var monthTotal = 0;
            for (var building in yearData) {
                for (var resource in yearData[building]) {
                    monthTotal += parseFloat(yearData[building][resource][month]);
                }
            }
            year.push(monthTotal);
        }
        return year;
    }

    generateBarData() {
        var bar_data = {};

        for (var _year in HISTORICAL_DATA) {
            var year = HISTORICAL_DATA[_year];
            var bar = this.generateBar(year);
            bar_data[YEARS[_year]] = bar;
        }
        return bar_data;
    }

    makeGraph() {
        function sumList(l) {
            var tot = 0;
            for (var i=0; i<l.length; i++) {
                tot += parseFloat(l[i]);
            }
            return tot;
        }
        function getMaxYear(years) {
            var max = 0;
            for (var j in years) {
                var tot = sumList(years[j]);
                if (tot > max) {
                    max = tot;
                }
            }
            return max;
        }
        var barData = this.generateBarData();
        var maxValue = getMaxYear(barData);

        var Bars = YEARS.reverse().map((year) => {
            var yearData = barData[year];
            var yearTotal = sumList(yearData);
            var height = parseFloat(yearTotal) / maxValue * 100;
            return (
                <Bar height={height.toString() +'%'} width={'75px'} key={year} data={yearData} />
            );
        })
        return Bars;
    }

    render() {
        var _style = style.chartStyle(this.props);
        var Bars = this.makeGraph();
        return (
            <div style={_style.container}>
                {Bars}
            </div>
        );
    }
}

class Bar extends React.Component {
    constructor(props) {
        super(props);
        this.toggleHover = this.toggleHover.bind(this);
        this.state = {hovered: ''};
    }

    toggleHover(key, toggle) {
        var that = this;
        function _toggleHover() {
            if (!toggle) {
                that.setState({hovered: ''});
            } else {
                that.setState({hovered: key});
            }
        }
        return _toggleHover;
    }

    generateMonths() {
        var yearTotal = this.props.data.reduce((tot, curr) => tot + parseFloat(curr));
        var that = this;
        return this.props.data.map((val, i) => {
            var selected = (i === this.state.hovered);
            return(
                <div key={i}
                    style={style.barStyle(this.props).stackedLayer(val, yearTotal)}
                    onMouseEnter={that.toggleHover(i, true)}
                    onMouseLeave={that.toggleHover(i, false)}
                >
                    {selected ? val: ''}
                </div>
            );
        });
    }

    render() {
        var _style = style.barStyle(this.props);
        var months = this.generateMonths();
        return (
            <div style={_style.container} >
                {months}
            </div>
        );
    }
}

export default EnergyChart;
