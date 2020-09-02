import {SET_WEIGHT, DOMAIN_ITEM_PRESSED, TOGGLE_SIDE_BAR} from "./actionTypes"

function makeActionCreator(type, ...argNames) {
    return function (...args) {
      let payload = {}
      argNames.forEach((arg, index) => {
        payload[argNames[index]] = args[index]
      })
      const action = { type, payload}
      return action
    }
  }

  export const setWeight = makeActionCreator(SET_WEIGHT, 'key', 'value')
  export const handleDomainItemPressed = makeActionCreator(DOMAIN_ITEM_PRESSED, 'id')
  export const toggleSideBar = makeActionCreator(TOGGLE_SIDE_BAR)