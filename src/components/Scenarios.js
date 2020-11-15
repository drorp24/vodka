import React from 'react';
import { connect } from "react-redux"
import {map} from 'lodash/fp'
import {Divider, Label, Loader} from 'semantic-ui-react';
import {FlexColumns, FlexRows} from './common/CommonComponents';
import Scenario from './Scenario'
import { loadScenarios } from '../redux/actions/actions';
import AsyncRESTMeta from '../types/asyncRESTMeta';


const Scenarios = ({scenarios, selectedScenarioId, loadScenariosAction, scenariosLoading}) => {
    React.useEffect(() => {
        loadScenariosAction(new AsyncRESTMeta("/simulation/scenario", "GET", "http://localhost:5000"))
    }, [loadScenariosAction])
    return (
            <FlexRows>
            <FlexRows styleType="label2" alignItems="center">
                <Label size="huge" color="orange" basic>Scenarios</Label>
            </FlexRows>
            <Divider/>
            <Loader size="massive" active={scenariosLoading} content="Loading"/>
            <FlexColumns flexWrap="wrap" width="600px" height="50vh">
            {                
                map((scenario => <Scenario key={scenario.id.value} selected={selectedScenarioId === scenario.id.value} scenario={scenario}/>), scenarios)
            }            
            </FlexColumns>            
        </FlexRows>             
    )
}

const mapStateToProps = state => ({
    scenarios: state.simulation.scenarios,
    selectedScenarioId: state.simulation.selectedScenarioId,
    scenariosLoading: state.simulation.scenariosLoading
})

export default connect(mapStateToProps, {loadScenariosAction: loadScenarios})(Scenarios);