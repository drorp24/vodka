import { css } from 'styled-components';

// colors
export const temporarySignalColor = `rgba(101, 100, 96, 0.3)`
export const borderColor = "rgba(216, 221, 215, 1)"
export const backgroudHoverColor = "lightgray"
export const windowBackground = "rgba(234, 235, 230, 1)"
export const sliderTarck = "rgba(0, 0, 0, 0.7)"
export const sliderHandle = "rgba(0, 0, 0, 1)"
export const sliderRail = "lightgray"
export const topbarSliderButton = "black"
export const weightLabel = "black"
export const iconButtonColor = "black"
export const iconButtonColorIcon = "white"
export const createButtonColor = "orange"
export const cancelButtonColor = "black"


// labels full styles
export const label1 = css`
font-size: 40px;
font-weight: bold;
`;

export const label2 = css`
font-size: 20px;
`;

export const label3 = css`
font-size: 16px;
`;


export const label3disabled = css`
font-size: 16px;
color: gray;
`;


export const labelDefaultText = css`
`;

export const labelDefaultDisabled = css`
color: gray;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
line-height: normal;
text-align: left;
`;

export const scenarioLabelValue = css`
${labelDefaultDisabled}
font-size: 14px;
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