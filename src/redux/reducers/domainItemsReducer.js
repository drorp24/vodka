import DomainItemType from "../../types/domainItemType"
import KeyValueType from "../../types/keyValueType"
import WeightType from "../../types/weightType"
import { sortBy, map, getOr } from 'lodash/fp'
import { SET_WEIGHT, LOAD_DOMAIN_ITEMS, DOMAIN_ITEM_PRESSED, LOAD_WEIGHTS, makeLoadSuccessFailureActionType } from "../actions/actionTypes"

const sortWeightedItemsHelper = (_weights, _weightedItems) => {
  const items = sortBy(weightedItem => -weightedItem.updateScore(_weights), _weightedItems)
  const newItems = []
  for (let index = 0; index < items.length; index++) {
    const weightedItem = items[index];
    weightedItem.setIndex(index)
    newItems.push(DomainItemType.copyDomainItem(weightedItem))
  }
  return newItems
}

const initialState = {
  items: [],
  weights: []
}


const actionHandlers = {}

const loadWeightsTriple = makeLoadSuccessFailureActionType(LOAD_WEIGHTS)
actionHandlers[loadWeightsTriple.success] = (state, action) => {
  const weights = map(weight => new WeightType(weight.key, weight.value, weight.min, weight.max), action.payload)
  return {
    ...state,
    weights
  }
}

const loadDomainItemsTriple = makeLoadSuccessFailureActionType(LOAD_DOMAIN_ITEMS)
actionHandlers[loadDomainItemsTriple.success] = (state, action) => {
  const items = sortWeightedItemsHelper(state.weights, map(domainItem => new DomainItemType(domainItem.id, domainItem.name, domainItem.description, domainItem.position,
    map((weightedAttribute) => new KeyValueType(weightedAttribute.key, weightedAttribute.value),
      domainItem.weightedAttributes)),
    action.payload))
  return {
    ...state,
    items
  }
}

actionHandlers[SET_WEIGHT] = (state, action) => {
  const weights = map(weightTypeInstance => {
    if (weightTypeInstance.key === action.payload.key) {
      return new WeightType(action.payload.key, action.payload.value, weightTypeInstance.min, weightTypeInstance.max)
    }
    return weightTypeInstance
  }, state.weights)

  return {
    items: sortWeightedItemsHelper(weights, state.items),
    weights
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