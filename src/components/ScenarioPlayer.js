import React from 'react';
import { connect } from "react-redux"
import {Button, Icon, Label} from 'semantic-ui-react';
import styled from 'styled-components';
import {find} from 'lodash/fp'
import { Div } from "./common/StyledElements"
import {FlexColumns} from './common/CommonComponents';
import {selectScenarioStep} from '../redux/actions/actions'
import AsyncRestParams from '../types/asyncRestParams';
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'
import {map} from 'lodash/fp'

export const SimulationPlayerContainer = styled(FlexColumns)`
    border-radius: 10px;
`;

const ScenarioPlayer = ({scenarioId, scenarios, scenarioCurrentStepIdx, selectScenarioStepAction, weights, priorityPresetId, filterPresetId, geoPresetId, domainItems}) => {
    const scenarioSelected = scenarioId !== null
    const prevDisabled = !priorityPresetId || scenarioCurrentStepIdx <= 0    
    const currentScenario = find((scenario) => scenario.id.value === scenarioId, scenarios)
    const stepsLabels = []
    if(currentScenario){
        for (let index = 0; index < currentScenario.stepsCount.value; index++) {
            stepsLabels.push(`Step ${index + 1}`)
        }
    }
    const nextDisabled = !priorityPresetId || scenarioCurrentStepIdx >= stepsLabels.length - 1
    const currentText = scenarioCurrentStepIdx < 0 ? "Pre Load" : stepsLabels[scenarioCurrentStepIdx]

    const handleScenarionStepRequest = (scenarioStepIdx) => {
        const ids = map((domainItem)=> domainItem.id, domainItems)
        const loadItemsRequestBody = getLoadItemsRequestBody({priorityPresetId, filterPresetId, geoPresetId, weights, scenarioId, scenarioStepIdx, ids})
        selectScenarioStepAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody)
    }
    const handleNextRequest = () => {
        handleScenarionStepRequest(scenarioCurrentStepIdx + 1)
    }
    const handlePrevRequest = () => {
        handleScenarionStepRequest(scenarioCurrentStepIdx - 1)
    }
    return (
        <SimulationPlayerContainer visibility={!scenarioSelected ? "collapse" : "visible"} padding="5px" marginRight="15px" alignItems="center" styleType={scenarioSelected ? "simPlayerBorderDisabled": "simPlayerBorder"}>
            <Div styleType={!scenarioSelected ? "simPlayerLabelDisabled": "simPlayerLabel"} marginLeft="5px">Simulation</Div>
            <Div marginLeft="10px">
                <Button size="tiny" icon labelPosition='left' basic color="orange" disabled={prevDisabled} circular onClick={handlePrevRequest}>
                    <Icon name='caret square left' />
                    Prev
                </Button>
            </Div>
            <Div marginLeft="10px"><Label circular color="orange" >{currentText}</Label></Div>
            <Div marginLeft="10px">
                <Button disabled={nextDisabled} size="tiny" icon labelPosition='right' basic color="orange"  circular onClick={handleNextRequest}>
                    <Icon name='caret square right' />
                    Next
                </Button>
            </Div>
        </SimulationPlayerContainer>
    )
}

const mapStateToProps = state => ({
    domainItems: state.domainItems.items,
    priorityPresetId: state.domainItems.selectedPriorityPresetId,
    filterPresetId: state.domainItems.selectedFilterPresetId,
    geoPresetId: state.domainItems.selectedGeoPresetId,
    weights: state.domainItems.weights,
    scenarios: state.simulation.scenarios,
    scenarioId: state.simulation.selectedScenarioId,
    scenarioCurrentStepIdx: state.simulation.scenarioCurrentStepIdx
})

export default connect(mapStateToProps, {selectScenarioStepAction: selectScenarioStep})(ScenarioPlayer);