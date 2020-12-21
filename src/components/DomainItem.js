import React from 'react';
import { connect } from "react-redux"
import { Label as LabelSem, Icon } from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import {find} from 'lodash/fp'
import { FlexColumns, FlexRows } from './common/CommonComponents';
import { Div } from './common/StyledElements';
import { handleDomainItemPressed, selectDomainItemForComparison } from '../redux/actions/actions'
import DomainItemWeightedAttrExplained from './DomainItemWeightedAttrExplained'
import {max_items_to_compare, task_colors} from '../configLoader';
import LOCALES from "../i18n/locales"

export const DomainItemFlexColumns = styled(FlexColumns)`    
    border-bottom: ${({theme}) => `1px solid ${theme["borderColor"]}`};
    :hover  {
        cursor: pointer;
        background-color: ${({theme}) => `${theme["backgroudHoverColor"]}`};
      }
    ${({scoreColor, locale}) => locale === LOCALES.HEBREW ? `border-left: 5px solid ${scoreColor}` : `border-right: 5px solid ${scoreColor}`};    
`;

export const DomainItemExpandedFlexRows = styled(FlexRows)`
    border-bottom: ${({theme}) => `1px solid ${theme["borderColor"]}`};
    :hover  {
        cursor: pointer;
        background-color: ${({theme}) => `${theme["backgroudHoverColor"]}`};
    }
    ${({scoreColor, locale}) => locale === LOCALES.HEBREW ? `border-left: 5px solid ${scoreColor}` : `border-right: 5px solid ${scoreColor}`};
`;

class DomainItem extends React.Component {

  calcColor = (relativeScore) => {
    let level = 1
    while (level < task_colors.length){          
      if(relativeScore <= level/task_colors.length) break
      level += 1
    }
    return task_colors[level - 1]
  }

  onItemClick = (event, data) => {
    if(this.props.compareDomainItemsMode){
      if(this.props.selectedDomainItemsIdsForCmp.length < max_items_to_compare){
        this.props.selectDomainItemForComparisonAction(this.props.domainItem.id)
      }
      else if(find((id) => id === this.props.domainItem.id, this.props.selectedDomainItemsIdsForCmp))
      {
        this.props.selectDomainItemForComparisonAction(this.props.domainItem.id)
      }           
    }
    else {
      this.props.handleDomainItemPressedAction(this.props.domainItem.id)
    }    
  }

  checkDisabled = () => {
    if(!this.props.compareDomainItemsMode){
      return true
    }
    if(this.props.selectedDomainItemsIdsForCmp.length < max_items_to_compare || 
      find((id) => id === this.props.domainItem.id, this.props.selectedDomainItemsIdsForCmp)){
      return false
    }
    return true

  }

  renderItemShort = () => {
    return (
      <FlexColumns width="100%">
          <Div flexBasis="90%" display="grid">
          <Div styleType={this.props.compareDomainItemsMode ? "label3disabled" : "label3"}>{this.props.domainItem.name}</Div>
          <Div styleType="labelDefaultDisabled">{this.props.domainItem.description}</Div>
        </Div>
        <Div margin={this.props.locale === LOCALES.HEBREW ? `0px 15px 0px 0px` : `0px 0px 0px 15px`}>
          <LabelSem  color={this.props.theme["secondaryButtonColor"]} circular>{Math.round(this.props.domainItem.score)}</LabelSem>
        </Div >
      </FlexColumns>
    )
  }

  renderCompare = () => {
    const selectedForComparison = this.props.selectedDomainItemsIdsForCmp.indexOf(this.props.domainItem.id) !== -1
    return (
      <Div margin={this.props.locale === LOCALES.HEBREW ? `0px 0px 0px 10px` : `0px 10px 0px 0px`}>
        <Icon color={this.props.theme["selectForCompareColor"]} disabled={this.checkDisabled()} size="large" 
              name={selectedForComparison ? "check circle outline" : "circle outline"}/>
      </Div>
    )
  }

  render() {    
    let backgroundColor = null
    if (this.props.domainItem.isIndexChanged()) {
      backgroundColor = "temporarySignalColor"
      setTimeout(() => {
        this.props.domainItem.syncIndex()
        this.setState({})
      }, 2000);
    }
    return (
    this.props.domainItem.expanded ?
      (
        <DomainItemExpandedFlexRows locale={this.props.locale} scoreColor={this.calcColor(this.props.relativeScore)} style={this.props.style} themedbackgroundcolor={this.props.domainItem.id === this.props.selectedDomainItemID ? "selectedItemBackgroundColor": backgroundColor}>
          <FlexColumns  alignItems="center" padding={this.props.compareDomainItemsMode ? "10px 10px 10px 5px" : "10px"}  onClick={this.onItemClick}>
              {
                this.props.compareDomainItemsMode ? 
                this.renderCompare() : null
              }
              {
                this.renderItemShort()
              }
          </FlexColumns>
          <DomainItemWeightedAttrExplained  domainItem={this.props.domainItem}/>
        </DomainItemExpandedFlexRows>
      )
      :
      (
        <DomainItemFlexColumns locale={this.props.locale} scoreColor={this.calcColor(this.props.relativeScore)} style={this.props.style} themedbackgroundcolor={this.props.domainItem.id === this.props.selectedDomainItemID ? "selectedItemBackgroundColor": backgroundColor} alignItems="center" padding={this.props.compareDomainItemsMode ? "10px 10px 10px 5px" : "10px"}  onClick={this.onItemClick}>
          {
            this.props.compareDomainItemsMode ? 
            this.renderCompare() : null
          }
          {
            this.renderItemShort()
          }
        </DomainItemFlexColumns>
      )
    )
  }
}

const mapStateToProps = state => ({
  compareDomainItemsMode: state.ui.compareDomainItemsMode,
  selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
  selectedDomainItemID: state.domainItems.selectedDomainItemID
})

export default connect(mapStateToProps, {
  handleDomainItemPressedAction: handleDomainItemPressed,
  selectDomainItemForComparisonAction: selectDomainItemForComparison
})(withTheme(DomainItem));