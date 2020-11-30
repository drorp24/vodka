import {} from 'lodash/fp'

export default class ScenarioType {
    constructor(id, name, description, creator, tarPer, nextSteptarPer, neiPer, neiRad, stepsCount, creationTime){
        this.id = id
        this.name = name
        this.description = description
        this.creator = creator
        this.tarPer = tarPer
        this.nextSteptarPer = nextSteptarPer
        this.neiPer = neiPer
        this.neiRad = neiRad
        this.stepsCount = stepsCount
        this.creationTime = creationTime
    }    
}