import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import {IntlProvider} from "react-intl"
import { connect } from "react-redux"
import styled from 'styled-components';
import * as defaultTheme from './common/themes/defaultTheme'
import * as darkTheme from './common/themes/darkTheme'
import DomainItems from './DomainItems'
import { FlexColumns, FlexRows } from "./common/CommonComponents"
import { Div } from "./common/StyledElements"
import TopBar from './TopBar';
import Map from './Map'
import CompareDomainItems from './CompareDomainItems'
import dictionaries from "../i18n/dictionaries"
import LOCALES from "../i18n/locales"
import Login from './Login'
import ProtectedRoute from './common/ProtectedRoute'

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
        <BrowserRouter>
          <AppContainer height="100%" themedbackgroundcolor="windowBackground" locale={locale}>
            <Switch>
              <ProtectedRoute exact path="/">
                <TopBar/> 
                <FlexColumns height="100%">            
                  <Div width="40%">
                    <DomainItems/>
                  </Div>
                  <Div  width="100%" height="100%">
                    {compareDomainItemsMode ? <CompareDomainItems/> : <Map/>}
                  </Div>
                </FlexColumns>
              </ProtectedRoute>
              <Route path="/login">
                <Login />
              </Route>
            </Switch>
          </AppContainer>
        </BrowserRouter>   
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