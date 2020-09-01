import React from 'react';
import { connect } from "react-redux"
import {FlexRows, FlexColumns} from './common/CommonComponents';
import {Div, Label} from './common/StyledElements';
import {map, find, capitalize, replace, flow} from 'lodash/fp'


const WeightedItemExplained = ({selected_id, domainItems, weights}) => {
    const renderRow = (columns, header=false) => {
        return (
            <FlexColumns justifyContent="space-between">
                <Div styleType={header ? "l4" : null} width="40%" marginBottom="5px">{columns[0]}</Div>
                <Div styleType={header ? "l4" : null} width="20%" borderLeft={columns[1] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[1]}</Div>
                <Div styleType={header ? "l4" : null} width="20%" borderLeft={columns[2] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[2]}</Div>
                <Div styleType={header ? "l4" : null} width="20%" borderLeft={columns[3] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[3]}</Div>                
            </FlexColumns>
        )
    }
    if(!selected_id){
        return null
    }
    const selectedWeightedItem = find({id: selected_id}, domainItems)
    const attributesWeighted = map(attribute => ({
        ...attribute,
        weight: find({key: attribute.key}, weights)
    }), selectedWeightedItem.weightedAttributes)
    return (
        <FlexRows marginTop="20px">
            <Label marginBottom="10px" styleType="l3">{selectedWeightedItem.name} explained (#{selectedWeightedItem.currIdx + 1}):</Label>
            <FlexRows>
            {
                renderRow(["Attribute", "Value", "Weight", "Contribution"], true)
            }
            {
                map(weightedAttribute => (
                    renderRow([flow(replace("_", " "), capitalize)(weightedAttribute.key), 
                                weightedAttribute.value, weightedAttribute.weight.value, 
                                parseInt(weightedAttribute.value * weightedAttribute.weight.value)])
                    ), attributesWeighted)
            }
            </FlexRows>            
            {
                renderRow(["Total", null, null, parseInt(selectedWeightedItem.score)], true)
            }
        </FlexRows>
    )
}

const mapStateToProps = state => ({
    selected_id: state.ui.selectedWeightedItemID,
    domainItems: state.domainItems.items,
    weights: state.domainItems.weights
})

export default connect(mapStateToProps, {})(WeightedItemExplained);