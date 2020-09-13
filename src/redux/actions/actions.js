import { 
  WEIGHT_UPDATED,
  LOAD_DOMAIN_ITEMS, 
  DOMAIN_ITEM_PRESSED, 
  TOGGLE_SIDE_BAR, 
  MAP_CLICKED, 
  LOAD_WEIGHTS,
  SWITCH_THEME,
  SELECT_DOMAIN_ITEM_FOR_COMPARISON,
  TOGGLE_COMPARE_DOMAIN_ITEMS_MODE } from "./actionTypes"

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

export const loadDomainItems = makeActionCreator(LOAD_DOMAIN_ITEMS, 'meta', 'body')
export const weightUpdated = makeActionCreator(WEIGHT_UPDATED, 'meta', 'body')
export const loadWeights = makeActionCreator(LOAD_WEIGHTS, 'meta', 'body')
export const handleDomainItemPressed = makeActionCreator(DOMAIN_ITEM_PRESSED, 'id')
export const selectDomainItemForComparison = makeActionCreator(SELECT_DOMAIN_ITEM_FOR_COMPARISON, 'id')
export const toggleSideBar = makeActionCreator(TOGGLE_SIDE_BAR)
export const handleMapClicked = makeActionCreator(MAP_CLICKED)
export const switchTheme = makeActionCreator(SWITCH_THEME, 'id')
export const toggleCompareDomainItemsMode = makeActionCreator(TOGGLE_COMPARE_DOMAIN_ITEMS_MODE, 'mode')