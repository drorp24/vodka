import React from 'react';
import { connect } from "react-redux"
import styled, {withTheme} from 'styled-components';
import {Button, Icon} from 'semantic-ui-react';
import {FlexColumns} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {toggleSideBar, switchTheme} from '../redux/actions/actions'

export const TopBarContainer = styled(FlexColumns)`
    border-bottom: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`;

const TopBar = ({themeId, sideBarOpen, toggleSideBarAction, theme, switchThemeAction}) => {
    return (
        <TopBarContainer minHeight="60px"  alignItems="center">
            <FlexColumns marginLeft="20px" width="40%">
                <Button color={theme["topbarSliderButton"]} circular icon={sideBarOpen ? 'angle double left' : 'angle double right'}
                    onClick={() => toggleSideBarAction()}/>
                <Div marginLeft="20px">
                <Button circular  size="medium" color={theme["themeButtonColor"]} icon onClick={() => switchThemeAction(themeId === "defaultTheme" ? 'darkTheme' : 'defaultTheme')}>
                    <Icon name={themeId === "defaultTheme" ? 'moon' : 'sun'}/>
                </Button>
                </Div>
            </FlexColumns>
        </TopBarContainer>
    )
}

const mapStateToProps = state => ({
    sideBarOpen: state.ui.sideBarOpen,
    themeId: state.ui.themeId
  })

export default connect(mapStateToProps, 
    {toggleSideBarAction: toggleSideBar, switchThemeAction: switchTheme})(withTheme(TopBar));