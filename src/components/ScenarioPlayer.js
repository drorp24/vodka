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

export const SimulationPlayerContainer = styled(FlexColumns)`
    border-radius: 10px;
`;

const ScenarioPlayer = ({scenarioId, scenarios, scenarioCurrentStepIdx, selectScenarioStepAction, weights, presetId}) => {
    const scenarioSelected = scenarioId !== null
    const prevDisabled = scenarioCurrentStepIdx <= 0    
    const currentScenario = find((scenario) => scenario.id.value === scenarioId, scenarios)
    const stepsLabels = []
    if(currentScenario){
        for (let index = 0; index < currentScenario.stepsCount.value; index++) {
            stepsLabels.push(`Step ${index + 1}`)
        }
    }
    const nextDisabled = scenarioCurrentStepIdx >= stepsLabels.length - 1
    const currentText = scenarioCurrentStepIdx < 0 ? "Pre Load" : stepsLabels[scenarioCurrentStepIdx]
    const prevText = scenarioCurrentStepIdx <= 0 ? "Prev" : stepsLabels[scenarioCurrentStepIdx - 1]
    const nextText = scenarioCurrentStepIdx < 0 ? stepsLabels[0] : nextDisabled ? "Next" : stepsLabels[scenarioCurrentStepIdx + 1]

    const handleScenarionStepRequest = (scenarioStepIdx) => {
        const loadItemsRequestBody = getLoadItemsRequestBody({presetId, weights, scenarioId, scenarioStepIdx})
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
            <Div styleType={!scenarioSelected ? "simPlayerLabelDisabled": "simPlayerLabel"} marginLeft="5px">Simulation: </Div>
            <Div marginLeft="10px"><Label  pointing='right' color="orange" >{currentText}</Label></Div>
            <Div marginLeft="20px">
                <Button size="tiny" icon labelPosition='left' basic color="orange" disabled={prevDisabled} circular onClick={handlePrevRequest}>
                    <Icon name='caret square left' />
                    {prevText}
                </Button>
            </Div>
            <Div marginLeft="10px">
                <Button disabled={nextDisabled} size="tiny" icon labelPosition='right' basic color="orange"  circular onClick={handleNextRequest}>
                    <Icon name='caret square right' />
                    {nextText}
                </Button>
            </Div>
        </SimulationPlayerContainer>
    )
}

const mapStateToProps = state => ({
    scenarios: state.simulation.scenarios,
    scenarioId: state.simulation.selectedScenarioId,
    scenarioCurrentStepIdx: state.simulation.scenarioCurrentStepIdx,
    weights: state.domainItems.weights,
    presetId: state.domainItems.selectedPresetId,
})

export default connect(mapStateToProps, {selectScenarioStepAction: selectScenarioStep})(ScenarioPlayer);