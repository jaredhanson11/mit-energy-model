import React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from 'reactstrap';

const TitleBarContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
	flex-direction: row;
	flex-shrink: 0;
`;

const TitleContainer = styled.div`
    width: 60%;
    padding: 10px;
    display: flex;

    background-image: linear-gradient(90deg, #8c8c8c, #FFFFFF);
`;

const TitleInner = styled.div`
    font-size: 3em;
    margin: auto;
`;

//-2 because I'm a piece of shit
const ModeSelectorContainer = styled(ButtonGroup)`
	width: 40%;
	height: 100%;
	right: -2px;
`;

const ModeSelectorButton = styled(Button)`
	width: calc(100% / 3);
	height: 100%;
	font-size: 1.75em;
	border-radius: 0px;
	box-shadow: none!important;

	&:focus, &:active{
		outline: none!important;
	}
`;

class _MenuBar extends React.Component {
    constructor(props) {
        super(props);

		this.onMenuBtnClick = this.onMenuBtnClick.bind(this);
		this.state = { };
		this.state.selectedText = "VIEW";
    }

    onMenuBtnClick(selectedText) {
		this.state.selectedText = selectedText;
		this.forceUpdate();
	}
	
	getColor(selectedText) {
		if (this.state.selectedText === selectedText) {
			return "primary";
		}
		return "secondary";
	}

	isActive(text) {
		return this.state.selectedText === text;
	}

	getButton(text) {
		return (<ModeSelectorButton
			color={this.getColor(text)}
			onClick={() => this.onMenuBtnClick(text)}
			active={this.isActive(text)}>
			{text}
		</ModeSelectorButton>);
	}

    render() {
        return (
            <TitleBarContainer>
                <TitleContainer>
                    <TitleInner>
                        {this.props.title}
                    </TitleInner>
                </TitleContainer>
                <ModeSelectorContainer>
					{this.getButton("VIEW")}
					{this.getButton("PREDICT")}
					{this.getButton("VERIFY")}
                </ModeSelectorContainer>
            </TitleBarContainer>
        );
    }
}

export default _MenuBar;