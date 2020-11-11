import {set, flow, concat, remove, find, isNil} from 'lodash/fp'
import {
    WEIGHT_UPDATED,
    TOGGLE_SIDE_BAR, 
    DOMAIN_ITEM_PRESSED, 
    MAP_CLICKED,
    SWITCH_THEME,
    SELECT_DOMAIN_ITEM_FOR_COMPARISON,
    TOGGLE_COMPARE_DOMAIN_ITEMS_MODE,
    CLEAR_ALL_SELECTED_ITEMS_FOR_COMPARISON,
    TOGGLE_CREATE_SCENARIO,
    CREATE_SCENARIO} from "../actions/actionTypes"

import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"
import {startupTheme} from '../../configLoader';

const initialState = {
    sideBarOpen: false,
    selectedDomainItemID: null,
    themeId: startupTheme,
    compareDomainItemsMode: false,
    selectedDomainItemsIdsForCmp: [],
    createScenarioOpen: false
}

const weightUpdatedTriple = new LoadingSuccessFailureActionType(WEIGHT_UPDATED)
const createScenariosTriple = new LoadingSuccessFailureActionType(CREATE_SCENARIO)

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
            return flow([
                set('selectedDomainItemID', {id: action.payload.id}),
                set('sideBarOpen', false)]
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
            const newState = flow([
                set('selectedDomainItemsIdsForCmp', ui.compareDomainItemsMode ? [] : ui.selectedDomainItemsIdsForCmp),
                set('compareDomainItemsMode', !ui.compareDomainItemsMode),
                set('sideBarOpen', false)]
            )(ui)
            return newState
        }
        case CLEAR_ALL_SELECTED_ITEMS_FOR_COMPARISON: {
            return set('selectedDomainItemsIdsForCmp', [], ui)
        }
        case TOGGLE_CREATE_SCENARIO: {
            return set('createScenarioOpen', !ui.createScenarioOpen, ui)
        }
        case createScenariosTriple.failure:
        case createScenariosTriple.success: {
            return set('createScenarioOpen', false, ui)
        }
        default:
            return ui
    }
}