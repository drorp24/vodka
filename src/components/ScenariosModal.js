import React from 'react';
import { connect } from "react-redux"
import {Modal, Button} from 'semantic-ui-react';
import styled, {withTheme} from 'styled-components';
import Scenarios from './Scenarios'
import translate from '../i18n/translate'
import {FlexRows} from './common/CommonComponents';
import LOCALES from "../i18n/locales"

const StyledModalActions = styled(Modal.Actions)`
&.actions { 
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}`

const ScenariosModal = ({open, closeCB, theme, locale}) => {    
    return (
        <Modal 
            style={{"direction": locale === LOCALES.HEBREW ? "rtl" : "ltr"}}
            size="small"
            open={open}
            dimmer="blurring">
                <Modal.Header>
                    <FlexRows alignItems="center">
                        {translate("scenarios", true)}
                    </FlexRows>                    
                </Modal.Header>
                <Modal.Content scrolling>
                    <Scenarios closeCB={closeCB}/>
                </Modal.Content>
                <StyledModalActions>
                    <Button color={theme["primaryButtonColor"]} onClick={closeCB}>
                        {translate("close", true)}
                    </Button>
                </StyledModalActions>
        </Modal>
    )
}

const mapStateToProps = state => ({
    locale: state.ui.locale
  })

export default connect(mapStateToProps)(withTheme(ScenariosModal));