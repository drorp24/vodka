import React from 'react';
import { connect } from "react-redux"
import {map} from 'lodash/fp'
import {Divider, Loader,  Header} from 'semantic-ui-react';
import {FlexRows} from './common/CommonComponents';
import Scenario from './Scenario'
import { loadScenarios } from '../redux/actions/actions';
import AsyncRestParams from '../types/asyncRestParams';


const Scenarios = ({scenarios, selectedScenarioId, loadScenariosAction, scenariosLoading}) => {
    React.useEffect(() => {
        loadScenariosAction(new AsyncRestParams("/simulation/scenario", "GET"))
    }, [loadScenariosAction])
    return (
            <FlexRows>
            <FlexRows styleType="label2" alignItems="center">
                <Header>Scenarios</Header>
            </FlexRows>
            <Divider/>
            <Loader size="massive" active={scenariosLoading} content="Loading"/>
            <FlexRows>
            {                
                map((scenario => <Scenario key={scenario.id.value} selected={selectedScenarioId === scenario.id.value} scenario={scenario}/>), scenarios)
            }            
            </FlexRows>            
        </FlexRows>             
    )
}

const mapStateToProps = state => ({
    scenarios: state.simulation.scenarios,
    selectedScenarioId: state.simulation.selectedScenarioId,
    scenariosLoading: state.simulation.scenariosLoading
})

export default connect(mapStateToProps, {loadScenariosAction: loadScenarios})(Scenarios);