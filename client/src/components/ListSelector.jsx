import React from 'react';
import styled from 'styled-components';

let data = [
    {
        text: 'Parent 1',
        nodes: [
            {
                text: 'Child 1',
                nodes: [
                    {
                        text: 'Grandchild 1'
                    },
                    {
                        text: 'Grandchild 2'
                    }
                ]
            },
            {
                text: 'Child 2'
            }
        ]
    },
    {
        text: 'Parent 2'
    },
    {
        text: 'Parent 3'
    },
    {
        text: 'Parent 4'
    },
    {
        text: 'Parent 5'
    }
];

class _ListSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: '100%'
                }}>
                <TreeView data={tree}></TreeView>
            </div>
        );
    }
}

export default _ListSelector;