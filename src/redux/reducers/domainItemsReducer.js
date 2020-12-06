import DomainItemType from "../../types/domainItemType"
import WeightType from "../../types/weightType"
import PriorityPresetType from "../../types/priorityPresetType"
import FilterPresetType from "../../types/filterPresetType"
import GeoPresetType from "../../types/geoPresetType"
import KeyValueType from "../../types/keyValueType"
import { map, getOr, keyBy, flow, set, filter, reverse, sortBy, find } from 'lodash/fp'
import { WEIGHT_UPDATED,
  DOMAIN_ITEM_PRESSED, 
  LOAD_WEIGHTS,
  TEXT_FILTER_CLEAN,  
  TEXT_FILTER_START_SEARCH,
  TEXT_FILTER_FINISH_SEARCH,
  TEXT_FILTER_UPDATE_SELECTION,
  SELECT_PRESET_GROUP,
  LOAD_PRIORITY_PRESETS,
  SELECT_SCENARIO_STEP, 
  LOAD_FILTER_PRESETS,
  LOAD_GEO_PRESETS} from "../actions/actionTypes"
import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"
import { isNil } from "lodash"

/**INITIAL STATE */
const initialState = {
  loadingItems: false,
  items: [],
  neighbors: [],
  weights: [],
  textFilterValue: "",
  actualTextFilter: {
    term: "",
    id: ""
  },
  textFilterLoading: false,
  textFilterItems:[],
  priorityPresets:[],
  filterPresets:[],
  geoPresets:[],
  selectedPriorityPresetId: null,
  selectedFilterPresetId: null,
  selectedGeoPresetId: null,
  selectedDomainItemID: null,
  loadingPriorityPresets: false,
  loadingFilterPresets: false,
  loadingGeoPresets: false
}

/**HELPERS */
const convertToDomainItems = (state, items, weights) => {
  const oldDomainItemsMapById = keyBy("id", state.items)
  const mapWithIdx = map.convert({'cap': false})
  const weightKeys = map((weight) => weight.key, weights)
  return mapWithIdx((item, idx) => {
    const weightedAttributes = map((key) => {
      return new KeyValueType(key, item[`${key}_score`])
    }, weightKeys)
    const domainItem = new DomainItemType(item.full_id, item.name, item.description, [item.center_y, item.center_x], JSON.parse(item.location), weightedAttributes, item.score)
    const previousDomainItem = getOr(null, domainItem.id, oldDomainItemsMapById)
    domainItem.prevIdx = previousDomainItem !== null ? previousDomainItem.currIdx : idx
    domainItem.currIdx = idx
    return domainItem
  }, 
  // flow([sortBy(["score"]), reverse])(items)
    flow([filter(item => !isNil(item.center_x) && !isNil(item.center_y) && !isNil(item.location)), sortBy(["score"]), reverse])(items)
  )
}

const convertNeighborsToDomainItems = (state, items, weights) => {
  const mapWithIdx = map.convert({'cap': false})
  const weightKeys = map((weight) => weight.key, weights)
  return mapWithIdx((item, idx) => {
    const weightedAttributes = map((key) => {
      return new KeyValueType(key, item[`${key}_score`])
    }, weightKeys)
    const domainItem = new DomainItemType(item.full_id, item.name, item.description, [item.center_y, item.center_x], JSON.parse(item.location), weightedAttributes, item.score)
    return domainItem
  }, 
  // items
  filter(item => !isNil(item.center_x) && !isNil(item.center_y) && !isNil(item.location), items)
  )
}

const convertToWeights = (weights) => {
  return map(weight => new WeightType(weight.key, weight.value, weight.min, weight.max), weights)
}

