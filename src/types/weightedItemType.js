import { keyBy, getOr } from "lodash/fp";

export default class WeightedItemType {
    constructor(name, description, weighted_attributes){
        this.name = name
        this.description = description
        this.weighted_attributes = weighted_attributes
    }

    score(weights){
        let score = 0
        const weighted_attributes_as_object = keyBy("key", this.weighted_attributes)
        weights.forEach(weight => {
            score += getOr(0, `${weight.key}.value`, weighted_attributes_as_object) * weight.value
        });
        return score
    }

    static scoreToColor(score){

    }
}