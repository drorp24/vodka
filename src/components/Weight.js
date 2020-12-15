import React from 'react';
import 'rc-slider/assets/index.css'
import { Label as LabelSem, Divider } from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import "semantic-ui-css/semantic.min.css";
import { get, getOr } from 'lodash/fp'
import { FlexRows, FlexColumns, SemanticSlider } from './common/CommonComponents';
import { Label } from './common/StyledElements';
import translate from '../i18n/translate'


class Weight extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stateValue: null
    }
  }
  
  handleSliderDoneChanging = (newValue) => {
    this.props.onChange(this.props.weight.key, newValue)
  }

  handleSliderChanging = (newValue) => {
    this.setState({
      stateValue: newValue
    })
  }

  getValue = () => {
    if(this.state.stateValue !== null && this.state.stateValue !== this.props.weight.value){
      return this.state.stateValue
    }
    return this.props.weight.value
  }

  render(){
    const min = getOr(0, "min", this.props.weight)
    const max = getOr(0, "max", this.props.weight)
    let step = get("step", this.props.weight)
    step = isNaN(step) ? 0.01 : step

    return (
      <FlexRows margin="5px">
          <FlexColumns marginBottom="5px" justifyContent="space-between">
              <Label styleType="label2" marginLeft="10px">{translate(this.props.weight.key, true)}</Label>
              <LabelSem color={this.props.theme["weightLabel"]} circular>{this.getValue()}</LabelSem>
          </FlexColumns>
          <SemanticSlider disabled={this.props.disabled} value={this.getValue()} min={min} max={max} step={step} onChange={this.handleSliderChanging} onAfterChange={this.handleSliderDoneChanging}/>
          <Divider color={this.props.theme["secondaryButtonColor"]}/>
        </FlexRows>
    )
  }
}

export default withTheme(Weight)