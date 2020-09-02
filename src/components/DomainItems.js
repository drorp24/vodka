import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux"
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import {FlexRows} from './common/CommonComponents';
import DomainItem from './DomainItem'

const StyledFlexRowsContainer = styled(FlexRows)`
*,*:focus,*:hover{
    outline:none;
}
border-left: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
border-right: ${({ theme }) => `1px solid ${theme["borderColor"]}`};
`

const DomainItems = ({domainItems}) => {
    const rowRenderer = ({index, isScrolling, key, style}) => {
        const domainItem = domainItems[index]
        return <DomainItem key={domainItem.id} domainItem={domainItem}/>
    }
    return (
            <StyledFlexRowsContainer height="100%" width="100%">
                <AutoSizer>
                    {({width, height}) => (
                    <List
                        height={height}
                        rowCount={domainItems.length}
                        rowHeight={60}
                        rowRenderer={rowRenderer}
                        width={width}
                    />
                    )}
                </AutoSizer>
            </StyledFlexRowsContainer>
        )
}

const mapStateToProps = state => ({
    domainItems: state.domainItems.items
})

export default connect(mapStateToProps, {})(DomainItems);