import React from 'react';
import { connect } from "react-redux"
import { Label as LabelSem, Icon } from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import { FlexColumns, FlexRows } from './common/CommonComponents';
import { Div } from './common/StyledElements';
import { handleDomainItemPressed, selectDomainItemForComparison } from '../redux/actions/actions'
import DomainItemWeightedAttrExplained from './DomainItemWeightedAttrExplained'
import {COMPARE_DOMAIN_ITMES_OFF, COMPARE_DOMAIN_ITMES_SELECT} from '../types/compareDomainItemsEnum';

export const DomainItemFlexColumns = styled(FlexColumns)`
    border-bottom: ${({theme}) => `1px solid ${theme["borderColor"]}`};
    :hover  {
        cursor: pointer;
        background-color: ${({theme}) => `${theme["backgroudHoverColor"]}`};
      }
`;

export const DomainItemExpandedFlexRows = styled(FlexRows)`
    border-bottom: ${({theme}) => `1px solid ${theme["borderColor"]}`};
    :hover  {
        cursor: pointer;
        background-color: ${({theme}) => `${theme["backgroudHoverColor"]}`};
      }
`;

class DomainItem extends React.Component {

  onItemClick = (event, data) => {
    if(this.props.compareDomainItemsMode === COMPARE_DOMAIN_ITMES_OFF){
      this.props.handleDomainItemPressedAction(this.props.domainItem.id)      
    }
    else if(this.props.compareDomainItemsMode === COMPARE_DOMAIN_ITMES_SELECT){
      this.props.selectDomainItemForComparisonAction(this.props.domainItem.id)
    }    
  }

  render() {
    const selectedForComparison = this.props.selectedDomainItemsIdsForCmp.indexOf(this.props.domainItem.id) !== -1
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
        <DomainItemExpandedFlexRows position="relative" style={this.props.style} themedbackgroundcolor={backgroundColor}>
              <FlexColumns  alignItems="center" padding="10px"  onClick={this.onItemClick}>
                  <Div flexBasis="90%" display="grid">
                      <Div styleType="label2">{this.props.domainItem.name}</Div>
                      <Div styleType="labelDefaultDisabled">{this.props.domainItem.description}</Div>
                  </Div>
                  <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
                  <Div position="absolute" visibility={this.props.compareDomainItemsMode !== COMPARE_DOMAIN_ITMES_OFF ? "visible" : "collapse"}>
                    <Icon color={this.props.theme["selectForCompareColor"]} disabled={this.props.compareDomainItemsMode !== COMPARE_DOMAIN_ITMES_SELECT} size="large" 
                          name={selectedForComparison ? "check circle outline" : "circle outline"}/>
                  </Div>
              </FlexColumns>
              <DomainItemWeightedAttrExplained domainItem={this.props.domainItem}/>
          </DomainItemExpandedFlexRows>
      )
      :
      (
        <DomainItemFlexColumns position="relative" style={this.props.style} themedbackgroundcolor={backgroundColor} alignItems="center" padding="10px"  onClick={this.onItemClick}>
            <Div flexBasis="90%" display="grid">
                <Div styleType={this.props.compareDomainItemsMode !== COMPARE_DOMAIN_ITMES_OFF ? "label2disabled" : "label2"}>{this.props.domainItem.name}</Div>
                <Div styleType="labelDefaultDisabled">{this.props.domainItem.description}</Div>
            </Div>
            <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
            <Div position="absolute" visibility={this.props.compareDomainItemsMode !== COMPARE_DOMAIN_ITMES_OFF ? "visible" : "collapse"}>
              <Icon color={this.props.theme["selectForCompareColor"]} disabled={this.props.compareDomainItemsMode !== COMPARE_DOMAIN_ITMES_SELECT} size="large" 
                    name={selectedForComparison ? "check circle outline" : "circle outline"}/>
            </Div>
        </DomainItemFlexColumns>
      )
    )
  }
}

const mapStateToProps = state => ({
  compareDomainItemsMode: state.ui.compareDomainItemsMode,
  selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp
})

export default connect(mapStateToProps, {
  handleDomainItemPressedAction: handleDomainItemPressed,
  selectDomainItemForComparisonAction: selectDomainItemForComparison
})(withTheme(DomainItem));