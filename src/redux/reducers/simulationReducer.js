import {set, flow} from 'lodash/fp'
import ScenarioType from "../../types/scenarioType"
import { SELECT_SCENARIO, SELECT_SCENARIO_STEP
    } from "../actions/actionTypes"


const initialState = {
    selectedScenarioId: null,
    scenarioCurrentStepIdx: -1,
    scenarios: [
        new ScenarioType("1234", "scene 1", "Avraham", 10, 100, 2),
        new ScenarioType("4321", "scene 2", "Yizak", 50, 1000, 3),
        new ScenarioType("555", "scene 3", "Yakov", 30, 233, 3),
        new ScenarioType("4444", "scene 4", "Yosef", 70, 443, 4),
        new ScenarioType("556", "scene 3", "Yakov", 30, 233, 3),
        new ScenarioType("557", "scene 3", "Yakov", 30, 233, 3),
        new ScenarioType("558", "scene 3", "Yakov", 30, 233, 3),
        new ScenarioType("559", "scene 3", "Yakov", 30, 233, 3),
        new ScenarioType("550", "scene 3", "Yakov", 30, 233, 3),
        new ScenarioType("333", "scene 3", "Yakov", 30, 233, 3),
    ]
}

export default function ui(simulation = initialState, action) {
    
    switch (action.type) {
        case SELECT_SCENARIO: {
            return flow([
                set("selectedScenarioId", simulation.selectedScenarioId === action.payload.id ? null : action.payload.id),
                set("scenarioCurrentStepIdx", -1)
            ])(simulation)
        }
        case SELECT_SCENARIO_STEP: {
            // TODO...
            return set("scenarioCurrentStepIdx", action.payload.step, simulation)
        }
        default:
            return simulation
    }
}