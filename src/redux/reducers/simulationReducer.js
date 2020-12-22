import {set, flow, map, getOr} from 'lodash/fp'
import LoadingSuccessFailureActionType from '../../types/loadingSuccessFailureActionType'
import ScenarioType from "../../types/scenarioType"
import { SELECT_SCENARIO, SELECT_SCENARIO_STEP, CREATE_SCENARIO, LOAD_SCENARIOS, SELECT_PRESET_GROUP, UPDATE_SCENARIOS_FILTER, CLEAR_SCENARIOS_FILTER
    } from "../actions/actionTypes"


const initialState = {
    selectedScenarioId: null,
    scenarioCurrentStepIdx: -1,
    scenariosLoading: false,
    createScenariosProcessing: false,
    scenarios: [],
    scenariosFilter: null
}

const loadScenariosTriple = new LoadingSuccessFailureActionType(LOAD_SCENARIOS)
const createScenariosTriple = new LoadingSuccessFailureActionType(CREATE_SCENARIO)
const selectScenarioStep = new LoadingSuccessFailureActionType(SELECT_SCENARIO_STEP)
const selectPresetGroupTriple = new LoadingSuccessFailureActionType(SELECT_PRESET_GROUP)

export default function simulation(simulation = initialState, action) {
    
    switch (action.type) {
        case SELECT_SCENARIO: {
            return flow([
                set("selectedScenarioId", simulation.selectedScenarioId === action.payload.id ? null : action.payload.id),
                set("scenarioCurrentStepIdx", -1)
            ])(simulation)
        }
        case selectScenarioStep.success: {
            const scenarioCurrentStepIdx = getOr(null, "previousAction.payload.body.scenario_step", action)
            return set("scenarioCurrentStepIdx", scenarioCurrentStepIdx, simulation)
        }
        case createScenariosTriple.loading: {
            return set("createScenariosProcessing", true, simulation)
        }
        case createScenariosTriple.failure:
        case createScenariosTriple.success: {
            return set("createScenariosProcessing", false, simulation)
        }
        case loadScenariosTriple.loading :{
            return set("scenariosLoading", true, simulation)
        }
        case loadScenariosTriple.success :{
            const scenarios = map((scenario) => {
                return new ScenarioType(scenario.scenario_id, scenario.name, scenario.description, scenario.created_user,
                    scenario.sig_tasks_percentage, scenario.new_sig_tasks_percentage, scenario.sig_neighbors_percentage, 
                    scenario.radius, scenario.number_of_steps, scenario.creation_time)
            }, action.payload)
            return flow([
                set("scenarios", scenarios),
                set("scenariosLoading", false)
            ])(simulation)
        }
        case loadScenariosTriple.failure :{
            return set("scenariosLoading", false, simulation)
        }
        case selectPresetGroupTriple.success :{
            return flow([                
                set("scenarioCurrentStepIdx", -1)
            ])(simulation)
        } 
        case UPDATE_SCENARIOS_FILTER:
            return set("scenariosFilter", action.payload.scenariosFilter, simulation)
        case CLEAR_SCENARIOS_FILTER:       
        return set("scenariosFilter", null, simulation)
        default:
            return simulation
    }
}