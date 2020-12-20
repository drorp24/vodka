import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux"
import { isEmpty, getOr, filter, isNumber} from 'lodash/fp'
import 'react-virtualized/styles.css';
import {Loader} from 'semantic-ui-react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import { FlexRows, FlexColumns } from './common/CommonComponents';
import DomainItem from './DomainItem'
import DomainItemsTools from './DomainItemsTools'
import translate from '../i18n/translate'
import LOCALES from "../i18n/locales"

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

  rowRenderer = ({index, isScrolling, key, style}) => {
    const domainItem = this.filteredDomainItems[index]
    return <DomainItem key={domainItem.id} domainItem={domainItem} style={{...style, direction: this.props.locale === LOCALES.HEBREW ? "rtl" : "ltr"}}/>
  }


  calcRowHeight = ({index}) => {
    const domainItem = this.filteredDomainItems[index]
    return this.filteredDomainItems[index].expanded ? (domainItem.weightedAttributes.length + 2) * 32 : 60
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.loadingItems) return
    this.listRef.current.recomputeRowHeights()
  }

  setFilteredDomainItems = () => {
    const byId = getOr(null, "actualTextFilter.id", this.props)
    if(isNumber(byId)){
      this.filteredDomainItems = filter((domainItem)=> {
        return domainItem.id === byId
      },this.props.domainItems)
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
    if(!this.props.loadingItems){
      this.setFilteredDomainItems()
    }    
    return (
      <StyledFlexRowsContainer height="100%" width="100%">
          <DomainItemsTools/>
          {
            this.props.loadingItems ?
            <FlexColumns height="100%" width="100%" alignItems="center" justifyContent="center">
              <Loader inverted={this.props.themeId === "darkTheme" ? true : false} active inline size="massive" content={translate("loading")}/>
            </FlexColumns> : 
            <AutoSizer>
                {({width, height}) => (
              <List                
                ref={this.listRef}
                height={height - 80}
                rowCount={this.filteredDomainItems.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.rowRenderer}
                width={width}
              />
            )}
            </AutoSizer>
          }          
      </StyledFlexRowsContainer>
    )
  }
}

const mapStateToProps = state => ({
  domainItems: state.domainItems.items,
  weights: state.domainItems.weights,
  actualTextFilter: state.domainItems.actualTextFilter,
  loadingItems: state.domainItems.loadingItems,
  themeId: state.ui.themeId,
  locale: state.ui.locale
})

export default connect(mapStateToProps, {})(DomainItems);