import React from 'react';
const GJV = require("geojson-validation");
import { actionCreators } from '../actions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import store from '../stores/MITEnergyModelStore.jsx';
import { Provider, connect } from 'react-redux';
import Immutable from 'immutable';


import BuildingSummary from './BuildingSummary.jsx';

class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    calculateTotalEnergy() {
        if (this.props.buildingMapData['campus'] != undefined) {
            var monthSum = Array.apply(null, Array(12)).map(Number.prototype.valueOf,0);
            var internalData = this.props.buildingMapData['campus'];
            for (var building in internalData) {
                var monthlyData = internalData[building]['building_data']['measured_kwh']['total']
                for(var i = 0 ; i < monthlyData.length; i++){
                    monthSum[i] += monthlyData[i]
                };
            };
            return monthSum.map(function (x) { return parseInt(x, 10) });
        }
    }

    render() {
        if (this.props.buildingMapData['campus'] != undefined) {
            var monthSum = this.calculateTotalEnergy();
            const data = [
                {name: '2013', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0},
                {name: '2014', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0},
                {name: '2015', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0},
                {name: '2016', Jan: monthSum[0], Feb: monthSum[1], Mar: monthSum[2], Apr: monthSum[3], May: monthSum[4], Jun: monthSum[5], Jul: monthSum[6], Aug: monthSum[7], Sep: monthSum[8], Oct: monthSum[9], Nov: monthSum[10], Dec: monthSum[11]},
            ];

            return (
                <div style={{height: '100%', width: '30%', display: 'inline-block', verticalAlign: 'top', outline:'1px solid grey'}}>
                    <BarChart width={350} height={400} data={data}
                        margin={{top: 20, right: 5, left: 20, bottom: 20}}>
                        <XAxis dataKey="name"/>
                        <CartesianGrid strokeDasharray="4 4"/>
                        <Tooltip/>
                        <Bar dataKey="Jan" stackId="a" fill="#feec78" />
                        <Bar dataKey="Feb" stackId="a" fill="#cdeac6" />
                        <Bar dataKey="Mar" stackId="a" fill="#bb82bc" />
                        <Bar dataKey="Apr" stackId="a" fill="#d9d9d9" />
                        <Bar dataKey="May" stackId="a" fill="#fbcee5" />
                        <Bar dataKey="Jun" stackId="a" fill="#82b1d1" />
                        <Bar dataKey="Jul" stackId="a" fill="#fbb369" />
                        <Bar dataKey="Aug" stackId="a" fill="#b4dc70" />
                        <Bar dataKey="Sep" stackId="a" fill="#f98175" />
                        <Bar dataKey="Oct" stackId="a" fill="#bebbd9" />
                        <Bar dataKey="Nov" stackId="a" fill="#fffeb7" />
                        <Bar dataKey="Dec" stackId="a" fill="#8fd3c7" />

                    </BarChart>
                    <BuildingSummary
                        buildingData={this.props.buildingMapData}
                        selectedBuilding={this.props.filterState.selectedBuilding} />
                </div>
            )
        }

        else {
            return (<div></div>)
        }


    }
}

var mapStateToProps = function(state) {
    var immutableState = Immutable.fromJS(state);
    var newState = immutableState.toJS();
    return newState;
}

var _SideBar = connect(mapStateToProps)(SideBar);

class SideBarProvider extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <_SideBar />
            </Provider>
        )
    }
}

export default SideBarProvider;
