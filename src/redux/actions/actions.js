import { SET_WEIGHT, LOAD_DOMAIN_ITEMS, DOMAIN_ITEM_PRESSED, TOGGLE_SIDE_BAR, MAP_CLICKED, LOAD_WEIGHTS } from "./actionTypes"

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

export const setWeight = makeActionCreator(SET_WEIGHT, 'key', 'value')
export const loadWeights = makeActionCreator(LOAD_WEIGHTS, 'meta', 'body')
export const loadDomainItems = makeActionCreator(LOAD_DOMAIN_ITEMS, 'meta', 'body')
export const handleDomainItemPressed = makeActionCreator(DOMAIN_ITEM_PRESSED, 'id')
export const toggleSideBar = makeActionCreator(TOGGLE_SIDE_BAR)
export const handleMapClicked = makeActionCreator(MAP_CLICKED)
