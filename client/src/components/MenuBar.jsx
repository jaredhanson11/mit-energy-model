import React from 'react';
import styled from 'styled-components';

var MenuBarContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
`

var SiteTitle = styled.div`
    font-size: 2.5em;
    width: 60%;
    padding: 10px;
`

var MenuSelector = styled.div`
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: row;
`

var MenuSelectorPanel = styled.div`
    width: calc(100% / 3);
    height: 100%;
    display: flex;
    padding: 5px;
`

var MenuSelectorPanelInner = styled.div`
    margin: auto;
    font-size: 1.5em;
`

class _MenuBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MenuBarContainer>
                <SiteTitle>{this.props.title}</SiteTitle>
                <MenuSelector>
                    <MenuSelectorPanel class={'mode-selected'}>
                        <MenuSelectorPanelInner>VIEW</MenuSelectorPanelInner>
                    </MenuSelectorPanel>
                    <MenuSelectorPanel>
                        <MenuSelectorPanelInner>PREDICT</MenuSelectorPanelInner>
                    </MenuSelectorPanel>
                    <MenuSelectorPanel>
                        <MenuSelectorPanelInner>VALIDATE</MenuSelectorPanelInner>
                    </MenuSelectorPanel>
                </MenuSelector>
            </MenuBarContainer>
        );
    }
}

export default _MenuBar;
