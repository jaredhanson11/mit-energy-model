import React from 'react';
import styled from 'styled-components';
import CheckboxTree from 'react-checkbox-tree';
import buildingData from './building-data';

const nodes = [];
for (let a = 0; a < buildingData.length; a++) {
    nodes.push({
        value: buildingData[a],
        label: buildingData[a],
        children: []
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
                    onCheck={checked => this.setState({ checked })}
                    onExpand={expanded => this.setState({ expanded })}
                />
            </div>
        );
    }
}

export default _ListSelector;