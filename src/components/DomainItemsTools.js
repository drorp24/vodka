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
    loadDomainItemsByPreset
} from '../redux/actions/actions'
import AsyncRESTMeta from '../types/asyncRESTMeta';

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

export const DropdownContainer = styled(FlexColumns)`
    border-right: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const DomainItemsTools = ({presets, selectedPresetId, selectedDomainItemsIdsForCmp, compareDomainItemsMode, 
    toggleCompareDomainItemsModeAction, clearAllSelectedItemsForComparisonAction, 
    loadDomainItemsByPresetAction, theme}) => {
    const onCompareClick = () => {
        toggleCompareDomainItemsModeAction()
    }
    const onClearSelectedClick = () => {
        clearAllSelectedItemsForComparisonAction()
    }

    const handlePresetSelected = (event, data) => {
        const selectedPreset = getOr(null, "value", data)
        loadDomainItemsByPresetAction(new AsyncRESTMeta("/items", "POST"), {preset_id:selectedPreset})
    }

    return (
        <DomainItemsToolsContainer alignItems="center" justifyContent="space-between">
            <DropdownContainer minHeight="40px" alignItems="center" flexBasis="70%" justifyContent="space-between">
                <Div marginLeft="10px" styleType="label3disabled">
                    Choose preset:
                </Div>
                <Div marginRight="20px" styleType="label3disabled">
                    <Dropdown
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

const mapStateToProps = state => ({
    presets: map((preset)=>({key:preset.id, text:preset.name.length > 15 ? `${preset.name.substring(0,15)}...` : preset.name, value:preset.id}),state.domainItems.presets),
    selectedPresetId: state.domainItems.selectedPresetId,
    compareDomainItemsMode: state.ui.compareDomainItemsMode,
    selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp
})

export default connect(mapStateToProps, {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison,
        loadDomainItemsByPresetAction: loadDomainItemsByPreset
})(withTheme(DomainItemsTools));