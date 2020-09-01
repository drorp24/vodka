import React from 'react';
import { connect } from "react-redux"
import {map} from 'lodash/fp'
import {FlexRows} from './common/CommonComponents';
import Weight from './Weight'
import {setWeight} from '../redux/actions/actions'


const Weights = ({weights, setWeightAction}) => {
    const renderWeight = (weight) => (<Weight key={weight.key} weight={weight} onChange={setWeightAction}/>)
    return (
        <FlexRows width="100%">
            {map(weight => {
                    return renderWeight(weight)
                },
            weights)}
        </FlexRows>        
    )
}

const mapStateToProps = state => ({
    weights: state.domainItems.weights
})

export default connect(mapStateToProps, {setWeightAction: setWeight})(Weights);