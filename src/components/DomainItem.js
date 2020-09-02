import React from 'react';
import { connect } from "react-redux"
import {Label as LabelSem} from 'semantic-ui-react';
import styled from 'styled-components';
import {FlexColumns, FlexRows} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {selectWeightedItem} from '../redux/actions/actions'

export const DomainItemContainer = styled(FlexColumns)`
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
        this.props.selectWeightedItemAction(this.props.domainItem.id)
    }

    render() {
        if(this.props.domainItem.isIndexChanged()){
            this.state.backgroundColor = "temporarySignalColor"
            setTimeout(() => {
                this.props.domainItem.syncIndex()
                this.setState({
                    backgroundColor: null
                })
            }, 2000);
        }
        return (
            <DomainItemContainer height="60px" themedbackgroundcolor={this.state.backgroundColor} alignItems="center" padding="10px" themedHover="defaultMouseHover"  onClick={this.onItemClick}>
                <FlexRows flexBasis="90%" >
                    <Div  styleType="label3">{this.props.domainItem.name}</Div>
                    <Div>{this.props.domainItem.description}</Div>
                </FlexRows>
                <LabelSem color="orange" circular>{parseInt(this.props.domainItem.score)}</LabelSem>
            </DomainItemContainer>
        )
    }
}

export default connect(null, {selectWeightedItemAction: selectWeightedItem})(DomainItem);