import React from 'react';
import { connect } from "react-redux"
import {Popup, Button} from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import {map} from 'lodash/fp'
import {FlexColumns, FlexRows} from './common/CommonComponents';
import { toggleCompareDomainItemsMode, clearAllSelectedItemsForComparison, loadMoreDomainItems } from '../redux/actions/actions'
import ChoosePresets from './ChoosePresets'
import translate from "../i18n/translate"
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'
import AsyncRestParams from '../types/asyncRestParams';
import DomainItemsSearch from './DomainItemsSearch'
import Weights from './Weights'
import LOCALES from "../i18n/locales"

const DomainItemsTools = ({selectedDomainItemsIdsForCmp, compareDomainItemsMode,
    toggleCompareDomainItemsModeAction, clearAllSelectedItemsForComparisonAction, theme, locale,
    domainItems, scenarioId, scenarioStepIdx, weights, priorityPresetId, filterPresetId, geoPresetId, loadMoreDomainItemsAction, domainItemsAmount}) => {
    
    const [choosePresetIsOpen, setChoosePresetIsOpen] = React.useState(false)
    const [weightsIsOpen, setWeightsIsOpen] = React.useState(false)
    const onCompareClick = () => {
        toggleCompareDomainItemsModeAction()
    }
    const onClearSelectedClick = () => {
        clearAllSelectedItemsForComparisonAction()
    }

    const onCloseReq = () => {
        setChoosePresetIsOpen(false)
    }

    const onCloseWeightsReq = () => {
        setWeightsIsOpen(false)
    }

    const handleLoadMore = () => {
        const ids = map((domainItem)=> domainItem.id, domainItems)
        const loadItemsRequestBody = getLoadItemsRequestBody({amount: domainItemsAmount + 10, priorityPresetId, filterPresetId, geoPresetId, weights, scenarioId, scenarioStepIdx, ids})
        loadMoreDomainItemsAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody, weights)
    }    
    return (
        <FlexRows>
            <FlexColumns width="100%" alignItems="center" justifyContent="space-around">
                <DomainItemsSearch/>
                <Popup                    
                    open={weightsIsOpen}
                    position="bottom center"
                    on='click'
                    basic
                    flowing
                    trigger={<Button style={{margin: "0px 5px"}} basic={!weightsIsOpen} color={theme["topbarSliderButton"]} size="small" circular icon="options" onClick={() => setWeightsIsOpen(!weightsIsOpen)}/>}>
                        <Weights close={onCloseWeightsReq}/>
                </Popup>
            </FlexColumns>            
            <FlexColumns alignItems="center" justifyContent="space-between">                
                <FlexColumns locale={locale} margin="0px 10px" height="40px" alignItems="center" flexBasis="75%">
                    <Popup
                        open={choosePresetIsOpen}
                        position={`bottom ${locale === LOCALES.HEBREW ? "right" : "left"}`}
                        on='click'
                        basic
                        flowing
                        trigger={<Button onClick={() => setChoosePresetIsOpen(!choosePresetIsOpen)} basic color={theme["secondaryButtonColor"]} content={translate("choose_presets", true)}/>}>
                            <ChoosePresets close={onCloseReq}/>
                    </Popup>
                    <Button disabled={domainItemsAmount < 1} onClick={handleLoadMore}  basic color={theme["secondaryButtonColor"]}>
                        {domainItemsAmount} {translate("items", true)}, {translate("load_more", true)}
                    </Button>
                </FlexColumns>
                <FlexColumns margin="0px 10px">
                    <Button basic={!compareDomainItemsMode} color={theme["topbarSliderButton"]} size="small" circular icon={compareDomainItemsMode  ? "log out" : "check"}
                            onClick={onCompareClick}/>
                    {
                        selectedDomainItemsIdsForCmp.length > 0 ? 
                        <Button color={theme["topbarSliderButton"]} size="small" circular onClick={onClearSelectedClick} icon="erase"/> : null
                    }
                </FlexColumns>
            </FlexColumns>
        </FlexRows>        
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