import React from 'react';
import { connect } from "react-redux"
import {map, getOr, isNil} from 'lodash/fp'
import {Dropdown, Divider, Button, Loader, Header} from 'semantic-ui-react';
import {Div} from './common/StyledElements';
import {FlexRows} from './common/CommonComponents';
import {
    loadPriorityPresets,
    loadFilterPresets,
    loadGeoPresets,
    selectPresetGroup
} from '../redux/actions/actions'
import AsyncRestParams from '../types/asyncRestParams';
import getLoadItemsRequestBody from '../types/loadItemsRequestBodyType'

const ChoosePresets = (
    {
        loadingPriorityPresets, 
        loadingFilterPresets, 
        loadingGeoPresets,
        loadPriorityPresetsAction,
        loadFilterPresetsAction,
        loadGeoPresetsAction,
        selectPresetGroupAction,
        priorityPresets,
        filterPresets,
        geoPresets,
        weights,
        scenarioId,
        scenarioStepIdx,
        close,
        initialPriorityPresetId,
        initialFilterPresetId,
        initialGeoPresetId
    }) => {

    const [priorityPresetId, setPriorityPresetId] = React.useState(null)
    const actualPriorityPresetId = !isNil(priorityPresetId) ? priorityPresetId : initialPriorityPresetId
    const [filterPresetId, setFilterPresetId] = React.useState(null)
    const actualFilterPresetId = !isNil(filterPresetId) ? filterPresetId : initialFilterPresetId
    const [geoPresetId, setGeoPresetId] = React.useState(null)
    const actualGeoPresetId = !isNil(geoPresetId) ? geoPresetId : initialGeoPresetId

    const popupRef = React.useRef()
    React.useEffect(() => {
        loadPriorityPresetsAction(new AsyncRestParams("/config/paramters_scores", "GET"))
        loadFilterPresetsAction(new AsyncRestParams("/config/filters_preset", "GET"))
        loadGeoPresetsAction(new AsyncRestParams("/config/aoi", "GET"))
    }, [loadPriorityPresetsAction, loadFilterPresetsAction, loadGeoPresetsAction])    

    const handleClick = e => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          close();
        }
      };
    
    React.useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
        document.removeEventListener("click", handleClick);
    };
    });

    const handlePresetsSelected = () => {
        const loadItemsRequestBody = getLoadItemsRequestBody({priorityPresetId: actualPriorityPresetId, filterPresetId: actualFilterPresetId, geoPresetId: actualGeoPresetId, weights, scenarioId, scenarioStepIdx})
        selectPresetGroupAction(new AsyncRestParams("/data/tasksAndNeighbors", "POST"), loadItemsRequestBody)
        close()
    }    

    const handleChoose = (event, updater) => {
        const id = getOr(null, "value", event)
        updater(id)
    }

    const enableLoad = actualPriorityPresetId && actualFilterPresetId && actualGeoPresetId
    const presetsLoading = loadingPriorityPresets || loadingFilterPresets || loadingGeoPresets

    return (
        <FlexRows width="300px" ref={popupRef}>
            <FlexRows alignItems="center">
                <Header>Choose Presets</Header>
            </FlexRows>
            <Divider/>
            <Loader size="massive" active={presetsLoading} content="Loading"/>
            <FlexRows marginBottom="10px">
                <Div marginBottom="5px">
                    Priority parameters
                </Div>
                <Dropdown
                    value={actualPriorityPresetId}
                    clearable
                    fluid
                    search
                    selection     
                    options={priorityPresets}
                    onChange={(event, data) => {handleChoose(data, setPriorityPresetId)}}
                />
            </FlexRows>
            <FlexRows marginBottom="10px">
                <Div marginBottom="5px">
                    Filters
                </Div>
                <Dropdown
                    value={actualFilterPresetId}
                    clearable
                    fluid
                    search
                    selection     
                    options={filterPresets}
                    onChange={(event, data) => {handleChoose(data, setFilterPresetId)}}
                />
            </FlexRows>
                <Div marginBottom="5px">
                    Geographic filter
                </Div>
                <FlexRows marginBottom="10px">
                    <Dropdown
                        value={actualGeoPresetId}
                        clearable
                        fluid
                        search
                        selection     
                        options={geoPresets}                    
                        onChange={(event, data) => {handleChoose(data, setGeoPresetId)}}
                    />
                </FlexRows>
            <Button color="orange" fluid disabled={!enableLoad} onClick={handlePresetsSelected}>Load</Button>
        </FlexRows>
    )
}

const mapStateToProps = state => ({
    priorityPresets: map((priorityPreset)=>({key: priorityPreset.id, text:priorityPreset.name.length > 15 ? `${priorityPreset.name.substring(0,15)}...` : priorityPreset.name, value:priorityPreset.id}), state.domainItems.priorityPresets),
    filterPresets: map((filterPreset)=>({key: filterPreset.id, text:filterPreset.name.length > 15 ? `${filterPreset.name.substring(0,15)}...` : filterPreset.name, value: filterPreset.id}), state.domainItems.filterPresets),
    geoPresets: map((geoPreset)=>({key: geoPreset.id, text:geoPreset.name.length > 15 ? `${geoPreset.name.substring(0,15)}...` : geoPreset.name, value:geoPreset.id}), state.domainItems.geoPresets),
    loadingPriorityPresets: state.domainItems.loadingPriorityPresets,
    loadingFilterPresets: state.domainItems.loadingFilterPresets,
    loadingGeoPresets: state.domainItems.loadingGeoPresets,
    initialPriorityPresetId: state.domainItems.selectedPriorityPresetId,
    initialFilterPresetId: state.domainItems.selectedFilterPresetId,
    initialGeoPresetId: state.domainItems.selectedGeoPresetId,
    weights: state.domainItems.weights,
    scenarioId: state.simulation.selectedScenarioId,
    scenarioStepIdx: state.simulation.scenarioCurrentStepIdx,
})

export default connect(mapStateToProps, {
    loadPriorityPresetsAction: loadPriorityPresets,
    loadFilterPresetsAction: loadFilterPresets,
    loadGeoPresetsAction: loadGeoPresets,
    selectPresetGroupAction: selectPresetGroup
})(ChoosePresets);    