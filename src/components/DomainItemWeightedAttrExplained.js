import React from 'react';
import { connect } from "react-redux"
import styled from 'styled-components';
import { FlexRows, FlexColumns } from './common/CommonComponents';
import { Div } from './common/StyledElements';
import { map, find, capitalize, replace, flow, isNumber } from 'lodash/fp'
import translate from '../i18n/translate'

export const StyledContanier = styled(FlexRows)`
    :hover  { cursor: auto}
`;

const DomainItemWeightedAttrExplained = ({domainItem, weights}) => {
  const renderRow = (columns, header = false) => {
    return (
      <FlexColumns justifyContent="space-between" key={columns[0]}>
        <Div styleType={header ? "labelDefaultText" : "labelDefaultDisabled"} width="34%" marginBottom="5px">{columns[0]}</Div>
        <Div styleType={header ? "labelDefaultText" : "labelDefaultDisabled"} width="22%" borderLeft={columns[1] ? "1px solid lightgray" : null}  marginBottom="5px" paddingLeft="5px">{columns[1]}</Div>
        <Div styleType={header ? "labelDefaultText" : "labelDefaultDisabled"} width="22%" borderLeft={columns[2] ? "1px solid lightgray" : null}  marginBottom="5px" paddingLeft="5px">{columns[2]}</Div>
        <Div styleType={header ? "labelDefaultText" : "labelDefaultDisabled"} width="22%" borderLeft={columns[3] ? "1px solid lightgray" : null}  marginBottom="5px" paddingLeft="5px">{columns[3]}</Div>                
      </FlexColumns>
    )
  }
  const attributesWeighted = map(attribute => ({
    ...attribute,
    weight: find({
      key: attribute.key
    }, weights)
  }), domainItem.weightedAttributes)
  return (
    <StyledContanier padding="10px">
      <FlexRows>
        {
          renderRow([
            translate("attribute", true),
            translate("value", true),
            translate("weight", true),
            translate("contribution", true)], 
            true)
        }
        {
          map(weightedAttribute => (
            renderRow(
                [translate(weightedAttribute.key, true),
                  weightedAttribute.value, 
                  weightedAttribute.weight.value.toFixed(3),
                  isNumber(weightedAttribute.value) ? (weightedAttribute.value * weightedAttribute.weight.value).toFixed(3) : ""]
              )
          ), attributesWeighted)
        }
      </FlexRows>            
        {
          renderRow(["Total", null, null, domainItem.score.toFixed(3)], true)
        }
    </StyledContanier>
  )
}

const mapStateToProps = state => ({
  weights: state.domainItems.actualWeights
})

export default connect(mapStateToProps, {})(DomainItemWeightedAttrExplained);