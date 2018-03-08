import React from 'react';
import styled from 'styled-components';

var HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    width: 100%;
    max-height: 20%;
`;

var Header = styled.div`
    width: 100%;
    font-size: 1.5em;
    font-weight: 600;
`;

export default class SectionHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <HeaderContainer>
                <Header>{this.props.title}</Header>
            </HeaderContainer>
        );
    }
}
