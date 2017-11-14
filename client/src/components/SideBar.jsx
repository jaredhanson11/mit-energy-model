import React from 'react';
const GJV = require("geojson-validation");
import { actionCreators } from '../actions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import BuildingSummary from './BuildingSummary.jsx';

const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{height: '100%', width: '30%', display: 'inline-block', verticalAlign: 'top', outline:'1px solid grey'}}>
                <BarChart width={350} height={300} data={data}
                    margin={{top: 20, right: 5, left: 5, bottom: 20}}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                    <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                </BarChart>
                <BuildingSummary selectedBuilding={this.props.uiState.selectedBuilding} />
            </div>
        )}
    }

    export default SideBar;
