import React from 'react';
import { connect } from "react-redux"
import {Button} from 'semantic-ui-react';
import styled from 'styled-components';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {toggleSideBar} from '../redux/actions/actions'

export const TopBarContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const TopBar = ({sideBarOpen, toggleSideBarAction}) => {
    return (
        <TopBarContainer minHeight="60px"  alignItems="center">
            <Div marginLeft="20px" width="40%">
                <Button circular color="black" icon={sideBarOpen ? 'angle double left' : 'angle double right'}
                    onClick={() => toggleSideBarAction()}/>
            </Div>
        </TopBarContainer>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen
  })

export default connect(mapStateToProps, {toggleSideBarAction: toggleSideBar})(TopBar);