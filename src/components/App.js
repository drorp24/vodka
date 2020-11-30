import React from 'react';
import { ThemeProvider } from 'styled-components';
import {IntlProvider} from "react-intl"
import { Sidebar } from 'semantic-ui-react'
import { connect } from "react-redux"
import * as defaultTheme from './common/themes/defaultTheme'
import * as darkTheme from './common/themes/darkTheme'
import DomainItems from './DomainItems'
import { FlexColumns, FlexRows } from "./common/CommonComponents"
import { Div } from "./common/StyledElements"
import TopBar from './TopBar';
import SideBar from './SideBar'
import Map from './Map'
import CompareDomainItems from './CompareDomainItems'
import LOCALES from "../i18n/locales"
import dictionaries from "../i18n/dictionaries"

const themes = {
  defaultTheme,
  darkTheme
}

const selectedLocale = LOCALES.HEBREW

function App({themeId, compareDomainItemsMode}) {
  return (
    <IntlProvider messages={dictionaries[selectedLocale]}>
      <ThemeProvider theme={themes[themeId]}>
        <FlexRows height="100%" themedbackgroundcolor="windowBackground">
          <TopBar/> 
          <FlexColumns height="100%">
            <Sidebar.Pushable as={Div} width="100%" height="100%">
              <SideBar/>
              <Sidebar.Pusher>
                {compareDomainItemsMode ? <CompareDomainItems/> : <Map/>}
              </Sidebar.Pusher>
            </Sidebar.Pushable>
            <Div width="40%">
              <DomainItems/>
            </Div>          
          </FlexColumns>
        </FlexRows>      
      </ThemeProvider>
    </IntlProvider>
    );
}

const mapStateToProps = state => ({  
  themeId: state.ui.themeId,
  compareDomainItemsMode: state.ui.compareDomainItemsMode
})

export default connect(mapStateToProps)(App);