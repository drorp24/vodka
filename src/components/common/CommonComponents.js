import styled from 'styled-components';
import { Div, Button } from './StyledElements';

export const FlexColumns = styled(Div)`
display: flex;
flex-direction: row;
`;

export const FlexRows = styled(Div)`
display: flex;
flex-direction: column;
`;

// Impose default values
export const MyAppButton = styled(Button)`
min-width: ${({width}) => width || '120px' };
min-height: ${({height}) => height || '40px' };
`;

export const Line = styled(Div)`
`;