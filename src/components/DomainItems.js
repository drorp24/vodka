import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux"
import { isEmpty, getOr, filter} from 'lodash/fp'
import 'react-virtualized/styles.css';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import { FlexRows } from './common/CommonComponents';
import DomainItem from './DomainItem'
import AsyncRESTMeta from '../types/asyncRESTMeta';
import { loadDomainItems } from '../redux/actions/actions'
import DomainItemsTools from './DomainItemsTools'

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
    if (isEmpty(this.filteredDomainItems) || this.filteredDomainItems.length < 1)
      this.props.loadDomainItemsAction(new AsyncRESTMeta("/items", "POST"), {})
  }

  rowRenderer = ({index, isScrolling, key, style}) => {
    const domainItem = this.filteredDomainItems[index]
    return <DomainItem key={domainItem.id} domainItem={domainItem} style={style}/>
  }


  calcRowHeight = ({index}) => {
    const domainItem = this.filteredDomainItems[index]
    return this.filteredDomainItems[index].expanded ? domainItem.weightedAttributes.length * 40 + 60 : 60
  }

  componentDidUpdate(prevProps, prevState) {
    this.listRef.current.recomputeRowHeights()
  }

  setFilteredDomainItems = () => {
    const byId = getOr(null, "actualTextFilter.id", this.props)
    if(!isEmpty(byId)){
      this.filteredDomainItems = filter((domainItem)=> {
        return domainItem.id === byId
      },this.props.domainItem)
      return
    }
    const byTerm = getOr(null, "actualTextFilter.term", this.props)
    if(!isEmpty(byTerm)){
      this.filteredDomainItems = filter(
        (domainItem) => {
          return domainItem.name.toLowerCase().includes(byTerm.toLowerCase())
        }
        ,this.props.domainItems)
        return
    }
    this.filteredDomainItems = this.props.domainItems
  }

  render() {
    this.setFilteredDomainItems()
    return (
      <StyledFlexRowsContainer height="100%" width="100%">
          <DomainItemsTools/>
          <AutoSizer>
              {({width, height}) => (
            <List
              ref={this.listRef}
              height={height - 40}
              rowCount={this.filteredDomainItems.length}
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
  domainItems: state.domainItems.items,
  weights: state.domainItems.weights,
  actualTextFilter: state.domainItems.actualTextFilter
})

export default connect(mapStateToProps, {
  loadDomainItemsAction: loadDomainItems
})(DomainItems);