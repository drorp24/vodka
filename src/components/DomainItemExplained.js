import React from 'react';
import { connect } from "react-redux"
import {FlexRows, FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {map, find, capitalize, replace, flow} from 'lodash/fp'


const WeightedItemExplained = ({domainItem, weights}) => {
    const renderRow = (columns, header=false) => {
        return (
            <FlexColumns justifyContent="space-between">
                <Div styleType={header ? "label4" : null} width="40%" marginBottom="5px">{columns[0]}</Div>
                <Div styleType={header ? "label4" : null} width="20%" borderLeft={columns[1] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[1]}</Div>
                <Div styleType={header ? "label4" : null} width="20%" borderLeft={columns[2] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[2]}</Div>
                <Div styleType={header ? "label4" : null} width="20%" borderLeft={columns[3] ? "1px solid lightgray": null}  marginBottom="5px" paddingLeft="5px">{columns[3]}</Div>                
            </FlexColumns>
        )
    }
    const attributesWeighted = map(attribute => ({
        ...attribute,
        weight: find({key: attribute.key}, weights)
    }), domainItem.weightedAttributes)
    return (
        <FlexRows marginTop="20px" padding="10px">
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
                renderRow(["Total", null, null, parseInt(domainItem.score)], true)
            }
        </FlexRows>
    )
}

const mapStateToProps = state => ({
    weights: state.domainItems.weights
})

export default connect(mapStateToProps, {})(WeightedItemExplained);