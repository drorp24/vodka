import React from 'react';
import { connect } from "react-redux"
import { map, isEmpty, set, isNil, getOr } from 'lodash/fp'
import { FlexRows } from './common/CommonComponents';
import Weight from './Weight'
import { weightUpdated, loadWeights } from '../redux/actions/actions'
import AsyncRestParams from '../types/asyncRestParams';
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'


class Weights extends React.Component {

  constructor(props) {
    super(props)
    this.weightsPopupRef = null
  }

  componentDidMount() {
    if (isEmpty(this.props.weights) || this.props.weights.length < 1)
      this.props.loadWeightsAction(new AsyncRestParams("/config/weights", "GET"))    
    document.addEventListener("click", this.handleClick);    
  }

  componentWillUnmount(){
    document.removeEventListener("click", this.handleClick);
  }

  handleClick = e => {
    console.log("handle clicked is here")
    const domItemClicked = getOr(null, "weightsPopupRef", this)
    if (domItemClicked && !domItemClicked.contains(e.target)) {
      this.props.close();
    }
  };

  handleWeightUpdate = (key, value) => {    
    const weights = map((weight) => {
      if(key !== weight.key) return weight
      return set('value', value, weight)
    }, this.props.weights)
    const ids = map((domainItem)=> domainItem.id, this.props.domainItems)
    const loadItemsRequestBody = getLoadItemsRequestBody({
      priorityPresetId: this.props.priorityPresetId,
      filterPresetId: this.props.filterPresetId,
      geoPresetId: this.props.geoPresetId,
      weights, 
      scenarioId: this.props.scenarioId, 
      scenarioStepIdx: this.props.scenarioStepIdx, 
      ids})
    this.props.weightUpdatedAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody, weights)
  }

  renderWeight = (weight) => {
    const noScorePresetChoosen = isNil(this.props.priorityPresetId)
    return <Weight disabled={this.props.loadingItems || noScorePresetChoosen} key={weight.key} weight={weight} onChange={this.handleWeightUpdate}/>
  }

  render() {
    return (
      <FlexRows width="300px" ref={(ref) => this.weightsPopupRef = ref}>
          {map(weight => {
        return this.renderWeight(weight)
      },
        this.props.weights)}
        </FlexRows>
    )
  }
}

const mapStateToProps = state => ({
  domainItems: state.domainItems.items,
  priorityPresetId: state.domainItems.selectedPriorityPresetId,
  filterPresetId: state.domainItems.selectedFilterPresetId,
  geoPresetId: state.domainItems.selectedGeoPresetId,
  loadingItems: state.domainItems.loadingItems,
  weights: state.domainItems.weights,
  scenarioId: state.simulation.selectedScenarioId,
  scenarioStepIdx: state.simulation.scenarioCurrentStepIdx
})

export default connect(mapStateToProps, {
  weightUpdatedAction: weightUpdated,
  loadWeightsAction: loadWeights
})(Weights);