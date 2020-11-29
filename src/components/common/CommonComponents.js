import styled from 'styled-components';
import { Div } from './StyledElements';
import Slider from "rc-slider"

export const FlexColumns = styled(Div)`
display: flex;
flex-direction: row;
`;

export const FlexRows = styled(Div)`
display: flex;
flex-direction: column;
`;

export const SemanticSlider = styled(Slider)`
    .rc-slider-track {
        background-color: ${({ theme, disabled }) => theme[disabled ? "sliderTarckDisabled" : "sliderTarck"]};
    }
    .rc-slider-rail {
        background-color: ${({ theme, disabled }) => theme["sliderRail"]};
    }
    .rc-slider-handle {
        border: 0px;
        background-color: ${({ theme, disabled }) => theme[disabled ? "sliderHandleDisabled" : "sliderHandle"]};;
    }
`