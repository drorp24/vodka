import React from 'react';
import styled, {withTheme} from 'styled-components';
import { connect } from "react-redux"
import { Button as ButtonSemantic, Search } from 'semantic-ui-react';
import {map, take, getOr, isEmpty} from 'lodash/fp'
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import { 
    toggleCompareDomainItemsMode, 
    clearAllSelectedItemsForComparison,    
    textFilterCleanSearch,
    textFilterStartSearch,
    textFilterFinishSearch,
    textFilterUpdateSelection } from '../redux/actions/actions'

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

export const SearchStyled = styled(Search)`
    .ui.icon.input {
        min-width: 300px;
    }
`

const DomainItemsTools = ({
    clearAllSelectedItemsForComparisonAction, 
    selectedDomainItemsIdsForCmp, 
    compareDomainItemsMode, 
    toggleCompareDomainItemsModeAction,
    textFilterCleanSearchAction,
    textFilterStartSearchAction,
    textFilterFinishSearchAction,
    textFilterUpdateSelectionAction,
    textFilterValue,
    textFilterLoading,
    textFilterItems,
    theme}) => {
        const onCompareClick = () => {
            toggleCompareDomainItemsModeAction()
        }
        const onClearSelectedClick = () => {
            clearAllSelectedItemsForComparisonAction()
        }

        const timeoutRef = React.useRef()
        const handleSearchChange = (e, data) => {
            clearTimeout(timeoutRef.current)
            textFilterStartSearchAction(data.value)
            timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                textFilterCleanSearchAction()
                return
            }
            textFilterFinishSearchAction(data.value)
            }, 300)
        }

        const handleSelection = (e, data) => {
            const term = getOr(data.value, "result.title", data)
            const itemId = getOr(null, "result.key", data)
            textFilterUpdateSelectionAction(itemId, term)
        }
        
        const ref = React.useRef();
        const keyPress = (e) => {
            if(e.charCode === 13 && !isEmpty(textFilterValue)){
                if(ref){
                    ref.current.close()                    
                }
                textFilterUpdateSelectionAction(null, textFilterValue)
            }
        }
        
        const getResults = () => {
            let results = take(10, textFilterItems)
            results = map(domainItem => ({
                key:domainItem.id,
                title: domainItem.name,
                description: domainItem.description
            }), results)
            console.log(`result len: ${results.length}`)
            return results
        }
        
        return (
            <DomainItemsToolsContainer height="40px" alignItems="center" marginLeft="10px" justifyContent="space-between">
                <Div marginRight="10px">
                    <SearchStyled
                        ref={ref}
                        onKeyPress={keyPress}
                        showNoResults={textFilterLoading ? false : true}
                        onResultSelect={handleSelection}
                        onSearchChange={handleSearchChange}                        
                        value={textFilterValue}
                        loading={textFilterLoading}
                        results={getResults()}
                        size="small"/>
                </Div>
                <Div marginRight="10px">
                    <ButtonSemantic color={theme["topbarSliderButton"]} size="small" circular icon={compareDomainItemsMode  ? "log out" : "check"}
                            onClick={onCompareClick}/>
                    {
                        selectedDomainItemsIdsForCmp.length > 0 ? 
                        <ButtonSemantic color={theme["topbarSliderButton"]} size="small" circular onClick={onClearSelectedClick} icon="erase"/> : null
                    }
                </Div>            
            </DomainItemsToolsContainer>
        )
}

const mapStateToProps = state => ({
    compareDomainItemsMode: state.ui.compareDomainItemsMode,
    selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
    textFilterValue: state.domainItems.textFilterValue,
    textFilterLoading: state.domainItems.textFilterLoading,
    textFilterItems: state.domainItems.textFilterItems
})

export default connect(mapStateToProps, 
    {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison,
        textFilterCleanSearchAction: textFilterCleanSearch,
        textFilterStartSearchAction :textFilterStartSearch,
        textFilterFinishSearchAction: textFilterFinishSearch,
        textFilterUpdateSelectionAction: textFilterUpdateSelection
    })(withTheme(DomainItemsTools));