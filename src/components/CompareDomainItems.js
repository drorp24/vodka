import React from 'react';
import {withTheme} from 'styled-components';
import { connect } from "react-redux"
import { ResponsiveRadar } from '@nivo/radar'
import {filter, map, set, remove , find, flow, concat} from 'lodash/fp'
import {FlexRows} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import { toggleCompareDomainItemsMode } from '../redux/actions/actions'
import {max_items_to_compare} from '../configLoader';
import translate from '../i18n/translate'

const CompareDomainItems = ({theme, compareDomainItemsMode, selectedDomainItemsIdsForCmp, toggleCompareDomainItemsModeAction, domainItems}) => {
    
    const renderSelect = () => {        
        return (
            <FlexRows alignItems="center" justifyContent="center" width="100%" height="calc(100vh - 60px)">
                <Div styleType="label1" marginBottom="20px">
                    {translate("select_to_compare", true, {max_items_to_compare})}
                </Div>                
            </FlexRows>
        )
    }

    const renderView = () => {
        const selectedDomainItems = filter((domainItem) => selectedDomainItemsIdsForCmp.indexOf(domainItem.id) !== -1, domainItems)        
        let keys = map((domainItem) => domainItem.name, selectedDomainItems)
        let data = []
        selectedDomainItems.forEach(domainItem => {
            domainItem.weightedAttributes.forEach(weightedAttribute => {
                let attributeSet = find({"attribute": weightedAttribute.key} ,data)
                if(!attributeSet){
                    attributeSet = {"attribute": weightedAttribute.key}
                }
                attributeSet = set(domainItem.name, weightedAttribute.value, attributeSet)
                data = flow([
                    remove({"attribute": weightedAttribute.key}),
                    concat(attributeSet)]
                )(data)

            });            
        });
        
        return (
            <FlexRows style={{stroke: theme["radarStroke"]}} alignItems="center" justifyContent="center" width="100%" height="calc(100vh - 60px)">
                <ResponsiveRadar
                data={data}
                keys={keys}
                indexBy="attribute"
                maxValue="auto"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor={{ from: 'color' }}
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={36}
                enableDots={true}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                dotBorderColor={{ from: 'color' }}
                enableDotLabel={true}
                dotLabel="value"
                dotLabelYOffset={-12}
                colors={{ scheme: 'nivo' }}
                fillOpacity={0.25}
                blendMode="multiply"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                isInteractive={true}
                legends={[
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: '#999',
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
                />
                {/* <Radar
                    color="white"
                    width={500}
                    height={500}
                    padding={70}
                    domainMax={10}
                    highlighted={null}
                    data={{
                    variables,
                    sets                  
                    }}/> */}
            </FlexRows>
        )
    }
    if(selectedDomainItemsIdsForCmp.length < 1){
        return renderSelect()
    }
    else {
        return renderView()
    }
}

const mapStateToProps = state => ({
    compareDomainItemsMode: state.ui.compareDomainItemsMode,
    selectedDomainItemsIdsForCmp: state.ui.selectedDomainItemsIdsForCmp,
    domainItems: state.domainItems.items
})

export default connect(mapStateToProps, {toggleCompareDomainItemsModeAction: toggleCompareDomainItemsMode})(withTheme(CompareDomainItems));