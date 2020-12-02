import React from 'react';
import { connect } from "react-redux"
import {map} from 'lodash/fp'
import {Loader, Dimmer} from 'semantic-ui-react';
import {FlexRows} from './common/CommonComponents';
import Scenario from './Scenario'
import { loadScenarios } from '../redux/actions/actions';
import AsyncRestParams from '../types/asyncRestParams';
import translate from '../i18n/translate';

const Scenarios = ({scenarios, selectedScenarioId, loadScenariosAction, scenariosLoading, closeCB}) => {
    React.useEffect(() => {
        loadScenariosAction(new AsyncRestParams("/simulation/scenario", "GET"))
    }, [loadScenariosAction])
    return (
            <FlexRows maxHeight="50vh">
                <Dimmer active={scenariosLoading} inverted>
                    <Loader size="massive" content={translate("loading")}/>
                </Dimmer>                
                <FlexRows>
                {                
                    map((scenario => <Scenario closeCB={closeCB} key={scenario.id} selected={selectedScenarioId === scenario.id} scenario={scenario}/>), scenarios)
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