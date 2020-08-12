import {SET_WEIGHT, SELECT_WEIGHTED_ITEM, TOGGLE_SIDE_BAR} from "./actionTypes"

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
  export const selectWeightedItem = makeActionCreator(SELECT_WEIGHTED_ITEM, 'id')
  export const toggleSideBar = makeActionCreator(TOGGLE_SIDE_BAR)