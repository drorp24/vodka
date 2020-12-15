import React from 'react';
import { connect } from "react-redux"
import {Button, Icon, Label} from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import {find} from 'lodash/fp'
import { Div } from "./common/StyledElements"
import {FlexColumns} from './common/CommonComponents';
import {selectScenarioStep} from '../redux/actions/actions'
import AsyncRestParams from '../types/asyncRestParams';
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'
import {map} from 'lodash/fp'
import translate from '../i18n/translate'
import LOCALES from "../i18n/locales"

export const SimulationPlayerContainer = styled(FlexColumns)`
    margin-top: 10px;
    border-radius: 10px;
`;

const ScenarioPlayer = ({parentScenarioId, scenarioId, scenarios, scenarioCurrentStepIdx, selectScenarioStepAction, weights, priorityPresetId, filterPresetId, geoPresetId, domainItems, locale, theme}) => {
    const scenarioSelected = scenarioId !== null
    const prevDisabled = !priorityPresetId || scenarioCurrentStepIdx <= 0    
    const currentScenario = find((scenario) => scenario.id === scenarioId, scenarios)
    const stepsLabels = []
    if(currentScenario){
        for (let index = 0; index < currentScenario.stepsCount; index++) {
            stepsLabels.push(translate("step", false, {number: index + 1}))
        }
    }
    const nextDisabled = !priorityPresetId || scenarioCurrentStepIdx >= stepsLabels.length - 1
    const currentText = scenarioCurrentStepIdx < 0 ? translate("pre_load") : stepsLabels[scenarioCurrentStepIdx]

    const handleScenarionStepRequest = (scenarioStepIdx) => {
        const ids = map((domainItem)=> domainItem.id, domainItems)
        const loadItemsRequestBody = getLoadItemsRequestBody({priorityPresetId, filterPresetId, geoPresetId, weights, scenarioId, scenarioStepIdx, ids})
        selectScenarioStepAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody, weights)
    }
    const handleNextRequest = () => {
        handleScenarionStepRequest(scenarioCurrentStepIdx + 1)
    }
    const handlePrevRequest = () => {
        handleScenarionStepRequest(scenarioCurrentStepIdx - 1)
    }
    return (
        <SimulationPlayerContainer justifyContent="center" visibility={scenarioSelected && parentScenarioId === scenarioId ? "visible" : "collapse"} padding="5px" alignItems="center" styleType={scenarioSelected ? "simPlayerBorderDisabled": "simPlayerBorder"}>            
            <Div marginLeft="10px">
                <Button size="tiny" icon labelPosition={locale === LOCALES.HEBREW? 'right' : 'left'} basic color={theme["secondaryButtonColor"]} disabled={prevDisabled} circular onClick={handlePrevRequest}>
                    <Icon name={`caret square ${locale === LOCALES.HEBREW ? 'right' : 'left'}`} />
                    {translate("prev")}
                </Button>
            </Div>
            <Div marginLeft="10px"><Label circular color={theme["secondaryButtonColor"]} >{currentText}</Label></Div>
            <Div marginLeft="10px">
                <Button disabled={nextDisabled} size="tiny" icon labelPosition={locale === LOCALES.HEBREW? 'left' : 'right'} basic color={theme["secondaryButtonColor"]}  circular onClick={handleNextRequest}>
                    <Icon name={`caret square ${locale === LOCALES.HEBREW ? 'left' : 'right'}`} />
                    {translate("next")}
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
    scenarioCurrentStepIdx: state.simulation.scenarioCurrentStepIdx,
    locale: state.ui.locale,
})

export default connect(mapStateToProps, {selectScenarioStepAction: selectScenarioStep})(withTheme(ScenarioPlayer));