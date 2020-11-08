import React from 'react';
import { connect } from "react-redux"
import styled, {withTheme} from 'styled-components';
import {Button, Icon, Popup, Dropdown} from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {toggleSideBar, switchTheme, toggleCreateScenario} from '../redux/actions/actions'
import Scenarios from './Scenarios'
import ScenarioPlayer from './ScenarioPlayer'
import DomainItemsSearch from './DomainItemsSearch'
import CreateScenarioForm from './CreateScenarioForm'

export const TopBarContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const TopBar = ({themeId, sideBarOpen, createScenarioOpen, toggleSideBarAction, theme, switchThemeAction, compareDomainItemsMode, toggleCreateScenarioAction}) => {
    return (
        <TopBarContainer minHeight="60px" alignItems="center" marginLeft="20px" width="100%" position="relative">
            <FlexColumns alignItems="center" justifyContent="space-between" width="100%">
                <FlexColumns alignItems="center">
                    <FlexColumns  marginRight="30px">
                        <Dropdown
                            icon='list'
                            className='icon'
                            button
                            style={{"background":`${theme["iconButtonColor"]}`, "color": `${theme["iconButtonColorIcon"]}`}}>
                            <Dropdown.Menu>
                            <Dropdown.Header  content='Create' />
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='film' text='Scenario' onClick={()=>{toggleCreateScenarioAction()}}/>
                            <Dropdown.Item icon='filter' text='Rules Preset' />
                            </Dropdown.Menu>
                        </Dropdown>
                    </FlexColumns>
                    <Button disabled={compareDomainItemsMode ? true : false} color={theme["topbarSliderButton"]} circular icon={sideBarOpen ? 'angle double left' : 'angle double right'}
                            onClick={() => toggleSideBarAction()}/>
                    <Div marginLeft="20px">
                        <Button circular  size="medium" color={theme["iconButtonColor"]} icon onClick={() => switchThemeAction(themeId === "defaultTheme" ? 'darkTheme' : 'defaultTheme')}>
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
                {createScenarioOpen && <CreateScenarioForm/>}
            </FlexColumns>
            <DomainItemsSearch/>
        </TopBarContainer>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen,
    createScenarioOpen: state.ui.createScenarioOpen,
    themeId: state.ui.themeId,
    compareDomainItemsMode: state.ui.compareDomainItemsMode
  })

export default connect(mapStateToProps, 
    {
        toggleSideBarAction: toggleSideBar, 
        switchThemeAction: switchTheme,
        toggleCreateScenarioAction: toggleCreateScenario
    })(withTheme(TopBar));