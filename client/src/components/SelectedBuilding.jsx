import React from 'react';
import MdKeyboardBackspace from 'react-icons/lib/md/keyboard-backspace';
import MdInfoOutline from 'react-icons/lib/md/info-outline';

export default class SelectedBuilding extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var sumList = function(l) {
            var tot = 0;
            console.log(l);
            for (var i=0; i < l.length; i++){
                tot += parseFloat(l[i]);
            }
            return tot;
        };
        console.log(this.props.buildingData);
        var energyTotal = sumList(this.props.buildingData.building_data['measured_kwh']['total']);
        var normalizedEnergyTotal = parseInt(sumList(this.props.buildingData.building_data['measured_kwh']['total']) / parseFloat(this.props.buildingData.building_metadata.area_m2));
        return (
            <div className='container'>
                <div className='topLine'>
                        <button className='cancel' onClick={this.props.deselectBuildingAction}><MdKeyboardBackspace/></button>
                        <h1 className='buildingName'>Building {this.props.buildingSelected}</h1>
                        <button className='info'><MdInfoOutline/></button>
                </div>
                <div className='body'>
                    <p>Area m_2: {this.props.buildingData.building_metadata.area_m2}</p>
                    <p>EUI: {this.props.buildingData.building_metadata.building_eui}</p>
                    <p>Type: {this.props.buildingData.building_metadata.building_type}</p>
                    <p>Past Year Energy Output (kwh): {energyTotal}</p>
                    <p>Past Year Normalized Energy Output (kwh/m2): {normalizedEnergyTotal}</p>
                </div>
            </div>
        )
    }
}
