import React from 'react';
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart
} from "react-timeseries-charts";
import Building from './Building.jsx';
import MITMap from './MITMap.jsx';

class MITEnergyModelContainer extends React.Component {
    render() {
        return (
            <div>
                <div>
                  <Building id = {1} usage = {98}/>
                  <Building id = {2} usage = {160}/>
                  <Building id = {3} usage = {210}/>
                  <Building id = {4} usage = {380}/>
                  <Building id = {5} usage = {442}/>
                  <Building id = {6} usage = {509}/>
                </div>
                <div>
                  <MITMap />
                </div>
            </div>
        )
    }
}


export default MITEnergyModelContainer;
