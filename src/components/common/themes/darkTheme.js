import { css } from 'styled-components';

// colors
export const temporarySignalColor = `rgba(200, 200, 200, 0.3)`
export const borderColor = "#2d3339"
export const backgroudHoverColor = "#455969"
export const windowBackground = "rgba(0, 0, 0, 0.85)"
export const sliderTarck = "#455969"
export const sliderHandle = '#455969'
export const sliderRail = "#2d3339"
export const selectForCompareColor = 'orange'
export const radarStroke = 'gray'
export const iconButtonColor = "#e0e1e2"
export const iconButtonColorIcon = "rgba(0,0,0,.6)"
export const primaryButtonColor = "orange"
export const secondaryButtonColor = "orange"
export const topbarSliderButton = null


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
`;

export const labelDefaultDisabled = css`
color: gray;
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