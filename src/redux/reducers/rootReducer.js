import {combineReducers} from "redux"
import weightedItems from "./weightedItemsReducer"
import ui from "./uiReducer"

const rootReducer = combineReducers({
    weightedItems,
    ui
})

export default rootReducer