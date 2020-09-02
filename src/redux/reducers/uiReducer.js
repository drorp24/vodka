import {set, flow} from 'lodash/fp'
import {TOGGLE_SIDE_BAR, DOMAIN_ITEM_PRESSED, MAP_CLICKED} from "../actions/actionTypes"

const initialState = {
    sideBarOpen: false,
    selectedWeightedItemID: null
}

export default function ui(ui = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDE_BAR:{
            return set('sideBarOpen', !ui.sideBarOpen, ui)
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