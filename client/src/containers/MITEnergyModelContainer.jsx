import React from 'react';
// import Dropdown from 'react-dropdown'; uninstlal later
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

    constructor(props) {
      super(props);
      this.state = {
        clickedButton: "Total"
      }

      this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
      this.setState({
        clickedButton: "Total"
      })
    }


    handleClick(e) {

      this.setState({
        clickedButton : e.target.id
      })
    }

    render() {
        return (
            <div>
                <div>
                  <p>You are looking at: {this.state.clickedButton}</p>
                  <button id="Total" onClick={(e) => this.handleClick(e)}> Total </button>
                  <button id="Electricity" onClick={(e) => this.handleClick(e)}> Electricity </button>
                  <button id="Water" onClick={(e) => this.handleClick(e)}> Chilled Water </button>
                  <button id="Steam" onClick={(e) => this.handleClick(e)}> Steam </button>
                </div>
                <div>
                  <MITMap utility={this.state.clickedButton}/>
                </div>
            </div>
        )
    }
}


export default MITEnergyModelContainer;
