import React from 'react';
import { connect } from "react-redux"
import { List, Transition} from 'semantic-ui-react'
import {map} from "lodash/fp"
import WeightedItem from './WeightedItem'

const WeightedItems = ({weightedItems}) => (
    <Transition.Group as={List} duration={200} selection size="large" divided verticalAlign='middle'>
        {
            map(weightedItem => 
                <WeightedItem key={weightedItem.name} weightedItem={weightedItem}/> , weightedItems)
        }
    </Transition.Group>    
  )

  const mapStateToProps = state => ({
    weightedItems: state.weightedItems.items
  })

  export default connect(mapStateToProps)(WeightedItems);