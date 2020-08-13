import React from 'react';
import { connect } from "react-redux"
import {ListItemHeader, ListItemContent, ListItem} from './common/SemanticComponentStyled'
import {Label as LabelSem} from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {selectWeightedItem} from '../redux/actions/actions'

class WeightedItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            backgroundColor: null
        }
    }

    onItemClick = (event, data) => {
        this.props.selectWeightedItemAction(this.props.weightedItem.id)
    }

    render() {
        if(this.props.weightedItem.isIndexChanged()){
            this.state.backgroundColor = "primaryColor"
            setTimeout(() => {
                this.props.weightedItem.syncIndex()
                this.setState({
                    backgroundColor: null
                })
            }, 2000);
        }
        return (
            <ListItem key={this.props.weightedItem.name} onClick={this.onItemClick} selection>
                <FlexColumns>
                    <Div marginRight="10px">
                        <LabelSem color="orange" circular>{parseInt(this.props.weightedItem.score)}</LabelSem>
                    </Div>                    
                    <ListItemContent backgroundthemedcolor={this.state.backgroundColor}>
                        <ListItemHeader>{this.props.weightedItem.name}</ListItemHeader>
                        {this.props.weightedItem.description}
                    </ListItemContent>
                </FlexColumns>                
            </ListItem>
        )
    }
}

export default connect(null, {selectWeightedItemAction: selectWeightedItem})(WeightedItem);