import React from 'react';
import { connect } from "react-redux"
import {Label as LabelSem} from 'semantic-ui-react';
import styled from 'styled-components';
import {FlexColumns, FlexRows} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {handleDomainItemPressed} from '../redux/actions/actions'
import DomainItemExplained from './DomainItemExplained'

export const DomainItemFlexColumns = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
    :hover  {
        cursor: pointer;
        background-color: ${({ theme }) => `${theme["backgroudHoverColor"]}`};
      }
`;

export const DomainItemExpandedFlexRows = styled(FlexRows)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
    :hover  {
        cursor: pointer;
        background-color: ${({ theme }) => `${theme["backgroudHoverColor"]}`};
      }
`;

class DomainItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            backgroundColor: null
        }
    }

    onItemClick = (event, data) => {
        this.props.handleDomainItemPressedAction(this.props.domainItem.id)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.domainItem.isIndexChanged()) {            
            this.setState({
                backgroundColor: "temporarySignalColor"
            })
        }
      }

    render() {
        if(this.props.domainItem.isIndexChanged()){
            setTimeout(() => {
                this.props.domainItem.syncIndex()
                this.setState({
                    backgroundColor: null
                })
            }, 2000);
        }
        return (
            this.props.domainItem.expanded ?
                (
                    <DomainItemExpandedFlexRows height="240px">
                        <FlexColumns themedbackgroundcolor={this.state.backgroundColor} alignItems="center" padding="10px" themedHover="defaultMouseHover" onClick={this.onItemClick}>
                            <FlexRows flexBasis="90%" >
                                <Div styleType="label3">{this.props.domainItem.name}</Div>
                                <Div>{this.props.domainItem.description}</Div>
                            </FlexRows>
                            <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
                        </FlexColumns>
                        <DomainItemExplained domainItem={this.props.domainItem}/>
                    </DomainItemExpandedFlexRows>                    
                )
              :
                (
                    <DomainItemFlexColumns height="60px" themedbackgroundcolor={this.state.backgroundColor} alignItems="center" padding="10px" themedHover="defaultMouseHover"  onClick={this.onItemClick}>
                        <FlexRows flexBasis="90%" >
                            <Div styleType="label3">{this.props.domainItem.name}</Div>
                            <Div>{this.props.domainItem.description}</Div>
                        </FlexRows>
                        <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
                    </DomainItemFlexColumns>
                )
        )
    }
}

export default connect(null, {handleDomainItemPressedAction: handleDomainItemPressed})(DomainItem);