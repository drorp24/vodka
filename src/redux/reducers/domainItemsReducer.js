import DomainItemType from "../../types/domainItemType"
import KeyValueType from "../../types/keyValueType"
import WeightType from "../../types/weightType"
import { sortBy, map, getOr } from 'lodash/fp'
import { WEIGHT_UPDATED, LOAD_DOMAIN_ITEMS, DOMAIN_ITEM_PRESSED, LOAD_WEIGHTS } from "../actions/actionTypes"
import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"

const convertToDomainItems = (items, weights) => {
  return map((item) => {
    const domainItem = new DomainItemType(item.id, item.name, item.description, item.position, item.weightedAttributes)
    domainItem.updateScore(weights)
    return domainItem    
  }, items)
}

const convertToWeights = (weights) => {
  return map(weight => new WeightType(weight.key, weight.value, weight.min, weight.max), weights)
}

const initialState = {
  items: [],
  weights: []
}


const actionHandlers = {}

const loadWeightsTriple = new LoadingSuccessFailureActionType(LOAD_WEIGHTS)
actionHandlers[loadWeightsTriple.success] = (state, action) => {
  const weights = map(weight => new WeightType(weight.key, weight.value, weight.min, weight.max), action.payload)
  return {
    ...state,
    weights
  }
}

const loadDomainItemsTriple = new LoadingSuccessFailureActionType(LOAD_DOMAIN_ITEMS)
actionHandlers[loadDomainItemsTriple.success] = (state, action) => {
  const weights = convertToWeights(action.payload.weights)
  return {
    weights,
    items: convertToDomainItems(action.payload.items, weights)
  }
}

const weightUpdatedTriple = new LoadingSuccessFailureActionType(WEIGHT_UPDATED)
actionHandlers[weightUpdatedTriple.success] = (state, action) => {
  const weights = convertToWeights(action.payload.weights)
  return {
    weights,
    items: convertToDomainItems(action.payload.items, weights)
  }
}

actionHandlers[DOMAIN_ITEM_PRESSED] = (state, action) => {
  const items = map(
    (domainItem) => {
      if (domainItem.id === action.payload.id) {
        const newDomainItem = DomainItemType.copyDomainItem(domainItem)
        newDomainItem.expanded = !domainItem.expanded
        return newDomainItem
      }
      return domainItem
    },
    state.items)
  return {
    ...state,
    items
  }
}

export default function domainItems(state = initialState, action) {
  const actionHandler = getOr((state) => state, action.type, actionHandlers)
  return actionHandler(state, action)
}