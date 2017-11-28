import React from 'react';
import MdKeyboardBackspace from 'react-icons/lib/md/keyboard-backspace';
import MdInfoOutline from 'react-icons/lib/md/info-outline';

export default class SelectedBuilding extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container'>
                <div className='topLine'>
                        <button className='cancel' onClick={this.props.deselectBuildingAction}><MdKeyboardBackspace/></button>
                        <h1 className='buildingName'>Building {this.props.buildingSelected}</h1>
                        <button className='info'><MdInfoOutline/></button>
                </div>
                <div className='body'>
                    <p>Area ft_2: {this.props.buildingData.building_metadata.area_ft2}</p>
                    <p>EUI: {this.props.buildingData.building_metadata.building_eui}</p>
                    <p>Type: {this.props.buildingData.building_metadata.building_type}</p>
                </div>
            </div>
        )
    }
}
