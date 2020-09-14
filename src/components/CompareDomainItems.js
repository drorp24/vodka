import React from 'react';
import { connect } from "react-redux"
import { Button as ButtonSemantic } from 'semantic-ui-react';
import Radar from 'react-d3-radar';
import {filter, map, set, startCase} from 'lodash/fp'
import {COMPARE_DOMAIN_ITMES_SELECT, COMPARE_DOMAIN_ITMES_VIEW} from '../types/compareDomainItemsEnum';
import {FlexRows} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import { toggleCompareDomainItemsMode } from '../redux/actions/actions'

const CompareDomainItems = ({compareDomainItemsMode, selectedDomainItemsIdsForCmp, toggleCompareDomainItemsModeAction, domainItems}) => {

    const handleCompareClicked = () => {
        toggleCompareDomainItemsModeAction(COMPARE_DOMAIN_ITMES_VIEW)
    }
    
    const renderSelect = () => {
        const cmpPossible = selectedDomainItemsIdsForCmp.length > 1 && selectedDomainItemsIdsForCmp.length < 4
        return (
            <FlexRows alignItems="center" justifyContent="center" width="100%" height="calc(100vh - 60px)">
                <Div styleType="label1" marginBottom="20px">
                {selectedDomainItemsIdsForCmp.length > 0 ? `${selectedDomainItemsIdsForCmp.length} items selected for comparison` : "Please select between 2 - 3 items to compare"}
                </Div>
                <ButtonSemantic disabled={!cmpPossible} onClick={handleCompareClicked} color="green">Compare</ButtonSemantic>
            </FlexRows>
        )
    }

    const renderView = () => {
        const selectedDomainItems = filter((domainItem) => selectedDomainItemsIdsForCmp.indexOf(domainItem.id) !== -1, domainItems)        
        let variables = []
        const sets = []
        for (let index = 0; index < selectedDomainItems.length; index++) {
            const domainItem = selectedDomainItems[index];
            if(variables.length < 1){
                variables = map((weightedAttribute) => ({key: weightedAttribute.key, label: startCase(weightedAttribute.key) }), domainItem.weightedAttributes)
            }
            let values = {}
            for (let innerIndex = 0; innerIndex < domainItem.weightedAttributes.length; innerIndex++) {
                const weightedAttribute = domainItem.weightedAttributes[innerIndex]
                values = set(weightedAttribute.key, weightedAttribute.value, values)
            }            
            const setX = {
                key: domainItem.id,
                label: domainItem.name,
                values
            }
            sets.push(setX)            
        }
        
        return (
            <FlexRows alignItems="center" justifyContent="center" width="100%" height="calc(100vh - 60px)">
                <Radar
                    color="white"
                    width={500}
                    height={500}
                    padding={70}
                    domainMax={10}
                    highlighted={null}
                    data={{
                    variables,
                    sets                  
                    }}/>
            </FlexRows>
        )
    }
    if(compareDomainItemsMode === COMPARE_DOMAIN_ITMES_SELECT){
        return renderSelect()
    }
    else if(compareDomainItemsMode === COMPARE_DOMAIN_ITMES_VIEW){
        return renderView()
    }
    return null
}

const mapStateToProps = state => ({
    compareDomainItemsMode: state.ui.compareDomainItemsMode,
    selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
    domainItems: state.domainItems.items
})

export default connect(mapStateToProps, {toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode})(CompareDomainItems);