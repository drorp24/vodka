import React from 'react';
import { connect } from "react-redux"
import {map} from 'lodash/fp'
import {Divider, Label} from 'semantic-ui-react';
import {FlexColumns, FlexRows} from './common/CommonComponents';
import Scenario from './Scenario'


const Scenarios = ({scenarios, selectedScenarioId}) => {
    return (
        <FlexRows>
            <FlexRows styleType="label2" alignItems="center">
                <Label size="huge" color="green" basic>Scenarios</Label>
            </FlexRows>
            <Divider/>
            <FlexColumns flexWrap="wrap" maxWidth="650px" maxHeight="50vh">
            {
                map((scenario => <Scenario selected={selectedScenarioId === scenario.id} scenario={scenario}/>), scenarios)
            }            
            </FlexColumns>            
        </FlexRows>        
    )
}

const mapStateToProps = state => ({
    scenarios: state.simulation.scenarios,
    selectedScenarioId: state.simulation.selectedScenarioId
})

export default connect(mapStateToProps, {})(Scenarios);