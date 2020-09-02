import React from 'react';
import { connect } from "react-redux"
import {Sidebar} from 'semantic-ui-react'
import {Div} from "./common/StyledElements"
import Weights from './Weights'
import {FlexRows} from './common/CommonComponents';

const SideBar =  ({sideBarOpen}) => {
    return (
      <Sidebar visible={sideBarOpen} animation='push' as={Div} vertical width="wide">
        <FlexRows padding="10px 5px" height="100%" width="100%" themedbackgroundcolor="windowBackground">
          <Weights/>
        </FlexRows>
      </Sidebar>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen
})

export default connect(mapStateToProps)(SideBar);