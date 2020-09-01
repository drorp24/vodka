import {combineReducers} from "redux"
import domainItems from './domainItemsReducer';
import ui from "./uiReducer"

const rootReducer = combineReducers({
    domainItems,
    ui
})

export default rootReducer