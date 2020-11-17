import {getOr, isNil} from 'lodash/fp'
import {amount_of_items_to_load} from '../configLoader';

const mandatories = ["preset_id", "weights"]

const requestBodyDefaults = {
    "weights":null,
    "preset_id": null,    
    "amount":amount_of_items_to_load,
    "scenario_id": null,
    "scenario_step": null,
    "ids": null
    }

class LoadItemsRequestBodyType {
    constructor(weights, preset_id, amount, scenario_id, scenario_step, ids){
        this.weights = weights
        this.preset_id = preset_id
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
    const preset_id = getOr(requestBodyDefaults.preset_id, "presetId", params)
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
    return new LoadItemsRequestBodyType(weights, preset_id, amount, scenario_id, scenario_step, ids)
}

export default getLoadItemsRequestBody