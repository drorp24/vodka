import {set, flow, getOr} from 'lodash/fp'
import {
    TOGGLE_SIDE_BAR, 
    DOMAIN_ITEM_PRESSED, 
    MAP_CLICKED,
    SWITCH_THEME} from "../actions/actionTypes"

const initialState = {
    sideBarOpen: false,
    selectedWeightedItemID: null,
    themeId: getOr("defaultTheme", "startupTheme", window.__myapp)
}

export default function ui(ui = initialState, action) {
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
                set('selectedWeightedItemID', action.payload.id),
                set('sideBarOpen', false)
            )(ui)
        }
        default:
            return ui
    }
}