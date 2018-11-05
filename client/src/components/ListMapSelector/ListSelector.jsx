import React from 'react';
import styled from 'styled-components';
import CheckboxTree from 'react-checkbox-tree';
import buildingData from './building-data';

const nodes = [];
const umbrellas = [['Main Campus', ''],
['North', 'N'],
['East', 'E'],
['North-west', 'NW'],
['West', 'W'],
];
for (let a = 0; a < umbrellas.length; a++) {
    let children = [];
    for (let b = 0; b < buildingData.length; b++) {
        if ((buildingData[b].lastIndexOf(umbrellas[a][1], 0) === 0 && buildingData[b][umbrellas[a][1].length] <= '9' && umbrellas[a][0] != 'Main Campus') || 
            (umbrellas[a][0] == 'Main Campus' && buildingData[b][0] <= '9')) {
            children.push({
                value: buildingData[b],
                label: buildingData[b],
                children: []
            });
        }
    }
    nodes.push({
        value: umbrellas[a][0],
        label: umbrellas[a][0],
        children: children
    });
}

const CheckboxTreeStyled = styled(CheckboxTree)`
`;

class _ListSelector extends React.Component {
    constructor() {
        super();

        this.state = {
            checked: [],
            expanded: [],
        };
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: '100%',
                    paddingTop: '5px',
                    overflowY: 'auto'
                }}>
                <CheckboxTreeStyled
                    nodes={nodes}
                    checked={this.state.checked}
                    expanded={this.state.expanded}
                    showNodeIcon={false}
                    onCheck={checked => this.onCheck(checked)}
                    onExpand={expanded => this.setState({ expanded })}
                />
            </div>
        );
    }
}

export default _ListSelector;