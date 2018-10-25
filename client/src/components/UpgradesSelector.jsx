import React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from 'reactstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const UpgradesSelectorContainer = styled.div`
    display: flex;
    padding: 20px;
    flex-flow: column nowrap;
`;

const UpgradeSlider = styled(Slider)`
    width: 80%;
    
    margin: auto;
`;

class _UpgradesSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UpgradesSelectorContainer>
                <UpgradeSlider />
                <UpgradeSlider />
                <UpgradeSlider />
            </UpgradesSelectorContainer>
        );
    }
}

export default _UpgradesSelector;