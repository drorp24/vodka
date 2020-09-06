import LoadingSuccessFailureActionType from '../../types/loadingSuccessFailureActionType';

// Weight action types
export const LOAD_WEIGHTS = "LOAD_WEIGHTS"
export const SET_WEIGHT = "SET_WEIGHT"

// Domain items action types
export const LOAD_DOMAIN_ITEMS = "LOAD_DOMAIN_ITEMS"
export const DOMAIN_ITEM_PRESSED = "DOMAIN_ITEM_PRESSED"

// Map action types
export const MAP_CLICKED = "MAP_CLICKED"

// UI actions
export const TOGGLE_SIDE_BAR = "TOGGLE_SIDE_BAR"

// function to create loading / success / failure action types
export const makeLoadSuccessFailureActionType = (actionType) => {
  return new LoadingSuccessFailureActionType(actionType)
}