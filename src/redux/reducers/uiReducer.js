import {set, flow, getOr} from 'lodash/fp'
import {
    WEIGHT_UPDATED,
    TOGGLE_SIDE_BAR, 
    DOMAIN_ITEM_PRESSED, 
    MAP_CLICKED,
    SWITCH_THEME} from "../actions/actionTypes"

import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"

const initialState = {
    sideBarOpen: false,
    selectedDomainItemID: null,
    themeId: getOr("defaultTheme", "startupTheme", window.__myapp)
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
        default:
            return ui
    }
}