import DomainItemType from "../../types/domainItemType"
import WeightType from "../../types/weightType"
import { map, getOr, keyBy, flow, set, filter } from 'lodash/fp'
import { WEIGHT_UPDATED, 
  LOAD_DOMAIN_ITEMS, 
  DOMAIN_ITEM_PRESSED, 
  LOAD_WEIGHTS,
  TEXT_FILTER_CLEAN,  
  TEXT_FILTER_START_SEARCH,
  TEXT_FILTER_FINISH_SEARCH,
  TEXT_FILTER_UPDATE_SELECTION } from "../actions/actionTypes"
import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"

const convertToDomainItems = (state, items, weights) => {
  const oldDomainItemsMapById = keyBy("id", state.items)
  const mapWithIdx = map.convert({'cap': false})
  return mapWithIdx((item, idx) => {
    const domainItem = new DomainItemType(item.id, item.name, item.description, item.center, item.geogson, item.weightedAttributes)
    domainItem.updateScore(weights)
    const previousDomainItem = getOr(null, domainItem.id, oldDomainItemsMapById)
    domainItem.prevIdx = previousDomainItem !== null ? previousDomainItem.currIdx : idx
    domainItem.currIdx = idx
    return domainItem
  }, items)
}

const convertToWeights = (weights) => {
  return map(weight => new WeightType(weight.key, weight.value, weight.min, weight.max), weights)
}

const initialState = {
  items: [],  
  weights: [],
  textFilterValue: "",
  actualTextFilter: {
    term: "",
    id: ""
  },
  textFilterLoading: false,
  textFilterItems:[]
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
  return {
    ...state,
    items: convertToDomainItems(state, action.payload, state.weights)
  }
}

const weightUpdatedTriple = new LoadingSuccessFailureActionType(WEIGHT_UPDATED)
actionHandlers[weightUpdatedTriple.success] = (state, action) => {
  const weights = convertToWeights(action.previousAction.payload.body.weights)
  return {
    ...state,
    weights,
    items: convertToDomainItems(state, action.payload, weights)
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

// follwing indicates the user type a serach term - a loading indicator appears
actionHandlers[TEXT_FILTER_START_SEARCH] = (state, action) => {
  return flow([
    set("textFilterValue", action.payload.textFilterValue),
    set("textFilterLoading", true)
  ])(state)
}

actionHandlers[TEXT_FILTER_CLEAN] = (state, action) => {
  return flow([
    set("textFilterValue", ""),
    set("textFilterLoading", false),
    set("actualTextFilter", {id: "", term: ""})
  ])(state)
}

actionHandlers[TEXT_FILTER_FINISH_SEARCH] = (state, action) => {
  const textFilterItems = filter(
    (domainItem) => {
      return domainItem.name.toLowerCase().includes(action.payload.textFilterValue.toLowerCase())
    }
    ,state.items)
  return flow([
    set("textFilterValue", action.payload.textFilterValue),
    set("textFilterLoading", false),
    set("textFilterItems", textFilterItems)
  ])(state)
}

actionHandlers[TEXT_FILTER_UPDATE_SELECTION] = (state, action) => {
  const newState = set("textFilterValue", action.payload.textFilterValue, state)
  if(action.payload.id){
    return set("actualTextFilter", {id: action.payload.id, term: action.payload.textFilterValue}, newState)
  }
  else {
    return set("actualTextFilter", {term: action.payload.textFilterValue}, newState)
  }
  
}

export default function domainItems(state = initialState, action) {
  const actionHandler = getOr((state) => state, action.type, actionHandlers)
  return actionHandler(state, action)
}