import React from 'react';
import 'rc-slider/assets/index.css'
import { Label as LabelSem, Divider } from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import "semantic-ui-css/semantic.min.css";
import { get, getOr } from 'lodash/fp'
import { FlexRows, FlexColumns, SemanticSlider } from './common/CommonComponents';
import { Label } from './common/StyledElements';


const Weight = ({weight, onChange, theme}) => {
  const min = getOr(0, "min", weight)
  const max = getOr(0, "max", weight)
  let step = get("step", weight)
  step = isNaN(step) ? 1 : step

  const handleSliderChange = (newValue) => {
    onChange(weight.key, newValue)
  }

  return (
    <FlexRows margin="5px">
            <FlexColumns marginBottom="5px" justifyContent="space-between">
                <Label styleType="label3" marginLeft="10px">{weight.displayName()}</Label>
                <LabelSem color={theme["weightLabel"]} circular>{weight.value}</LabelSem>
            </FlexColumns>
            <SemanticSlider value={weight.value} min={min} max={max} step={step} onChange={handleSliderChange}/>
            <Divider color="black"/>
        </FlexRows>
  )
}

export default withTheme(Weight)