import React from 'react';
import { connect } from "react-redux"
import { List, Transition} from 'semantic-ui-react'
import {ListItemHeader, ListItemContent, ListItem} from './common/SemanticComponentStyled'
import {map} from "lodash/fp"

const WeightedItems = ({weightedItems}) => (
    <Transition.Group as={List} duration={200} selection size="large" divided verticalAlign='middle'>
        {
            map(weightedItem => 
                <ListItem key={weightedItem.name}>
                    <ListItemContent>
                        <ListItemHeader>{weightedItem.name}</ListItemHeader>
                        {weightedItem.description}
                    </ListItemContent>
                </ListItem>, weightedItems)
        }
    </Transition.Group>    
  )

  const mapStateToProps = state => ({
    weightedItems: state.weightedItems.items
  })

  export default connect(mapStateToProps)(WeightedItems);