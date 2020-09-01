import WeightedItemType from "../../types/weightedItemType"
import KeyValueType from "../../types/keyValueType"
import WeightType from "../../types/weightType"
import {sortBy, map} from 'lodash/fp'
import {SET_WEIGHT} from "../actions/actionTypes"

const initialState = {
    items: [
        new WeightedItemType(1, "Jems", "nice israeli beer", 32.8092, 35.0343, [new KeyValueType("alcohol_content", 5.3), new KeyValueType("bitterness", 0.4), new KeyValueType("clarity", 1.3), new KeyValueType("aroma", 1.3)]),
        new WeightedItemType(2, "Bazelet","golan heights beer", 32.9092, 35.1343, [new KeyValueType("alcohol_content", 5.2), new KeyValueType("bitterness", 0.3), new KeyValueType("clarity", 1.0), new KeyValueType("aroma", 1)]),
        new WeightedItemType(3, "Paulaner", "german monastery beer", 33.0092, 35.2343, [new KeyValueType("alcohol_content", 5.5), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 1.2), new KeyValueType("aroma", 1.5)]),
        new WeightedItemType(4, "Leffe", "the magic of belgium", 33.1092, 35.3343, [new KeyValueType("alcohol_content", 6.0), new KeyValueType("bitterness", 0.4), new KeyValueType("clarity", 2), new KeyValueType("aroma", 2)]),
        new WeightedItemType(6, "Franziskaner", "ultimate bavarian", 33.2092, 35.4343, [new KeyValueType("alcohol_content", 4), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 1.2), new KeyValueType("aroma", 0.5)]),
        new WeightedItemType(7, "Paroni", "paroni is italy", 33.3092, 35.5343, [new KeyValueType("alcohol_content", 5.8), new KeyValueType("bitterness", 0.1), new KeyValueType("clarity", 0.6), new KeyValueType("aroma", 1)])
    ],
    weights: [
        new WeightType("alcohol_content", 80, 0, 100),
        new WeightType("bitterness", 50, 0, 100),
        new WeightType("clarity", 40, 0, 100),
        new WeightType("aroma", 25, 0, 100)
    ]    
}

export default function domainItems(domainItems = initialState, action) {
    switch (action.type) {
        case SET_WEIGHT:{
            const weights = map(weightTypeInstance => {
                if(weightTypeInstance.key === action.payload.key){
                    return new WeightType(action.payload.key, action.payload.value, weightTypeInstance.min, weightTypeInstance.max)
                }
                return weightTypeInstance
            }, domainItems.weights)

            return {
                items: sortWeightedItemsHelper(weights, domainItems.items),
                weights
            }
        }        
        default:
            {
                return {
                    items: sortWeightedItemsHelper(domainItems.weights, domainItems.items),
                    weights: domainItems.weights
                }
            }            
    }
}

const sortWeightedItemsHelper = (_weights, _weightedItems) => {
    const items = sortBy(weightedItem => -weightedItem.updateScore(_weights), _weightedItems)
    for (let index = 0; index < items.length; index++) {
        const weightedItem = items[index];
        weightedItem.setIndex(index)
    }
    return items
}