import {combineReducers} from "redux"
import domainItems from './domainItemsReducer';
import ui from "./uiReducer"
import simulation from "./simulationReducer"

const rootReducer = combineReducers({
    domainItems,
    ui,
    simulation
})

export default rootReducer