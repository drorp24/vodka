import React from 'react';
import { connect } from "react-redux"
import {Popup, Button} from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import { toggleCompareDomainItemsMode, clearAllSelectedItemsForComparison } from '../redux/actions/actions'
import ChoosePresets from './ChoosePresets'
import translate from "../i18n/translate"
import LOCALES from "../i18n/locales"

export const DomainItemsToolsContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

export const DropdownContainer = styled(FlexColumns)`
    border-color: ${({ theme }) => `${theme["borderColor"]}`};
    border-width: ${({ locale }) => locale === LOCALES.HEBREW ? "0px 0px 0px 1px" : "0px 1px 0px 0px"};
    border-style: solid
`;

const DomainItemsTools = ({selectedDomainItemsIdsForCmp, compareDomainItemsMode,
    toggleCompareDomainItemsModeAction, clearAllSelectedItemsForComparisonAction, theme, locale}) => {
    
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

    return (
        <DomainItemsToolsContainer alignItems="center" justifyContent="space-between">
            <DropdownContainer locale={locale} margin="0px 10px" minHeight="40px" alignItems="center" flexBasis="70%" justifyContent="space-between">                
                <Popup
                    open={choosePresetIsOpen}
                    position="bottom left"
                    on='click'
                    basic
                    flowing
                    trigger={<Button onClick={() => setChoosePresetIsOpen(!choosePresetIsOpen)}  basic color={theme["secondaryButtonColor"]} content={translate("choose_presets", true)}/>}>
                        <ChoosePresets close={onCloseReq}/>
                </Popup>                
            </DropdownContainer>
            <Div margin="0px 20px">
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
        compareDomainItemsMode: state.ui.compareDomainItemsMode,
        selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
        locale: state.ui.locale
    }
}

export default connect(mapStateToProps, {
        toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode,
        clearAllSelectedItemsForComparisonAction: clearAllSelectedItemsForComparison        
})(withTheme(DomainItemsTools));