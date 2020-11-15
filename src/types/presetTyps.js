import {} from 'lodash/fp'

export default class PresetType {
    constructor(preset){
        this.id = preset.id
        this.name = preset.preset_name
    }    
}