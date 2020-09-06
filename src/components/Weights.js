import React from 'react';
import { connect } from "react-redux"
import { map, isEmpty } from 'lodash/fp'
import { FlexRows } from './common/CommonComponents';
import Weight from './Weight'
import { setWeight, loadWeights } from '../redux/actions/actions'
import AsyncRESTMeta from '../types/asyncRESTMeta';


class Weights extends React.Component {

  componentDidMount() {
    if (isEmpty(this.props.weights) || this.props.weights.length < 1)

      this.props.loadWeightsAction(new AsyncRESTMeta("/weights", "GET"))
  }

  renderWeight = (weight) => (<Weight key={weight.key} weight={weight} onChange={this.props.setWeightAction}/>)

  render() {
    return (
      <FlexRows width="100%">
          {map(weight => {
        return this.renderWeight(weight)
      },
        this.props.weights)}
        </FlexRows>
    )
  }
}

const mapStateToProps = state => ({
  weights: state.domainItems.weights
})

export default connect(mapStateToProps, {
  setWeightAction: setWeight,
  loadWeightsAction: loadWeights
})(Weights);