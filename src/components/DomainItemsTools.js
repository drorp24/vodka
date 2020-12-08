import React from 'react';
import { connect } from "react-redux"
import {Popup, Button} from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import {map} from 'lodash/fp'
import {FlexColumns} from './common/CommonComponents';
import { toggleCompareDomainItemsMode, clearAllSelectedItemsForComparison, loadMoreDomainItems } from '../redux/actions/actions'
import ChoosePresets from './ChoosePresets'
import translate from "../i18n/translate"
import LOCALES from "../i18n/locales"
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'
import AsyncRestParams from '../types/asyncRestParams';

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

export const DropdownContainer = styled(FlexColumns)`
    border-color: ${({ theme }) => `${theme["borderColor"]}`};
    border-width: ${({ locale }) => locale === LOCALES.HEBREW ? "0px 0px 0px 1px" : "0px 1px 0px 0px"};
    border-style: solid
`;

const DomainItemsTools = ({selectedDomainItemsIdsForCmp, compareDomainItemsMode,
    toggleCompareDomainItemsModeAction, clearAllSelectedItemsForComparisonAction, theme, locale,
    domainItems, scenarioId, scenarioStepIdx, weights, priorityPresetId, filterPresetId, geoPresetId, loadMoreDomainItemsAction, domainItemsAmount}) => {
    
    const [choosePresetIsOpen, setChoosePresetIsOpen] = React.useState(false)
    const onCompareClick = () => {
        toggleCompareDomainItemsModeAction()
    }
    const onClearSelectedClick = () => {
        clearAllSelectedItemsForComparisonAction()
    }

    const onCloseReq = () => {
        setChoosePresetIsOpen(false)
    }

    const handleLoadMore = () => {
        const ids = map((domainItem)=> domainItem.id, domainItems)
        const loadItemsRequestBody = getLoadItemsRequestBody({amount: domainItemsAmount + 10, priorityPresetId, filterPresetId, geoPresetId, weights, scenarioId, scenarioStepIdx, ids})
        loadMoreDomainItemsAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody)
    }    
    return (
        <DomainItemsToolsContainer alignItems="center" justifyContent="space-between">
            <DropdownContainer locale={locale} margin="0px 10px" minHeight="40px" alignItems="center" flexBasis="75%">
                <Popup
                    open={choosePresetIsOpen}
                    position="bottom left"
                    on='click'
                    basic
                    flowing
                    trigger={<Button onClick={() => setChoosePresetIsOpen(!choosePresetIsOpen)}  basic color={theme["secondaryButtonColor"]} content={translate("choose_presets", true)}/>}>
                        <ChoosePresets close={onCloseReq}/>                        
                </Popup>
                <Button disabled={domainItemsAmount < 1} onClick={handleLoadMore}  basic color={theme["secondaryButtonColor"]}>
                    {domainItemsAmount} {translate("items", true)}, {translate("load_more", true)}
                </Button>
            </DropdownContainer>
            <FlexColumns margin="0px 20px">
                <Button color={theme["topbarSliderButton"]} size="small" circular icon={compareDomainItemsMode  ? "log out" : "check"}
                        onClick={onCompareClick}/>
                {
                    selectedDomainItemsIdsForCmp.length > 0 ? 
                    <Button color={theme["topbarSliderButton"]} size="small" circular onClick={onClearSelectedClick} icon="erase"/> : null
                }
            </FlexColumns>
        </DomainItemsToolsContainer>
    )
}

const mapStateToProps = state => {
    return {        
        compareDomainItemsMode: state.ui.compareDomainItemsMode,
        selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
        locale: state.ui.locale,
        domainItems: state.domainItems.items,
        domainItemsAmount: state.domainItems.itemsAmount,
        priorityPresetId: state.domainItems.selectedPriorityPresetId,
        filterPresetId: state.domainItems.selectedFilterPresetId,
        geoPresetId: state.domainItems.selectedGeoPresetId,
        weights: state.domainItems.weights,
        scenarioId: state.simulation.selectedScenarioId,
        scenarioStepIdx: state.simulation.scenarioCurrentStepIdx,
    }
}

export default connect(mapStateToProps, {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison,
        loadMoreDomainItemsAction: loadMoreDomainItems
})(withTheme(DomainItemsTools));