import {combineReducers} from "redux"
import domainItems from './domainItemsReducer';
import ui from "./uiReducer"
import simulation from "./simulationReducer"
import users from './usersReducer';

const rootReducer = combineReducers({
    domainItems,
    ui,
    simulation,
    users
})

export default rootReducer