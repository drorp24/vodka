import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux"
import { isEmpty } from 'lodash/fp'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import { FlexRows } from './common/CommonComponents';
import DomainItem from './DomainItem'
import AsyncRESTMeta from '../types/asyncRESTMeta';
import { loadDomainItems } from '../redux/actions/actions'

const StyledFlexRowsContainer = styled(FlexRows)`
*,*:focus,*:hover{
    outline:none;
}
border-left: ${({theme}) => `1px solid ${theme["borderColor"]}`};
border-right: ${({theme}) => `1px solid ${theme["borderColor"]}`};
`

class DomainItems extends React.Component {

  constructor(props) {
    super(props)
    this.listRef = React.createRef();
  }

  componentDidMount() {
    if (isEmpty(this.props.domainItems) || this.props.domainItems.length < 1)
      this.props.loadDomainItemsAction(new AsyncRESTMeta("/items", "POST", {}))
  }

  rowRenderer = ({index, isScrolling, key, style}) => {
    const domainItem = this.props.domainItems[index]
    return <DomainItem key={domainItem.id} domainItem={domainItem} style={style}/>
  }


  calcRowHeight = ({index}) => {
    return this.props.domainItems[index].expanded ? 230 : 60
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

export default connect(mapStateToProps, {
  loadDomainItemsAction: loadDomainItems
})(DomainItems);