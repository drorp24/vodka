import {set, flow} from 'lodash/fp'
import {TOGGLE_SIDE_BAR, TOGGLE_WEIGHTED_ITEM} from "../actions/actionTypes"

const initialState = {
    sideBarOpen: false,
    selectedWeightedItemID: null
}

export default function ui(ui = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDE_BAR:{
            return set('sideBarOpen', !ui.sideBarOpen, ui)
        }            
        case TOGGLE_WEIGHTED_ITEM: {            
            return flow(
                set('selectedWeightedItemID', action.payload.id),
                set('sideBarOpen', true)
            )(ui)
        }
        default:
            return ui
    }
}