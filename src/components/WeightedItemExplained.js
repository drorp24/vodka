import React from 'react';
import { connect } from "react-redux"
import {FlexRows, FlexColumns} from './common/CommonComponents';
import {Div, Label} from './common/StyledElements';
import {map, find} from 'lodash/fp'


const WeightedItemExplained = ({selected_id, weightedItems, weights}) => {
    const renderRow = (columns) => {
        return (
            <FlexColumns justifyContent="space-between">
                <Div width="40%" marginBottom="5px">{columns[0]}</Div>
                <Div width="20%" borderLeft={columns[1] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[1]}</Div>
                <Div width="20%" borderLeft={columns[2] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[2]}</Div>
                <Div width="20%" borderLeft={columns[3] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[3]}</Div>                
            </FlexColumns>
        )
    }
    if(!selected_id){
        return null
    }
    const selectedWeightedItem = find({id: selected_id}, weightedItems)
    const attributesWeighted = map(attribute => ({
        ...attribute,
        weight: find({key: attribute.key}, weights)
    }), selectedWeightedItem.weightedAttributes)
    return (
        <FlexRows marginTop="20px">
            <Label marginBottom="10px" styleType="l3">{selectedWeightedItem.name} Explained (#{selectedWeightedItem.currIdx + 1}):</Label>
            <FlexRows>
            {
                map(weightedAttribute => (
                    renderRow([weightedAttribute.key, weightedAttribute.value, weightedAttribute.weight.value, parseInt(weightedAttribute.value * weightedAttribute.weight.value)])
                    ), attributesWeighted)
            }
            </FlexRows>            
            {
                renderRow(["Total", null, null, parseInt(selectedWeightedItem.score)])
            }
        </FlexRows>
    )
}

const mapStateToProps = state => ({
    selected_id: state.ui.selectedWeightedItemID,
    weightedItems: state.weightedItems.items,
    weights: state.weightedItems.weights
})

export default connect(mapStateToProps, {})(WeightedItemExplained);