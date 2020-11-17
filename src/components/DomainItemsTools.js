import React from 'react';
import { connect } from "react-redux"
import {Dropdown, Button} from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import {map, getOr} from 'lodash/fp'
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import { 
    toggleCompareDomainItemsMode, 
    clearAllSelectedItemsForComparison,
    loadDomainItems,
    loadPresets
} from '../redux/actions/actions'
import AsyncRestParams from '../types/asyncRestParams';
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

export const DropdownContainer = styled(FlexColumns)`
    border-right: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const DomainItemsTools = ({presets, selectedPresetId, selectedDomainItemsIdsForCmp, compareDomainItemsMode, 
    toggleCompareDomainItemsModeAction, clearAllSelectedItemsForComparisonAction, 
    loadDomainItemsAction, loadPresetsAction, loadingPresets, weights, 
    scenarioId, scenarioStepIdx, domainItems, theme}) => {
    const onCompareClick = () => {
        toggleCompareDomainItemsModeAction()
    }
    const onClearSelectedClick = () => {
        clearAllSelectedItemsForComparisonAction()
    }

    const handlePresetSelected = (event, data) => {
        const presetId = getOr(null, "value", data)
        const loadItemsRequestBody = getLoadItemsRequestBody({presetId, weights, scenarioId, scenarioStepIdx})
        loadDomainItemsAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody)
    }    

    const openPresetsList = () => {
        loadPresetsAction(new AsyncRestParams("/config/rules_preset?user_name=shayde", "GET"))
    }

    return (
        <DomainItemsToolsContainer alignItems="center" justifyContent="space-between">
            <DropdownContainer minHeight="40px" alignItems="center" flexBasis="70%" justifyContent="space-between">
                <Div marginLeft="10px" styleType="label3disabled">
                    Choose preset:
                </Div>
                <Div marginRight="20px" styleType="label3disabled">
                    <Dropdown
                        onOpen={openPresetsList}                        
                        options={presets}
                        value={selectedPresetId}
                        onChange={handlePresetSelected}
                    />
                </Div>
            </DropdownContainer>
            <Div marginRight="20px">
                <Button color={theme["topbarSliderButton"]} size="small" circular icon={compareDomainItemsMode  ? "log out" : "check"}
                        onClick={onCompareClick}/>
                {
                    selectedDomainItemsIdsForCmp.length > 0 ? 
                    <Button color={theme["topbarSliderButton"]} size="small" circular onClick={onClearSelectedClick} icon="erase"/> : null
                }
            </Div>
        </DomainItemsToolsContainer>
    )
}

const mapStateToProps = state => {
    return {
        presets: map((preset)=>({key:preset.id, text:preset.name.length > 15 ? `${preset.name.substring(0,15)}...` : preset.name, value:preset.id}),state.domainItems.presets),
        selectedPresetId: state.domainItems.selectedPresetId,
        compareDomainItemsMode: state.ui.compareDomainItemsMode,
        selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
        loadingPresets: state.domainItems.loadingPresets,
        weights: state.domainItems.weights,
        scenarioId: state.simulation.selectedScenarioId,
        scenarioStepIdx: state.simulation.scenarioCurrentStepIdx,
        domainItems: state.domainItems.items
    }
}

export default connect(mapStateToProps, {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison,
        loadDomainItemsAction: loadDomainItems,
        loadPresetsAction: loadPresets
})(withTheme(DomainItemsTools));