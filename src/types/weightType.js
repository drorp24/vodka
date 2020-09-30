import {capitalize, replace, flow} from 'lodash/fp'

export default class WeightType {
    constructor(key, value, min, max){
        this.key = key
        this.value = value
        this.min = min
        this.max = max
    }

    displayName(){
        return flow([
            replace("_", " "),
            capitalize])(this.key)
    }
}