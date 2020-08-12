import {set} from 'lodash/fp'
import {TOGGLE_SIDE_BAR} from "../actions/actionTypes"

const initialState = {
    sideBarOpen: true
}

export default function ui(ui = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDE_BAR:
            const new_state = set('sideBarOpen', !ui.sideBarOpen, ui)
            return new_state
        default:
            return ui
    }
}