import {} from 'lodash/fp'

export default class FilterPresetType {
    constructor(filterPreset){
        this.id = filterPreset.id
        this.name = filterPreset.name
    }    
}