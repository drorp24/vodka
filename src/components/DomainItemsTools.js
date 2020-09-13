import React from 'react';
import styled, {withTheme} from 'styled-components';
import { connect } from "react-redux"
import { Button as ButtonSemantic } from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import { toggleCompareDomainItemsMode } from '../redux/actions/actions'
import {COMPARE_DOMAIN_ITMES_OFF, COMPARE_DOMAIN_ITMES_SELECT} from '../types/compareDomainItemsEnum';

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const DomainItemsTools = ({compareDomainItemsMode, toggleCompareDomainItemsModeAction, theme}) => {
    const onCompareClick = () => {
        const requiredCompareDomainItemsMode = compareDomainItemsMode === COMPARE_DOMAIN_ITMES_OFF ? COMPARE_DOMAIN_ITMES_SELECT : COMPARE_DOMAIN_ITMES_OFF
        toggleCompareDomainItemsModeAction(requiredCompareDomainItemsMode)
    }

    return (
        <DomainItemsToolsContainer height="40px" alignItems="center" marginLeft="10px">
            <ButtonSemantic onClick={onCompareClick} size="small" color={theme["compareDomainItemsButtonColor"]}>
                {
                    compareDomainItemsMode === COMPARE_DOMAIN_ITMES_OFF ? "Compare" : "Exit"
                }
            </ButtonSemantic>
        </DomainItemsToolsContainer>
    )
}

const mapStateToProps = state => ({
    compareDomainItemsMode: state.ui.compareDomainItemsMode
})

export default connect(mapStateToProps, {toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode})(withTheme(DomainItemsTools));