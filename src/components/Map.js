import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'prunecluster-exportable/dist/LeafletStyleSheet.css';
import { injectIntl } from 'react-intl';
import '../third_party/leaflet_conditional_layer';
import './leaflet_layers_control_style.css';
import { Div } from './common/StyledElements';
import { Map as LeafletMap, TileLayer, WMSTileLayer } from 'react-leaflet';
import { CoordinatesControl } from 'react-leaflet-coordinates';
import { connect } from 'react-redux';
import {
  getOr,
  find,
  filter,
  isNil,
  flow,
  map,
  max,
  min,
  keyBy,
  take,
  sortBy,
  reverse,
} from 'lodash/fp';
import { handleMapClicked, scrollToIndex } from '../redux/actions/actions';
import {
  max_map_zoom,
  default_map_center,
  reveal_geolayer_zoom_threshold,
  reveal_markerlayer_zoom_threshold,
  active_threshold,
} from '../configLoader';
import MapLayers from './mapLayers';
import layersConfig from './mapLayersConfig';
import { task_colors } from '../configLoader';


const MIN_ZOOM = 1;
const INITIAL_ZOOM_LEVEL = 15;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: default_map_center[0],
      lng: default_map_center[1],
      zoom: INITIAL_ZOOM_LEVEL,
    };
    this.leafletMap = null;
    this.mapLayers = new MapLayers(this.props.locale);
    this.mapRequestScroll = false;
    this.scores = { values: [], min: null, max: null };
    this.mapUpdated = false;
  }

  componentDidUpdate() {
    if (this.mapUpdated) return;
    if (this.mapRequestScroll) {
      this.mapRequestScroll = false;
      return;
    }
    this.scores.values = map(item => item.score, this.props.domainItems);
    this.scores.min = min(this.scores.values);
    this.scores.max = max(this.scores.values);

    if (this.leafletMap) {
      this.mapLayers.updateLocale(this.props.locale);
      console.log(' ');
      console.log('componentDidUpdate calling refreshLayers');
      this.refreshLayers();
      let center = null;
      const selectedId = getOr(null, 'selectedDomainItemID', this.props);
      if (!isNil(selectedId)) {
        center = find({ id: selectedId }, this.props.domainItems).center;
        this.leafletMap.setZoom(max_map_zoom);
        this.leafletMap.flyTo(center);
      } else {
        const layerGroupWrapper = getOr(
          null,
          'mapLayers.layerGroupWrrapers[0]',
          this
        );
        if (!isNil(layerGroupWrapper)) {
          const bounds = layerGroupWrapper.leafletLayerGroup
            .getLayers()[0]
            .getBounds();
          if (bounds.isValid()) {
            this.leafletMap.fitBounds(bounds);
          }
        }
      }
    }
  }

  handleClick = () => {
    if (this.leafletMap) {
      this.props.handleMapClickedAction();
    }
  };

  whenReadyCB = obj => {
    this.leafletMap = obj.target;
    this.mapLayers.initialize(this.leafletMap);
    console.log(' ');
    console.log('whenReadyCB calling refreshLayers');
    this.refreshLayers();
  };

  _calcWeightedAttrLayerItems = (top, attrName, includedItems) => {
    console.log(' ');
    console.log('_calcWeightedAttrLayerItems called for: ', attrName);
    return flow([
      filter(item => {
        const weightedAttrValue = find(
          weightedAttr => weightedAttr.key === attrName,
          item.weightedAttributes
        ).value;
        return !isNil(weightedAttrValue);
      }),
      sortBy(
        item =>
          find(
            weightedAttr => weightedAttr.key === attrName,
            item.weightedAttributes
          ).value
      ),
      reverse,
      take(top),
    ])(includedItems);
  };

  level = item => {
    const { min, max } = this.scores;
    const relativeScore = (item.score - min) / (max - min);
    return Math.ceil(relativeScore * (task_colors.length - 1));
  };

  // _addAttrLayer = (layerKey, items, allItem, attrName, activeAttrName, iconName, levelsCount) => {
  //   if(isNil(items) || items.length < 1) return
  //   const attrScores = map((item) => find((attr)=> attr.key === attrName, item.weightedAttributes).value, allItem)
  //   const maxAttrScore = max(attrScores)
  //   const minAttrScore = min(attrScores)
  //   this.mapLayers.addLayer(layerKey, items, "center", (domainItem) => {
  //     console.log('calcStyleCallBack for attr: ')
  //     console.log('attrName: ', attrName);
  //     const itemAttrValue = find((attr)=> attr.key === attrName, domainItem.weightedAttributes).value
  //     const relativScore = (itemAttrValue - minAttrScore) / (maxAttrScore - minAttrScore)
  //     let level = 1
  //     while (level < levelsCount){
  //       if(relativScore <= level/levelsCount) break
  //       level += 1
  //     }
  //     let useActiveIcons = false
  //     if(find((attr)=> attr.key === activeAttrName, domainItem.weightedAttributes).value > active_threshold){
  //       useActiveIcons = true
  //     }
  //     return useActiveIcons ? `${iconName}${level}_active.svg` : `${iconName}${level}.svg`
  //   })
  // }

  // _buildPopup = (item) => {

  //   const popupKeyValueArr = [
  //     {key: this.props.intl.formatMessage({id: "name"}), value: item.name},
  //     {key: this.props.intl.formatMessage({id: "score"}), value: item.score},
  //     {key: this.props.intl.formatMessage({id: "priority"}), value: item.currIdx, countFromOne: true},
  //   ]
  //   this.props.weights.forEach((weight) => {
  //     const weightedAttrScore = find(weightedAttr => weightedAttr.key === weight.key, item.weightedAttributes)?.value
  //     const keyValue = {key: this.props.intl.formatMessage({id: weight.key}), value: weightedAttrScore}
  //     popupKeyValueArr.push(keyValue)
  //   })
  //   return filter((item) => !isNil(item.value), popupKeyValueArr)
  // }

  // _handlePolygonClicked = (e) => {
  //   console.log('_handlePolygonClicked')
  //   this.mapRequestScroll = true
  //   const indexToScroll = getOr(null, "sourceTarget.feature.properties.currIdx", e)
  //   const id = getOr(null, "sourceTarget.feature.properties.id", e)
  //   this.props.scrollToIndexAction(indexToScroll, id, true)
  // }

  refreshLayers = () => {
    console.log(' ');
    console.log('refreshLayers called ');
    const layersConfigMapByKey = keyBy('key', layersConfig.layers);
    this.mapLayers.clearLayers();
    // this.mapLayers.removeMapControl(this.leafletMap)
    // Tasks layer
    const domainItemConf = layersConfigMapByKey['tasks'];
    const topItemsCount = this.calcItemsCountPerZoom(
      reveal_geolayer_zoom_threshold,
      this.props.domainItems
    );
    const taskItems = take(topItemsCount, this.props.domainItems);
    this.mapLayers.addLayer(
      'tasks',
      taskItems,
      'geojson',
      domainItem => {
        if (isNil(domainItem)) {
          return;
        }
        const level = this.level(domainItem);
        return {
          ...domainItemConf.style,
          stroke: max_map_zoom - this.leafletMap.getZoom() < 3,
          fillColor: task_colors[level],
        };
      },
      this._buildPopup,
      this._handlePolygonClicked
    );

    // ToDo: Show score + graph on hover instead of icons
    //
    // - calculate the min & max score of "mer" and "nef" attr across all domainItems (as in lines 94-6 here)
    //   and store them on the instance
    // - calculate the relative score of each item and store it on the item itself
    // - create a  layer for each of the two. Shoud include L.conditionalMarkers to enable view toggling
    //   (currently this._addAttrLayer -> this.mapLayers.addLayer -> mapLayers._addMarkersLayer -> L.conditionalMarkers)
    //   but use plain icons this time
    // - bind one mouseover event handler for each layer, or one per marker, that will popup a graph upon hovering,
    //   using https://github.com/reactchartjs/react-chartjs-2.git

    if (
      this.props.selectedScenarioId &&
      this.props.scenarioCurrentStepIdx > -1
    ) {
      // "mer" layer
      const merConf = layersConfigMapByKey['mer'];
      const topMerMarkersCount = this.calcItemsCountPerZoom(
        reveal_markerlayer_zoom_threshold,
        this.props.domainItems
      );
      const merItems = this._calcWeightedAttrLayerItems(
        topMerMarkersCount,
        merConf.by_attr,
        this.props.domainItems
      );
      console.log('returning merItems: ', merItems);
      // this._addAttrLayer(merConf.key, merItems, this.props.domainItems, merConf.by_attr, "tfi", "stars", 10)

      // "nef" layer
      const nefConf = layersConfigMapByKey['nef'];
      const topNefMarkersCount = this.calcItemsCountPerZoom(
        reveal_markerlayer_zoom_threshold,
        this.props.domainItems
      );
      const nefItems = this._calcWeightedAttrLayerItems(
        topNefMarkersCount,
        nefConf.by_attr,
        this.props.domainItems
      );
      console.log('returning nefItems: ', nefItems);
      // this._addAttrLayer(nefConf.key, nefItems, this.props.domainItems, nefConf.by_attr, "tfi", "bars", 6)
    }

    // selected layer
    const selectedDomainItem = find(
      { id: this.props.selectedDomainItemID },
      this.props.domainItems
    );
    this.mapLayers.updateSelectedItem(
      selectedDomainItem,
      'geojson',
      this._buildPopup,
      this._handlePolygonClicked,
      this.level
    );
    // this.mapLayers.addMapControls(this.leafletMap, this.props.intl)
  };

  calcItemsCountPerZoom = (max_map_zoom, items) => {
    const mapZoom = isNil(this.leafletMap) ? null : this.leafletMap.getZoom();
    let currZoom = Math.max(mapZoom, MIN_ZOOM + 1);
    currZoom = Math.min(currZoom, max_map_zoom);
    const degree = Math.round(Math.sqrt(items.length));
    let topItemsCount = Math.ceil(
      (Math.pow(currZoom - MIN_ZOOM, degree) /
        Math.pow(max_map_zoom - MIN_ZOOM, degree)) *
        items.length
    );
    return topItemsCount;
  };

  handleZoomEnd = eventParams => {
    console.log(' ');
    // console.log('handleZoomEnd calling refreshLayers');
    // this.refreshLayers();
  };

  render() {
    return (
      <Div height="calc(100vh - 60px)">
        <LeafletMap
          zoomControl={false}
          maxZoom={max_map_zoom}
          onzoomend={this.handleZoomEnd}
          whenReady={this.whenReadyCB}
          onClick={this.handleClick}
          style={{ height: '100%' }}
          center={[this.state.lat, this.state.lng]}
          zoom={INITIAL_ZOOM_LEVEL}
        >
          {map(tile => {
            return tile.type === 'wms' ? (
              <WMSTileLayer
                key={tile.url}
                crs={tile.crs}
                url={tile.url}
                attribution={tile.attribution}
                layers={tile.layers}
                format={tile.format}
              />
            ) : (
              <TileLayer
                key={tile.url}
                url={tile.url}
                attribution={tile.attribution}
              />
            );
          }, layersConfig.tiles)}
          <CoordinatesControl position="bottomleft" />
        </LeafletMap>
      </Div>
    );
  }
}

const mapStateToProps = state => ({
  // FOLOWING CAUSE PERFORMACE ISSUE SHOULD USE SELECTOR
  // domainItems: filter((item) => !isNil(getOr(null, "center[0]", item)) && !isNil(item.geojson), state.domainItems.items),
  // neighbors: filter((nei) => !isNil(getOr(null, "center[0]", nei)) && !isNil(nei.geojson), state.domainItems.neighbors),
  domainItems: state.domainItems.items,
  weights: state.domainItems.weights,
  neighbors: state.domainItems.neighbors,
  selectedDomainItemID: state.domainItems.selectedDomainItemID,
  locale: state.ui.locale,
  selectedScenarioId: state.simulation.selectedScenarioId,
  scenarioCurrentStepIdx: state.simulation.scenarioCurrentStepIdx,
});

export default connect(mapStateToProps, {
  handleMapClickedAction: handleMapClicked,
  scrollToIndexAction: scrollToIndex,
})(injectIntl(Map));
