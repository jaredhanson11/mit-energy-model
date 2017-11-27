import React from 'react';
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';

export default class BuildingSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = {
            container: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignContent: 'center',
                width: '100%',
                height: 'calc(100% - 422px)',
                border: 'solid thin black',
                paddingTop: '20px'
            },
            row: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center'
            },
            header: {
                textAlign: 'center'
            },
            value: {
                textAlign: 'center',
                fontSize: '1.5em',
                fontWeight: 'bold'
            }
        }

        if (!(this.props.selectedBuilding)) {
            const _style = Object.assign({justifyContent: 'center'}, style.container);
            return (
                <div style={_style}>
                    <div>Click on a building to see more details!</div>
                </div>
            );

        }

        var today = new Date();
        const thisMonth = today.getMonth();

        const selectedBuilding = String(this.props.selectedBuilding);

        var BuildingSummaryElement;
        var TotalEnergyEle;
        if (this.props.buildingData && this.props.buildingData.campus[selectedBuilding] && this.props.buildingData.campus[selectedBuilding]){
            var resourceBreakdown = this.props.buildingData.campus[selectedBuilding].building_data.measured_kwh;


            var pieData = [];
            var resources = ['stm', 'elec', 'chw'];
            var resourceNames = {'stm': 'Steam', 'elec': 'Electricity', 'chw':'Chilled Water'};
            var COLORS = ['#FF3333', '#FFBB28', '#0088FE']
            for (var i = 0; i < resources.length; i++) {
                const resource = resources[i];
                var entry = {}
                entry.name = resourceNames[resource];
                entry.value = resourceBreakdown[resource][thisMonth];
                pieData.push(entry);
            }
            TotalEnergyEle = (<div style={{marginTop: '10px'}} >Total Energy Output: {this.props.buildingData.campus[selectedBuilding].building_data.measured_kwh.total[thisMonth]}</div>);

            BuildingSummaryElement = (
                <PieChart width={350} height={200}>
                    <Pie
                        data={pieData}
                        cx='50%' cy='50%'
                        outerRadius='70%'
                        dataKey='value' nameKey='name'
                        paddingAngle={3}
                    >
                        {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Legend/>
                    <Tooltip/>
                </PieChart>
            );

        } else {
            BuildingSummaryElement = (<div style={{marginTop: '30px'}}>Sorry, we don't have data on this building yet!</div>);
        }

        return (
            <div style={style.container}>
                <div style={style.row}>
                    <div style={style.header}>Building Number:&nbsp;</div>
                    <div style={style.value}>{this.props.selectedBuilding}</div>
                </div>
                { TotalEnergyEle ? TotalEnergyEle : null}
                { BuildingSummaryElement }
            </div>
        )
    }
}
