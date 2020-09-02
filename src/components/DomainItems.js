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

class DomainItems extends React.Component {

    constructor(props){
        super(props)
        this.listRef = React.createRef();
    }

    rowRenderer = ({index, isScrolling, key, style}) => {
        const domainItem = this.props.domainItems[index]
        return <DomainItem key={domainItem.id} domainItem={domainItem}/>        
    }


    calcRowHeight = ({index}) => {
        return this.props.domainItems[index].expanded ? 240 : 60
    }

    componentDidUpdate(prevProps, prevState) {
        this.listRef.current.recomputeRowHeights()
    }

    render() {
        return (
            <StyledFlexRowsContainer height="100%" width="100%">
                <AutoSizer>
                    {({width, height}) => (
                        <List
                            ref={this.listRef}
                            height={height}
                            rowCount={this.props.domainItems.length}
                            rowHeight={this.calcRowHeight}
                            rowRenderer={this.rowRenderer}
                            width={width}
                        />
                    )}
                </AutoSizer>
            </StyledFlexRowsContainer>
        )
    } 
}

const mapStateToProps = state => ({
    domainItems: state.domainItems.items
})

export default connect(mapStateToProps, {})(DomainItems);