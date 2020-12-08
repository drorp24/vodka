import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux"
import { Search } from 'semantic-ui-react';
import {map, take, getOr, isEmpty} from 'lodash/fp'
import {FlexColumns} from './common/CommonComponents';
import { 
    textFilterCleanSearch,
    textFilterStartSearch,
    textFilterFinishSearch,
    textFilterUpdateSelection } from '../redux/actions/actions'
import {useIntl} from "react-intl"


export const SearchStyled = styled(Search)`
    .ui.icon.input {
        width: 50vh;
    }
`

const DomainItemsSerach = ({
    textFilterCleanSearchAction,
    textFilterStartSearchAction,
    textFilterFinishSearchAction,
    textFilterUpdateSelectionAction,
    textFilterValue,
    textFilterLoading,
    textFilterItems}) => {        

        const timeoutRef = React.useRef()
        const handleSearchChange = (e, data) => {
            clearTimeout(timeoutRef.current)
            textFilterStartSearchAction(data.value)
            timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                textFilterCleanSearchAction()
                return
            }
            textFilterFinishSearchAction(data.value)
            }, 300)
        }

        const handleSelection = (e, data) => {
            const term = getOr(data.value, "result.title", data)
            const itemId = getOr(null, "result.key", data)
            textFilterUpdateSelectionAction(itemId, term)
        }
        
        const ref = React.useRef();
        const keyPress = (e) => {
            if(e.charCode === 13 && !isEmpty(textFilterValue)){
                if(ref){
                    ref.current.close()                    
                }
                textFilterUpdateSelectionAction(null, textFilterValue)
            }
        }
        
        const getResults = () => {
            let results = take(10, textFilterItems)
            results = map(domainItem => ({
                key:domainItem.id,
                title: domainItem.name,
                description: domainItem.description
            }), results)
            return results
        }
        const intl = useIntl()
        return (
            <FlexColumns position="absolute" left="calc(50% - 30vh)" marginRight="10px" height="50px" alignItems="center" marginLeft="5px" justifyContent="space-between">
                <SearchStyled
                        placeholder={intl.formatMessage({id: "search"})}
                        ref={ref}
                        onKeyPress={keyPress}
                        showNoResults={textFilterLoading ? false : true}
                        onResultSelect={handleSelection}
                        onSearchChange={handleSearchChange}                        
                        value={textFilterValue}
                        loading={textFilterLoading}
                        results={getResults()}
                        size="small"/>
            </FlexColumns>
        )
}

const mapStateToProps = state => ({
    textFilterValue: state.domainItems.textFilterValue,
    textFilterLoading: state.domainItems.textFilterLoading,
    textFilterItems: state.domainItems.textFilterItems
})

export default connect(mapStateToProps, 
    {
        textFilterCleanSearchAction: textFilterCleanSearch,
        textFilterStartSearchAction :textFilterStartSearch,
        textFilterFinishSearchAction: textFilterFinishSearch,
        textFilterUpdateSelectionAction: textFilterUpdateSelection
    })(DomainItemsSerach);