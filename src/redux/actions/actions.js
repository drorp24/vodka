import { 
  WEIGHT_UPDATED,
  SELECT_PRESET_GROUP, 
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
  UPDATE_SCENARIOS_FILTER,
  CLEAR_SCENARIOS_FILTER,
  UPDATE_SCENARIOS_SELECTION,
  LOAD_PRIORITY_PRESETS,
  LOAD_FILTER_PRESETS,
  LOAD_GEO_PRESETS,
  SELECT_LOCALE,
  LOAD_MORE_DOMAIN_ITEMS,
  SCROLL_TO_INDEX_REQUEST } from "./actionTypes"

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

export const selectPresetGroup = makeActionCreator(SELECT_PRESET_GROUP, 'meta', 'body', 'origWeights')
export const weightUpdated = makeActionCreator(WEIGHT_UPDATED, 'meta', 'body', 'origWeights')
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
export const selectScenario = makeActionCreator(SELECT_SCENARIO, 'id', 'stepsCount')
export const selectScenarioStep = makeActionCreator(SELECT_SCENARIO_STEP, 'meta', 'body', 'origWeights')
export const toggleCreateScenario = makeActionCreator(TOGGLE_CREATE_SCENARIO)
export const createScenario = makeActionCreator(CREATE_SCENARIO, 'meta', 'body')
export const loadScenarios = makeActionCreator(LOAD_SCENARIOS, 'meta', 'body')
export const updateScenariosFilter = makeActionCreator(UPDATE_SCENARIOS_FILTER, 'scenariosFilter')
export const updateScenariosSelection = makeActionCreator(UPDATE_SCENARIOS_SELECTION, 'scenariosSelection')
export const CLEARScenariosFilter = makeActionCreator(CLEAR_SCENARIOS_FILTER)
export const loadPriorityPresets = makeActionCreator(LOAD_PRIORITY_PRESETS, 'meta', 'body')
export const loadFilterPresets = makeActionCreator(LOAD_FILTER_PRESETS, 'meta', 'body')
export const loadGeoPresets = makeActionCreator(LOAD_GEO_PRESETS, 'meta', 'body')
export const selectLocale = makeActionCreator(SELECT_LOCALE, 'locale')
export const loadMoreDomainItems = makeActionCreator(LOAD_MORE_DOMAIN_ITEMS, 'meta', 'body', 'origWeights')
export const scrollToIndex = makeActionCreator(SCROLL_TO_INDEX_REQUEST, 'indexToScroll', 'id', 'keepSelectedExpanded')