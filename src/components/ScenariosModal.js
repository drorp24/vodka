import React from 'react';
import {Modal, Button} from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import Scenarios from './Scenarios'
import translate from '../i18n/translate'
import {FlexRows} from './common/CommonComponents';

const ScenariosModal = ({open, closeCB, theme}) => {
    
    return (
        <Modal
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
                <Modal.Actions>
                    <Button color={theme["createButtonColor"]} onClick={closeCB}>
                        {translate("close", true)}
                    </Button>
                </Modal.Actions>      
        </Modal>
    )
}

export default withTheme(ScenariosModal)