import React from 'react';
import { connect } from "react-redux"
import { List, Transition} from 'semantic-ui-react'
import {map} from "lodash/fp"
import WeightedItem from './WeightedItem'

const WeightedItems = ({domainItems}) => (
    <Transition.Group as={List} duration={200} selection size="large" divided verticalAlign='middle'>
        {
            map(domainItem => 
                <WeightedItem key={domainItem.name} weightedItem={domainItem}/> , domainItems)
        }
    </Transition.Group>    
  )

  const mapStateToProps = state => ({
    domainItems: state.domainItems.items
  })

  export default connect(mapStateToProps)(WeightedItems);