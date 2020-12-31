import React from 'react';
import { connect } from "react-redux"
import {Popup, Button} from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import {map, isEmpty, set, isNil} from 'lodash/fp'
import {FlexColumns, FlexRows} from './common/CommonComponents';
import { toggleCompareDomainItemsMode, clearAllSelectedItemsForComparison, loadMoreDomainItems, loadWeights, weightUpdated, updateScenariosSelection } from '../redux/actions/actions'
import ChoosePresets from './ChoosePresets'
import translate from "../i18n/translate"
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'
import AsyncRestParams from '../types/asyncRestParams';
import DomainItemsSearch from './DomainItemsSearch'
import Weights from './Weights'
import LOCALES from "../i18n/locales"

const DomainItemsTools = ({selectedDomainItemsIdsForCmp, compareDomainItemsMode, updateScenariosSelectionAction,
    toggleCompareDomainItemsModeAction, clearAllSelectedItemsForComparisonAction, theme, locale, loadingItems,
    domainItems, scenarioId, scenarioStepIdx, weights, priorityPresetId, filterPresetId, geoPresetId, loadMoreDomainItemsAction, domainItemsAmount, loadWeightsAction, weightUpdatedAction}) => {

    React.useEffect(() => {
        if (isEmpty(weights) || weights.length < 1)
            loadWeightsAction(new AsyncRestParams("/config/weights", "GET"))
    })
    
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
    
    const handleWeightUpdate = (key, value) => {    
        const actualWeights = map((weight) => {
          if(key !== weight.key) return weight
          return set('value', value, weight)
        }, weights)
        const ids = map((domainItem)=> domainItem.id, domainItems)
        const loadItemsRequestBody = getLoadItemsRequestBody({
          priorityPresetId: priorityPresetId,
          filterPresetId: filterPresetId,
          geoPresetId: geoPresetId,
          weights: actualWeights, 
          scenarioId: scenarioId,
          scenarioStepIdx: scenarioStepIdx, 
          ids})
        weightUpdatedAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody, actualWeights)
    }

    const noScorePresetChoosen = isNil(priorityPresetId)

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
                        <Weights header={translate("set_weights", true)} width="10vw" disabled={loadingItems || noScorePresetChoosen} close={onCloseWeightsReq} weights={weights} handleWeightUpdate={handleWeightUpdate}/>
                </Popup>
            </FlexColumns>            
            <FlexColumns alignItems="center" justifyContent="space-between">                
                <FlexColumns locale={locale} margin="0px 10px" height="40px" alignItems="center" flexBasis="75%">
                    <Popup
                        open={choosePresetIsOpen}
                        position={`bottom ${locale === LOCALES.HEBREW ? "right" : "left"}`}
                        on='click'                        
                        flowing
                        trigger={<Button basic={!choosePresetIsOpen} onClick={() => setChoosePresetIsOpen(!choosePresetIsOpen)} color={theme["secondaryButtonColor"]} content={translate("choose_presets", true)} style={{padding: '0.5rem'}}/>}>
                            <ChoosePresets close={onCloseReq}/>
                    </Popup>
                    <Button disabled={!priorityPresetId} onClick={()=>updateScenariosSelectionAction(true)}  basic color={theme["secondaryButtonColor"]}  style={{padding: '0.5rem'}}>
                        {translate("selectScenario", true)}
                    </Button>
                    <Button disabled={domainItemsAmount < 1} onClick={handleLoadMore}  basic color={theme["secondaryButtonColor"]}  style={{padding: '0.5rem'}}>
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
        loadingItems: state.domainItems.loadingItems
    }
}

export default connect(mapStateToProps, {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison,
        loadMoreDomainItemsAction: loadMoreDomainItems,
        loadWeightsAction: loadWeights,
        weightUpdatedAction: weightUpdated,
        updateScenariosSelectionAction: updateScenariosSelection
})(withTheme(DomainItemsTools));