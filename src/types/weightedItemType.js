import { keyBy, getOr } from "lodash/fp";

export default class WeightedItemType {
    constructor(id, name, description, lat, lng, weightedAttributes){
        this.id = id
        this.name = name
        this.description = description
        this.weightedAttributes = weightedAttributes
        this.prevIdx = -1
        this.currIdx = -1
        this.score = -1
        this.position = [lat, lng]
    }

    updateScore(weights){        
        let score = 0
        const weightedAttributesSsObject = keyBy("key", this.weightedAttributes)
        weights.forEach(weight => {
            score += getOr(0, `${weight.key}.value`, weightedAttributesSsObject) * weight.value
        });
        this.score = score
        return score
    }

    isIndexChanged(){
        const result =  this.prevIdx !== this.currIdx && this.prevIdx !== -1
        return result
    }

    syncIndex(){
        this.prevIdx = this.currIdx
    }

    setIndex(index){
        this.prevIdx = this.currIdx
        this.currIdx = index
    }
}