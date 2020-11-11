import {} from 'lodash/fp'
import KeyValueType from './keyValueType'

export default class ScenarioType {
    constructor(id, name, description, creator, tarPer, nextSteptarPer, neiPer, neiRad, stepsCount, creationTime){
        this.id = new KeyValueType('id', id)
        this.name = new KeyValueType('name', name)
        this.description = new KeyValueType('description', description)
        this.creator = new KeyValueType('creator', creator)
        this.tarPer = new KeyValueType('target percentage', tarPer)
        this.nextSteptarPer = new KeyValueType('next step target percentage', nextSteptarPer)
        this.neiPer = new KeyValueType('neighbors percentage', neiPer)
        this.neiRad = new KeyValueType('neighbors radius', neiRad)
        this.stepsCount = new KeyValueType('steps count', stepsCount)
        this.creationTime = new KeyValueType('creation time', creationTime)
    }    
}