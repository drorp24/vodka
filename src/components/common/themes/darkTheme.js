import { css } from 'styled-components';

// colors
export const temporarySignalColor = `rgba(200, 200, 200, 0.3)`
export const selectedItemBackgroundColor = "rgba(69, 89, 105, 0.3)"
export const borderColor = "#2d3339"
export const backgroudHoverColor = "#455969"
export const windowBackground = "rgba(0, 0, 0, 0.85)"
export const sliderTarck = "rgba(69, 89, 105, 1)"
export const sliderTarckDisabled = "rgba(69, 89, 105, 0.3)"
export const sliderHandle = "rgba(69, 89, 105, 1)"
export const sliderHandleDisabled = "rgba(69, 89, 105, 0.7)"
export const sliderRail = "rgba(69, 89, 105, 0.2)"
export const sliderRailDisabled = "rgba(69, 89, 105, 0.1)"
export const selectForCompareColor = 'orange'
export const radarStroke = 'gray'
export const iconButtonColor = "#e0e1e2"
export const iconButtonColorIcon = "rgba(0,0,0,.6)"
export const primaryButtonColor = "orange"
export const secondaryButtonColor = "orange"
export const scenarioButtonColor = "black"
export const topbarSliderButton = "grey"
export const sidebarBackground = "rgba(255,255,255, 0.2)"


// labels full styles
export const label1 = css`
color: white;
font-size: 40px;
font-weight: bold;
`;

export const label2 = css`
font-size: 20px;
color: white;
`;

export const label3 = css`
color: white;
font-size: 16px;
`;

export const label3disabled = css`
font-size: 16px;
color: gray;
`;

export const labelDefaultText = css`
color: white;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
`;

export const labelDefaultDisabled = css`
color: gray;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
line-height: normal;
`;

export const scenarioLabelValue = css`
${labelDefaultDisabled}
font-size: 14px;
`;

export const selectedScenarioLabelValue = css`
${labelDefaultDisabled}
font-size: 14px;
color: #bbb5b5;
`;

export const scenarioLabelKey = css`
${labelDefaultDisabled}
color: black;
`;

export const selectedScenarioLabelKey = css`
${labelDefaultDisabled}
color: white;
`;

export const simPlayerLabel = css`
color: #f2711c;
`;

export const simPlayerBorder = css`
border: 1px solid #f2711c
`

export const simPlayerBorderDisabled = css`
border: 1px solid #f2711c
`