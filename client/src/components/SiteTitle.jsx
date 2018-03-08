import React from 'react';
import styled from 'styled-components';

var SiteTitleContainer = styled.div`
    width: 100%;
    height: 60px;
    padding-left: 5px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-content: center;
    align-items: flex-start;
`

var SiteTitle = styled.div`
    font-size: 2.5em;
    font-weight: bold;
`

class _SiteTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SiteTitleContainer>
                <SiteTitle>{this.props.title}</SiteTitle>
            </SiteTitleContainer>
        );
    }
}

export default _SiteTitle;
