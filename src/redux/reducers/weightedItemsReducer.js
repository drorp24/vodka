import WeightedItemType from "../../types/weightedItemType"
import KeyValueType from "../../types/keyValueType"
import WeightType from "../../types/weightType"
import {sortBy, map} from 'lodash/fp'
import {SET_WEIGHT} from "../actions/actionTypes"

const initialState = {
    items: [
        new WeightedItemType("Jems", "nice israeli beer", [new KeyValueType("alcohol_content", 5.3), new KeyValueType("bitterness", 0.4), new KeyValueType("clarity", 1.3)]),
        new WeightedItemType("Bazelet","golan heights beer",[new KeyValueType("alcohol_content", 5.2), new KeyValueType("bitterness", 0.3), new KeyValueType("clarity", 1.0)]),
        new WeightedItemType("Paulaner", "german monastery beer",[new KeyValueType("alcohol_content", 5.5), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 1.2)])
    ],
    weights: [
        new WeightType("alcohol_content", 80, 0, 100),
        new WeightType("bitterness", 50, 0, 100),
        new WeightType("clarity", 40, 0, 100)
    ]    
}

export default function weightedItems(weightedItems = initialState, action) {
    switch (action.type) {
        case SET_WEIGHT:
            const weights = map(weightTypeInstance => {
                if(weightTypeInstance.key === action.payload.key){
                    return new WeightType(action.payload.key, action.payload.value, weightTypeInstance.min, weightTypeInstance.max)
                }
                return weightTypeInstance
            }, weightedItems.weights)

            return {
                items: sortBy(weightedItem => weightedItem.score(weightedItems.weights), weightedItems.items),
                weights: weights
            }
        default:
            return {
                items: sortBy(weightedItem => weightedItem.score(weightedItems.weights), weightedItems.items),
                weights: weightedItems.weights
            }
    }    
}