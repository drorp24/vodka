import React from 'react';
import styled, {withTheme} from 'styled-components';
import { connect } from "react-redux"
import { Button as ButtonSemantic } from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import { toggleCompareDomainItemsMode, clearAllSelectedItemsForComparison } from '../redux/actions/actions'

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const DomainItemsTools = ({clearAllSelectedItemsForComparisonAction, selectedDomainItemsIdsForCmp, compareDomainItemsMode, toggleCompareDomainItemsModeAction, theme}) => {
    const onCompareClick = () => {
        toggleCompareDomainItemsModeAction()
    }
    const onClearSelectedClick = () => {
        clearAllSelectedItemsForComparisonAction()
    }

    return (
        <DomainItemsToolsContainer height="40px" alignItems="center" marginLeft="10px">
            <ButtonSemantic onClick={onCompareClick} size="small" color={theme["compareDomainItemsButtonColor"]}>
                {
                    compareDomainItemsMode  ? "Exit" : "Compare"
                }
            </ButtonSemantic>
            {
                selectedDomainItemsIdsForCmp.length > 0 ? 
                <ButtonSemantic  onClick={onClearSelectedClick} size="small" color={theme["compareDomainItemsButtonColor"]}>
                    Clear Selected
                </ButtonSemantic> : null
            }
        </DomainItemsToolsContainer>
    )
}

const mapStateToProps = state => ({
    compareDomainItemsMode: state.ui.compareDomainItemsMode,
    selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp
})

export default connect(mapStateToProps, 
    {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison
    })(withTheme(DomainItemsTools));