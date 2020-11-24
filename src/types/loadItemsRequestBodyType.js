import {getOr, isNil} from 'lodash/fp'
import {amount_of_items_to_load} from '../configLoader';

const mandatories = ["parameters_scores_preset_id", "parameters_filter_preset_id", "aoi_id", "weights"]

const requestBodyDefaults = {
    "weights":null,
    "parameters_scores_preset_id": null,    
    "amount":amount_of_items_to_load,
    "scenario_id": null,
    "scenario_step": null,
    "ids": null
    }

class LoadItemsRequestBodyType {
    constructor(weights, parameters_scores_preset_id, parameters_filter_preset_id, aoi_id,
        amount, scenario_id, scenario_step, ids){
        this.weights = weights
        this.parameters_scores_preset_id = parameters_scores_preset_id
        this.parameters_filter_preset_id = parameters_filter_preset_id
        this.aoi_id = aoi_id
        this.amount = amount
        this.scenario_id = scenario_id
        this.scenario_step = scenario_step
        this.ids = ids
    }    
}
const getLoadItemsRequestBody = (params) => {    
    mandatories.forEach(mandatoryFieldName => {
        if(params[mandatoryFieldName] === null){
            const msg = `mandatory field "${mandatoryFieldName}" is missing`
            console.log(msg)
            throw new Error(msg)
        }
    });
    const weights = getOr(requestBodyDefaults.weights, "weights", params)
    const parameters_scores_preset_id = getOr(requestBodyDefaults.parameters_scores_preset_id, "priorityPresetId", params)
    const parameters_filter_preset_id = getOr(requestBodyDefaults.parameters_filter_preset_id, "filterPresetId", params)
    const aio_id = getOr(requestBodyDefaults.aio_id, "geoPresetId", params)
    const amount = getOr(requestBodyDefaults.amount, "amount", params)
    let scenario_id = getOr(requestBodyDefaults.scenario_id, "scenarioId", params)
    let scenario_step = getOr(requestBodyDefaults.scenario_step, "scenarioStepIdx", params)
    const ids = getOr(requestBodyDefaults.ids, "ids", params)        
    if(scenario_id && (scenario_step < 0 || isNil(scenario_step))){
        const msg = `scenario_id is set but scenario_step is not defined`
        console.log(msg)
        scenario_id = null
        scenario_step = null
    }
    return new LoadItemsRequestBodyType(weights, parameters_scores_preset_id, parameters_filter_preset_id, aio_id,
        amount, scenario_id, scenario_step, ids)
}

export default getLoadItemsRequestBody