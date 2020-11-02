import {} from 'lodash/fp'

export default class ScenarioType {
    constructor(id, name, creator, tarPer, neiRad, stepsCount){
        this.id = id
        this.name = name
        this.creator = creator
        this.tarPer = tarPer
        this.neiRad = neiRad
        this.stepsCount = stepsCount
    }    
}