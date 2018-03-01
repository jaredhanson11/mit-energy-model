import styled from 'styled-components';

export var FilterContainer = styled.div`

    width: 100%;
    height: 80%;

    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: flex-start;

    padding: 5px;
`

export var FilterColumn = styled.div`
    width: ${props => props.width};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding: 0 5px 0 5px;
`;
