import React from 'react';

//place into file later
var style = {

}
export default class SelectedBuilding extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <button onClick={this.props.deselectBuildingAction}>Deselect</button>
                <p>Building {this.props.buildingSelected}</p>
            </div>
        )
    }
}
