import {set, flow, getOr, concat, remove, find, isNil} from 'lodash/fp'
import {
    WEIGHT_UPDATED,
    TOGGLE_SIDE_BAR, 
    DOMAIN_ITEM_PRESSED, 
    MAP_CLICKED,
    SWITCH_THEME,
    SELECT_DOMAIN_ITEM_FOR_COMPARISON,
    TOGGLE_COMPARE_DOMAIN_ITEMS_MODE} from "../actions/actionTypes"

import {COMPARE_DOMAIN_ITMES_OFF} from '../../types/compareDomainItemsEnum';

import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"

const initialState = {
    sideBarOpen: false,
    selectedDomainItemID: null,
    themeId: getOr("defaultTheme", "startupTheme", window.__myapp),
    compareDomainItemsMode: COMPARE_DOMAIN_ITMES_OFF,
    selectedDomainItemsIdsForCmp: []
}

export default function ui(ui = initialState, action) {
    const weightUpdatedTriple = new LoadingSuccessFailureActionType(WEIGHT_UPDATED)
    switch (action.type) {
        case TOGGLE_SIDE_BAR:{
            return set('sideBarOpen', !ui.sideBarOpen, ui)
        }
        case SWITCH_THEME:{
            return set('themeId', action.payload.id, ui)
        }
        case MAP_CLICKED:{
            return set('sideBarOpen', false, ui)
        }
        case DOMAIN_ITEM_PRESSED: { 
            return flow(
                set('selectedDomainItemID', action.payload.id),
                set('sideBarOpen', false)
            )(ui)
        }
        case weightUpdatedTriple.success: {
            return set('selectedDomainItemID', null, ui)
        }
        case SELECT_DOMAIN_ITEM_FOR_COMPARISON: {
            const idFromAlreadySelectedIdx = find((id) => id === action.payload.id, ui.selectedDomainItemsIdsForCmp)
            if(!isNil(idFromAlreadySelectedIdx)){
                return {
                    ...ui,
                    selectedDomainItemsIdsForCmp: remove(id => id === action.payload.id, ui.selectedDomainItemsIdsForCmp)
                }
            }
            else{
                return {
                    ...ui,
                    selectedDomainItemsIdsForCmp: concat([action.payload.id], ui.selectedDomainItemsIdsForCmp)
                }
            }
        }
        case TOGGLE_COMPARE_DOMAIN_ITEMS_MODE: {
            return flow(
                set('compareDomainItemsMode', action.payload.mode),
                set('selectedDomainItemsIdsForCmp', ui.compareDomainItemsMode === COMPARE_DOMAIN_ITMES_OFF ? [] : ui.selectedDomainItemsIdsForCmp),
                set('sideBarOpen', false)
            )(ui)
        }
        default:
            return ui
    }
}