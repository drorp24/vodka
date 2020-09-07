import React from 'react';
import { connect } from "react-redux"
import styled, {withTheme} from 'styled-components';
import {Button} from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {toggleSideBar, switchTheme} from '../redux/actions/actions'

export const TopBarContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const TopBar = ({sideBarOpen, toggleSideBarAction, theme, switchThemeAction}) => {
    return (
        <TopBarContainer minHeight="60px"  alignItems="center">
            <FlexColumns marginLeft="20px" width="40%">
                <Button color={theme["topbarSliderButton"]} circular icon={sideBarOpen ? 'angle double left' : 'angle double right'}
                    onClick={() => toggleSideBarAction()}/>
                <Div marginLeft="20px">
                    <Button.Group>
                        <Button onClick={() => switchThemeAction("defaultTheme")} color="olive">light</Button>
                        <Button.Or/>
                        <Button onClick={() => switchThemeAction("darkTheme")} color="olive">dark</Button>
                    </Button.Group>
                </Div>
            </FlexColumns>
        </TopBarContainer>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen,
  })

export default connect(mapStateToProps, 
    {toggleSideBarAction: toggleSideBar, switchThemeAction: switchTheme})(withTheme(TopBar));