import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import {IntlProvider} from "react-intl"
import { Sidebar } from 'semantic-ui-react'
import { connect } from "react-redux"
import styled from 'styled-components';
import * as defaultTheme from './common/themes/defaultTheme'
import * as darkTheme from './common/themes/darkTheme'
import DomainItems from './DomainItems'
import { FlexColumns, FlexRows } from "./common/CommonComponents"
import { Div } from "./common/StyledElements"
import TopBar from './TopBar';
import SideBar from './SideBar'
import Map from './Map'
import CompareDomainItems from './CompareDomainItems'
import dictionaries from "../i18n/dictionaries"
import LOCALES from "../i18n/locales"
import Login from './Login'
import PrivateRoute from './common/PrivateRoute'

const themes = {
  defaultTheme,
  darkTheme
}

const AppContainer = styled(FlexRows)`
  direction: ${({locale}) => locale === LOCALES.HEBREW ? "rtl" : "ltr"};
  .ui * {
    direction: ${({locale}) => locale === LOCALES.HEBREW ? "rtl" : "ltr"};
    text-align: ${({locale}) => locale === LOCALES.HEBREW ? "right" : "left"};
  }
`

function App({themeId, compareDomainItemsMode, locale}) {
  return (
    <IntlProvider messages={dictionaries[locale]} locale={locale}>
      <ThemeProvider theme={themes[themeId]}>
        <AppContainer height="100%" themedbackgroundcolor="windowBackground" locale={locale}>
          <BrowserRouter>
            <Switch>
              <PrivateRoute path="/simulator">
                <TopBar/> 
                <FlexColumns height="100%">            
                  <Div width="40%">
                    <DomainItems/>
                  </Div>
                  <Sidebar.Pushable as={Div} width="100%" height="100%">
                    <SideBar/>
                    <Sidebar.Pusher>
                      {compareDomainItemsMode ? <CompareDomainItems/> : <Map/>}
                    </Sidebar.Pusher>
                  </Sidebar.Pushable>
                </FlexColumns>
              </PrivateRoute>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </BrowserRouter>   
        </AppContainer>
      </ThemeProvider>
    </IntlProvider>

    );
}

const mapStateToProps = state => ({  
  themeId: state.ui.themeId,
  compareDomainItemsMode: state.ui.compareDomainItemsMode,
  locale: state.ui.locale
})

export default connect(mapStateToProps)(App);