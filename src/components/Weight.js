import React from 'react';
import Slider from "rc-slider"
import 'rc-slider/assets/index.css'
import {Label as LabelSem, Divider} from 'semantic-ui-react';
import "semantic-ui-css/semantic.min.css";
import {get, getOr} from 'lodash/fp'
import {FlexRows, FlexColumns} from './common/CommonComponents';
import {Label} from './common/StyledElements';


export default function Weight({weight, onChange}) {
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
                <LabelSem color="black" circular>{weight.value}</LabelSem>
            </FlexColumns>
            <Slider value={weight.value} min={min} max={max} step={step} onChange={handleSliderChange} trackStyle={{"background-color": "black"}}/>
            <Divider color="black"/>
        </FlexRows>        
    )
}