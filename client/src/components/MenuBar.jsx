import React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from 'reactstrap';

const MenuBarContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
	flex-direction: row;
	flex-shrink: 0;

	margin-bottom: 10px;
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

const ModeSelectorContainer = styled(ButtonGroup)`
	width: 40%;
	height: 100%;
`;

const ModeSelectorButton = styled(Button)`
	width: calc(100% / 3);
	height: 100%;
	font-size: 1.5em;
	border-radius: 0px;
	box-shadow: none!important;

	&:focus, &:active{
		outline: none!important;
	}
`;

class _MenuBar extends React.Component {
    constructor(props) {
        super(props);

		this.state = { };
		this.state.rSelected = 1;
	
		this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    }

    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
	}
	
	getColor(rSelected) {
		if (this.state.rSelected === rSelected) {
			return 'primary';
		}
		return 'secondary';
	}

    render() {
        return (
            <MenuBarContainer>
                <TitleContainer>
                    <TitleInner>
                        {this.props.title}
                    </TitleInner>
                </TitleContainer>
                <ModeSelectorContainer>
					<ModeSelectorButton color={this.getColor(1)} 
					onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1}>VIEW
					</ModeSelectorButton>
					<ModeSelectorButton color={this.getColor(2)} 
					onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>PREDICT
					</ModeSelectorButton>
					<ModeSelectorButton color={this.getColor(3)} 
					onClick={() => this.onRadioBtnClick(3)} active={this.state.rSelected === 3}>VERIFY
					</ModeSelectorButton>
                </ModeSelectorContainer>
            </MenuBarContainer>
        );
    }
}

export default _MenuBar;