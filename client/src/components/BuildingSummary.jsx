import React from 'react';

export default class BuildingSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>Selected {this.props.selectedBuilding}</div>
        )
    }
}
