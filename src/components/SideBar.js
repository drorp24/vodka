import React from 'react';
import {map, sortBy, flow} from 'lodash/fp'
import { connect } from "react-redux"	
import {Sidebar} from 'semantic-ui-react'
import {Div} from "./common/StyledElements"
import Weights from './Weights'	
import {FlexRows} from './common/CommonComponents';	
import LOCALES from "../i18n/locales"	
import WeightType from "../types/weightType"
import {dynamicAttrFilterUpdate} from "../redux/actions/actions"
import translate from "../i18n/translate"

const SideBar =  ({sideBarOpen, locale, dynamicAttrFilter, dynamicAttrFilterUpdateAction}) => {
  const handleDynamicAttrUpdate = (key, value) => {
    dynamicAttrFilterUpdateAction({key, value})
  }

  return (	
    <Sidebar backgroundColor="transparent" style={{backgroundColor: "transparent"}} direction={locale === LOCALES.HEBREW ? "left" : "right"} visible={sideBarOpen} animation='overlay' as={Div} vertical width="thin">
      <FlexRows padding="10px 5px" height="100%" width="100%" themedbackgroundcolor="sidebarBackground">      
      <Weights header={translate("attr_filters", true)} close={() => {}} handleWeightUpdate={handleDynamicAttrUpdate} weights={
        flow([
          map((dynamicAttr)=> new WeightType(dynamicAttr.key, dynamicAttr.value, 0, 100)),
          sortBy(["key"])
        ])(dynamicAttrFilter)
        }/>
      </FlexRows>	
    </Sidebar>	
  )	
}	

const mapStateToProps = state => ({	
    sideBarOpen: state.ui.sideBarOpen,	
    locale: state.ui.locale,
    dynamicAttrFilter: state.domainItems.dynamicAttrFilter
})	

export default connect(mapStateToProps, {dynamicAttrFilterUpdateAction: dynamicAttrFilterUpdate})(SideBar);