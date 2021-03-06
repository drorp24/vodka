import { css } from 'styled-components';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';

// colors
export const temporarySignalColor = `rgba(101, 100, 96, 0.3)`;
export const selectedItemBackgroundColor = `lightgray`;
export const borderColor = 'rgba(216, 221, 215, 1)';
export const backgroudHoverColor = 'lightgray';
export const windowBackground = 'rgba(255, 255, 255, 1)';
export const topbarBackground = 'rgba(0, 0, 0, 0.1)';
export const sliderTarck = 'rgba(0, 0, 0, 0.7)';
export const sliderTarckDisabled = 'rgba(0, 0, 0, 0.1)';
export const sliderHandle = 'rgba(0, 0, 0, 1)';
export const sliderHandleDisabled = 'rgba(0, 0, 0, 0.5)';
export const sliderRail = 'lightgray';
export const topbarSliderButton = 'black';
export const weightLabel = 'black';
export const iconButtonColor = 'black';
export const iconButtonColorIcon = 'white';
export const primaryButtonColor = 'orange';
export const secondaryButtonColor = 'black';
export const scenarioButtonColor = 'black';
export const cancelButtonColor = 'black';

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
  color: #777e7f;
`;

export const simPlayerBorder = css`
  border: 1px solid #777e7f;
`;

export const simPlayerBorderDisabled = css`
  border: 1px solid #777e7f;
`;
export const sideBarWidth = '25';
export const scenarios = {
  appBar: blue['500'],
  checked: blue['500'],
  match: blue['500'],
  progress: blue['900'],
  search: blue['900'],
  disabled: 'rgba(90, 0, 0, 0.15)',
  cardBackground: 'rgba(0, 0, 0, 0.04)',
  header: blueGrey['100'],
  chips: blue['700']
};
