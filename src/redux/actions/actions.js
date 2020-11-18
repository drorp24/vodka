import { 
  WEIGHT_UPDATED,
  SELECT_PRESET, 
  DOMAIN_ITEM_PRESSED, 
  TOGGLE_SIDE_BAR, 
  MAP_CLICKED, 
  LOAD_WEIGHTS,
  SWITCH_THEME,
  SELECT_DOMAIN_ITEM_FOR_COMPARISON,
  TOGGLE_COMPARE_DOMAIN_ITEMS_MODE,
  CLEAR_ALL_SELECTED_ITEMS_FOR_COMPARISON,
  TEXT_FILTER_CLEAN,
  TEXT_FILTER_START_SEARCH,
  TEXT_FILTER_FINISH_SEARCH,
  TEXT_FILTER_UPDATE_SELECTION,
  SELECT_SCENARIO,
  SELECT_SCENARIO_STEP,
  TOGGLE_CREATE_SCENARIO,
  CREATE_SCENARIO,
  LOAD_SCENARIOS,
  LOAD_PRESETS} from "./actionTypes"

function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let payload = {}
    argNames.forEach((arg, index) => {
      payload[argNames[index]] = args[index]
    })
    const action = {
      type,
      payload
    }
    return action
  }
}

export const selectPreset = makeActionCreator(SELECT_PRESET, 'meta', 'body')
export const weightUpdated = makeActionCreator(WEIGHT_UPDATED, 'meta', 'body')
export const loadWeights = makeActionCreator(LOAD_WEIGHTS, 'meta', 'body')
export const handleDomainItemPressed = makeActionCreator(DOMAIN_ITEM_PRESSED, 'id')
export const selectDomainItemForComparison = makeActionCreator(SELECT_DOMAIN_ITEM_FOR_COMPARISON, 'id')
export const clearAllSelectedItemsForComparison = makeActionCreator(CLEAR_ALL_SELECTED_ITEMS_FOR_COMPARISON)
export const toggleSideBar = makeActionCreator(TOGGLE_SIDE_BAR)
export const handleMapClicked = makeActionCreator(MAP_CLICKED)
export const switchTheme = makeActionCreator(SWITCH_THEME, 'id')
export const toggleCompareDomainItemsMode = makeActionCreator(TOGGLE_COMPARE_DOMAIN_ITEMS_MODE)
export const textFilterCleanSearch = makeActionCreator(TEXT_FILTER_CLEAN)
export const textFilterStartSearch = makeActionCreator(TEXT_FILTER_START_SEARCH, 'textFilterValue')
export const textFilterFinishSearch = makeActionCreator(TEXT_FILTER_FINISH_SEARCH, 'textFilterValue')
export const textFilterUpdateSelection = makeActionCreator(TEXT_FILTER_UPDATE_SELECTION, 'id', 'textFilterValue')
export const selectScenario = makeActionCreator(SELECT_SCENARIO, 'id')
export const selectScenarioStep = makeActionCreator(SELECT_SCENARIO_STEP, 'meta', 'body')
export const toggleCreateScenario = makeActionCreator(TOGGLE_CREATE_SCENARIO)
export const createScenario = makeActionCreator(CREATE_SCENARIO, 'meta', 'body')
export const loadScenarios = makeActionCreator(LOAD_SCENARIOS, 'meta', 'body')
export const loadPresets = makeActionCreator(LOAD_PRESETS, 'meta', 'body')