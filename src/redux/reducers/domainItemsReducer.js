import DomainItemType from "../../types/domainItemType"
import KeyValueType from "../../types/keyValueType"
import WeightType from "../../types/weightType"
import { sortBy, map, getOr } from 'lodash/fp'
import { SET_WEIGHT, DOMAIN_ITEM_PRESSED, LOAD_WEIGHTS, makeLoadSuccessFailureActionType } from "../actions/actionTypes"

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
    items: sortWeightedItemsHelper(weights,
      [
        new DomainItemType(1, "Jems", "nice israeli beer", 32.8092, 35.0343, [new KeyValueType("alcohol_content", 5.3), new KeyValueType("bitterness", 0.4), new KeyValueType("clarity", 1.3), new KeyValueType("aroma", 1.3)]),
        new DomainItemType(2, "Bazelet", "golan heights beer", 32.9092, 35.1343, [new KeyValueType("alcohol_content", 5.2), new KeyValueType("bitterness", 0.3), new KeyValueType("clarity", 1.0), new KeyValueType("aroma", 1)]),
        new DomainItemType(3, "Paulaner", "german monastery beer", 33.0092, 35.2343, [new KeyValueType("alcohol_content", 5.5), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 1.2), new KeyValueType("aroma", 1.5)]),
        new DomainItemType(4, "Leffe", "the magic of belgium", 33.1092, 35.3343, [new KeyValueType("alcohol_content", 6.0), new KeyValueType("bitterness", 0.4), new KeyValueType("clarity", 2), new KeyValueType("aroma", 2)]),
        new DomainItemType(6, "Franziskaner", "ultimate bavarian", 33.2092, 35.4343, [new KeyValueType("alcohol_content", 4), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 1.2), new KeyValueType("aroma", 0.5)]),
        new DomainItemType(7, "Paroni", "paroni is italy", 33.3092, 35.5343, [new KeyValueType("alcohol_content", 5.8), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 0.6), new KeyValueType("aroma", 1)])
      ]),
    weights
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