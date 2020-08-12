import React from 'react';
import { connect } from "react-redux"
import {Button} from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import {Label, Div} from './common/StyledElements';
import {toggleSideBar} from '../redux/actions/actions'

const TopBar = ({sideBarOpen, toggleSideBarAction}) => {
    return (
        <FlexColumns minHeight="60px"  alignItems="center" >   
            <Div marginLeft="20px" width="40%">
                <Button circular color="black" icon={sideBarOpen ? 'angle double left' : 'angle double right'}
                    onClick={() => toggleSideBarAction()}/>
            </Div>            
            <Label styleType="l1">Top bar here</Label>
        </FlexColumns>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen
  })

export default connect(mapStateToProps, {toggleSideBarAction: toggleSideBar})(TopBar);