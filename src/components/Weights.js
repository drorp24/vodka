import React from 'react';
import { map, getOr } from 'lodash/fp'
import {Div} from "./common/StyledElements"
import { FlexRows } from './common/CommonComponents';
import Weight from './Weight'
import { Label } from 'semantic-ui-react';

export default class Weights extends React.Component {

  constructor(props) {
    super(props)
    this.weightsPopupRef = null
  }

  componentDidMount() {    
    document.addEventListener("click", this.handleClick);    
  }

  componentWillUnmount(){
    document.removeEventListener("click", this.handleClick);
  }

  handleClick = e => {
    const domItemClicked = getOr(null, "weightsPopupRef", this)
    if (domItemClicked && !domItemClicked.contains(e.target)) {
      this.props.close();
    }
  };

  renderWeight = (weight) => {    
    return <Weight mapSlider={this.props.mapSlider} labelStyleType={this.props.labelStyleType} disabled={this.props.disabled} key={weight.key} weight={weight} onChange={this.props.handleWeightUpdate}/>
  }

  render() {
    return (
      <FlexRows width={this.props.width} ref={(ref) => this.weightsPopupRef = ref}>
        <Div marginBottom="20px" display="flex" justifyContent="center">
          <Label basic color="black">{this.props.header}</Label>
        </Div>          
          {map(weight => {return this.renderWeight(weight)}, this.props.weights)}
      </FlexRows>
    )
  }
}