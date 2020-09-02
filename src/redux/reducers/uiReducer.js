import {set, flow} from 'lodash/fp'
import {TOGGLE_SIDE_BAR, DOMAIN_ITEM_PRESSED} from "../actions/actionTypes"

const initialState = {
    sideBarOpen: false,
    selectedWeightedItemID: null
}

export default function ui(ui = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDE_BAR:{
            return set('sideBarOpen', !ui.sideBarOpen, ui)
        }            
        case DOMAIN_ITEM_PRESSED: {            
            return flow(
                set('selectedWeightedItemID', action.payload.id)
            )(ui)
        }
        default:
            return ui
    }
}