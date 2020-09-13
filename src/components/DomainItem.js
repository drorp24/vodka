import React from 'react';
import { connect } from "react-redux"
import { Label as LabelSem } from 'semantic-ui-react';
import styled from 'styled-components';
import { FlexColumns, FlexRows } from './common/CommonComponents';
import { Div } from './common/StyledElements';
import { handleDomainItemPressed } from '../redux/actions/actions'
import DomainItemWeightedAttrExplained from './DomainItemWeightedAttrExplained'

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
    this.props.handleDomainItemPressedAction(this.props.domainItem.id)
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
      <DomainItemExpandedFlexRows style={this.props.style} themedbackgroundcolor={backgroundColor}>
              <FlexColumns  alignItems="center" padding="10px"  onClick={this.onItemClick}>
                  <FlexRows flexBasis="90%" >
                      <Div styleType="label2">{this.props.domainItem.name}</Div>
                      <Div styleType="labelDefaultDisabled">{this.props.domainItem.description}</Div>
                  </FlexRows>
                  <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
              </FlexColumns>
              <DomainItemWeightedAttrExplained domainItem={this.props.domainItem}/>
          </DomainItemExpandedFlexRows>
      )
      :
      (
      <DomainItemFlexColumns style={this.props.style} themedbackgroundcolor={backgroundColor} alignItems="center" padding="10px"  onClick={this.onItemClick}>
                        <FlexRows flexBasis="90%" >
                            <Div styleType="label2">{this.props.domainItem.name}</Div>
                            <Div styleType="labelDefaultDisabled">{this.props.domainItem.description}</Div>
                        </FlexRows>
                        <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
                    </DomainItemFlexColumns>
      )
    )
  }
}

export default connect(null, {
  handleDomainItemPressedAction: handleDomainItemPressed
})(DomainItem);