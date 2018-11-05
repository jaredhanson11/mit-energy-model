import React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from 'reactstrap';

import MapSelector from './MapSelector.jsx';
import ListSelector from './ListSelector.jsx';

import OverviewDataProcessor from '../../utils/dataProcessing/OverviewDataProcessor.jsx';

const ListMapSelector = styled.div`
    width: 100%;
	height: 100%;
	
    display: flex;
	flex-direction: row;
	flex-shrink: 0;
`;

const ModeSelectorContainer = styled(ButtonGroup)`
	width: 40px;
	height: 100%;

	display: flex;
	flex-flow: column nowrap;
`;

const ModeSelectorButton = styled(Button)`
	width: 100%;
	height: 50%;

	font-size: 1.5em;
	border-radius: 0px;
	box-shadow: none!important;

	text-align: center;
	white-space: pre-line;

	&:focus, &:active{
		outline: none!important;
	}
`;

const SelectorContainer = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	flex-flow: row nowrap;
`;

class _ListMapSelector extends React.Component {
    constructor(props) {
        super(props);

		this.onMenuBtnClick = this.onMenuBtnClick.bind(this);
		this.state = { };
        this.state.selectedText = "MAP";
    }

    onMenuBtnClick(selectedText) {
		this.state.selectedText = selectedText;
		this.forceUpdate();
	}
	
	getColor(selectedText) {
		if (this.state.selectedText === selectedText) {
			return "info";
		}
		return "secondary";
	}

	isActive(text) {
		return this.state.selectedText === text;
	}

	getButton(text, rightPos) {
		//break into separate lines
		let newText = text.replace(/.{1}/g, (x) => {return x + "\n";});
		return (<ModeSelectorButton
			style={{
				right: rightPos
			}}
			color={this.getColor(text)}
			onClick={() => this.onMenuBtnClick(text)}
			active={this.isActive(text)
			}>
			{newText}
		</ModeSelectorButton>);
	}

	getSelectorInner() {
		if (this.state.selectedText === "MAP") {
			return (<MapSelector
                width={'100%'}
                dataProcessor={this.dataProcessing}
			>
			</MapSelector>);
		} else if (this.state.selectedText === "LIST") {
			return (<ListSelector
                dataProcessor={this.dataProcessing}
            >
			</ListSelector>);
		}
	}

    render() {
        this.dataProcessing = new OverviewDataProcessor(this.props.buildingMapData, this.props.filterState);
        return (
			<ListMapSelector>
				<ModeSelectorContainer>
					{this.getButton("MAP", '0px')}
					{this.getButton("LIST", '-1px')}
				</ModeSelectorContainer>
				<SelectorContainer>
					{this.getSelectorInner()}
				</SelectorContainer>
			</ListMapSelector>
        );
    }
}

export default _ListMapSelector;