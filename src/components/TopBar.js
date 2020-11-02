import React from 'react';
import { connect } from "react-redux"
import styled, {withTheme} from 'styled-components';
import {Button, Icon, Popup} from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {toggleSideBar, switchTheme} from '../redux/actions/actions'
import Scenarios from './Scenarios'
import ScenarioPlayer from './ScenarioPlayer'
import DomainItemsTools from './DomainItemsTools'

export const TopBarContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const TopBar = ({themeId, sideBarOpen, toggleSideBarAction, theme, switchThemeAction, compareDomainItemsMode}) => {
    return (
        <TopBarContainer minHeight="60px" alignItems="center" marginLeft="20px" width="100%" position="relative">
            <FlexColumns alignItems="center" justifyContent="space-between" width="100%">
                <FlexColumns>
                    <Button disabled={compareDomainItemsMode ? true : false} color={theme["topbarSliderButton"]} circular icon={sideBarOpen ? 'angle double left' : 'angle double right'}
                            onClick={() => toggleSideBarAction()}/>
                    <Div marginLeft="20px">
                        <Button circular  size="medium" color={theme["changeThemeButtonColor"]} icon onClick={() => switchThemeAction(themeId === "defaultTheme" ? 'darkTheme' : 'defaultTheme')}>
                            <Icon name={themeId === "defaultTheme" ? 'moon' : 'sun'}/>
                        </Button>
                    </Div>
                    <Div marginLeft="20px" position="relative">
                        <Popup
                            style={{"overflow": "auto"}}
                            position="bottom left"
                            on='click'
                            basic
                            flowing
                            trigger={<Button color={theme["topbarSliderButton"]} circular icon='file'/>}>
                                <Scenarios/>
                        </Popup>                    
                    </Div>
                </FlexColumns>
                <Div marginLeft="20px" marginRight="20px">
                    <ScenarioPlayer/>
                </Div>
            </FlexColumns>
            <DomainItemsTools/>
        </TopBarContainer>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen,
    themeId: state.ui.themeId,
    compareDomainItemsMode: state.ui.compareDomainItemsMode
  })

export default connect(mapStateToProps, 
    {toggleSideBarAction: toggleSideBar, switchThemeAction: switchTheme})(withTheme(TopBar));