/**ASYNC ACTION TYPES */
const loadWeightsTriple = new LoadingSuccessFailureActionType(LOAD_WEIGHTS)
const selectPresetGroupTriple = new LoadingSuccessFailureActionType(SELECT_PRESET_GROUP)
const weightUpdatedTriple = new LoadingSuccessFailureActionType(WEIGHT_UPDATED)
const loadPriorityPresetsTriple = new LoadingSuccessFailureActionType(LOAD_PRIORITY_PRESETS)
const loadFilterPresetsTriple = new LoadingSuccessFailureActionType(LOAD_FILTER_PRESETS)
const loadGeoPresetsTriple = new LoadingSuccessFailureActionType(LOAD_GEO_PRESETS)
const selectScenarioStep = new LoadingSuccessFailureActionType(SELECT_SCENARIO_STEP)


const actionHandlers = {}

/**COMMON ACTION HANDLERS */
const loadItemsLoadingActionHandler = (state, action) => {  
  return set("loadingItems", true, state)
}

const loadItemsSuccessActionHandler = (state, action) => {
  const selectedDomainItemID = getOr(null, "full_id", find({full_id: state.selectedDomainItemID}, action.payload.tasks_data))
  return {
    ...state,
    selectedDomainItemID,
    selectedPriorityPresetId: getOr(null, "previousAction.payload.body.parameters_scores_preset_id", action),
    selectedFilterPresetId: getOr(null, "previousAction.payload.body.parameters_filter_preset_id", action),
    selectedGeoPresetId: getOr(null, "previousAction.payload.body.aoi_id", action),
    loadingItems: false,
    items: convertToDomainItems(state, getOr([], "payload.tasks_data", action), state.weights),
    neighbors: convertNeighborsToDomainItems(state, getOr([], "payload.neighbors_data", action), state.weights),
    weights: convertToWeights(getOr(state.weights, "previousAction.payload.body.weights", action))
  }
}

actionHandlers[selectPresetGroupTriple.loading] = loadItemsLoadingActionHandler
actionHandlers[selectPresetGroupTriple.success] = loadItemsSuccessActionHandler

actionHandlers[weightUpdatedTriple.loading] = loadItemsLoadingActionHandler
actionHandlers[weightUpdatedTriple.success] = loadItemsSuccessActionHandler

actionHandlers[selectScenarioStep.loading] = loadItemsLoadingActionHandler
actionHandlers[selectScenarioStep.success] = loadItemsSuccessActionHandler


/**SPECIFIC ACTION HANDLERS */

actionHandlers[loadWeightsTriple.success] = (state, action) => {
  const weights = map(weight => new WeightType(weight.key, weight.value, weight.minimum, weight.maximum), action.payload.weights)
  return {
    ...state,
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
    selectedDomainItemID: action.payload.id === state.selectedDomainItemID ? null : action.payload.id,
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

actionHandlers[loadPriorityPresetsTriple.loading] = (state, action) => {  
   return set("loadingPriorityPresets", true, state)
}

actionHandlers[loadPriorityPresetsTriple.success] = (state, action) => {
  const priorityPresets = map((priorityPreset) => new PriorityPresetType(priorityPreset), getOr([], "payload", action))
   return flow([
    set("priorityPresets", priorityPresets),
    set("loadingPriorityPresets", false)
   ])(state)
}

actionHandlers[loadFilterPresetsTriple.loading] = (state, action) => {  
  return set("loadingFilterPresets", true, state)
}

actionHandlers[loadFilterPresetsTriple.success] = (state, action) => {
 const filterPresets = map((filterPreset) => new FilterPresetType(filterPreset), getOr([], "payload", action))
  return flow([
   set("filterPresets", filterPresets),
   set("loadingFilterPresets", false)
  ])(state)
}

actionHandlers[loadGeoPresetsTriple.loading] = (state, action) => {  
  return set("loadingGeoPresets", true, state)
}

actionHandlers[loadGeoPresetsTriple.success] = (state, action) => {
 const geoPresets = map((geoPreset) => new GeoPresetType(geoPreset), getOr([], "payload", action))
  return flow([
   set("geoPresets", geoPresets),
   set("loadingGeoPresets", false)
  ])(state)
}

export default function domainItems(state = initialState, action) {
  const actionHandler = getOr((state) => state, action.type, actionHandlers)
  return actionHandler(state, action)
}