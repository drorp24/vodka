import React from 'react';
import { connect } from "react-redux"
import styled, {withTheme} from 'styled-components';
import {Button, Dropdown} from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {toggleSideBar, switchTheme, toggleCreateScenario, selectLocale} from '../redux/actions/actions'
import ScenarioPlayer from './ScenarioPlayer'
import CreateScenarioForm from './CreateScenarioForm'
import ScenariosModal from './ScenariosModal'
import translate from '../i18n/translate'
import LOCALES from "../i18n/locales"
import { logout } from '../redux/reducers/usersReducer';

export const TopBarContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
    background-color: ${({ theme }) => theme["topbarBackground"]};    
`;

const TopBar = ({sideBarOpen, createScenarioOpen, toggleSideBarAction, theme, 
                switchThemeAction, compareDomainItemsMode, toggleCreateScenarioAction, selectLocaleAction, locale}) => {
    const [scenariosIsOpen, setScenariosIsOpen] = React.useState(false)
    const dispatch = useDispatch();
    
    const handleLogout = () => {
        dispatch(logout());
      };

    const itemByLocaleStyle = {"text-align": locale === LOCALES.HEBREW ? "right" : "left"}
    return (
        <TopBarContainer minHeight="60px" alignItems="center"  width="100%" position="relative" justifyContent="space-between">
            <Div  margin="0px 10px">
                    <Dropdown
                        direction={locale === LOCALES.HEBREW ? "left" : "right"}
                        icon='list'
                        className='icon'
                        button
                        style={{"background":`${theme["iconButtonColor"]}`, "color": `${theme["iconButtonColorIcon"]}`}}>
                        <Dropdown.Menu direction={locale === LOCALES.HEBREW ? "left" : "right"}>
                            <Dropdown.Header  content={translate("create", true)}/>
                            <Dropdown.Divider/>                            
                            <Dropdown.Item style={itemByLocaleStyle} icon='filter' text={translate("rules_preset", true)}/>
                            <Dropdown.Header  content={translate("open", true)} />
                            <Dropdown.Divider/>
                            <Dropdown.Item style={itemByLocaleStyle} text={translate("scenarios", true)} onClick={()=>setScenariosIsOpen(true)} icon="film"/>
                            <Dropdown.Header  content={translate("simulation", true)} />
                            <Dropdown.Divider/>
                            <Dropdown.Item style={itemByLocaleStyle} icon='film' text={translate("create_scenario", true)} onClick={()=>{toggleCreateScenarioAction()}}/>
                            <Dropdown.Header  content={translate("settings", true)} />
                            <Dropdown.Divider/>
                            <Dropdown.Item style={itemByLocaleStyle}>
                                <Dropdown text={translate("language", true)} style={{width: "100%"}}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item  text={translate("hebrew", true)} onClick={()=>{selectLocaleAction(LOCALES.HEBREW)}}/>
                                        <Dropdown.Item  text={translate("english", true)} onClick={()=>{selectLocaleAction(LOCALES.ENGLISH)}}/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Dropdown.Item>
                            <Dropdown.Item style={itemByLocaleStyle}>
                                <Dropdown text={translate("theme", true)} style={{width: "100%"}}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item text={translate("dark", true)} onClick={() => switchThemeAction('darkTheme')}/>
                                        <Dropdown.Item text={translate("white", true)} onClick={() => switchThemeAction('defaultTheme')}/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item style={itemByLocaleStyle} icon='power' text={translate("logout", true)} onClick={handleLogout}/>
                        </Dropdown.Menu>
                    </Dropdown>
            </Div>            
            <FlexColumns>
                <ScenarioPlayer/>
                <Div margin="0px 10px">
                    <Button disabled={compareDomainItemsMode ? true : false} color={theme["topbarSliderButton"]} circular icon={sideBarOpen ? `angle double ${locale === LOCALES.HEBREW ? 'left' : 'right'}` : `angle double ${locale === LOCALES.HEBREW ? 'right' : 'left'}`}
                            onClick={() => toggleSideBarAction()}/>
                </Div>
            </FlexColumns>
            {/* <Logout /> */}
            {createScenarioOpen && <CreateScenarioForm/>}
            <ScenariosModal open={scenariosIsOpen} closeCB={()=>setScenariosIsOpen(false)}/>
            
        </TopBarContainer>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen,
    createScenarioOpen: state.ui.createScenarioOpen,
    locale: state.ui.locale,
    compareDomainItemsMode: state.ui.compareDomainItemsMode
  })

export default connect(mapStateToProps, 
    {
        toggleSideBarAction: toggleSideBar, 
        switchThemeAction: switchTheme,
        toggleCreateScenarioAction: toggleCreateScenario,
        selectLocaleAction: selectLocale
    })(withTheme(TopBar));