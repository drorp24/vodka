import L from 'leaflet'
export const LAYER_TYPE = {
    GEOJSON: "geojson",
    MARKERS: "markers"
}

export default {
    tiles: [
        // {
        //     type: "wms",
        //     name: "wms",
        //     attribution: null,
        //     url: "http://ows.mundialis.de/services/service?",
        //     layers: "TOPO-OSM-WMS",
        //     format: "image/jpeg",
        //     crs: L.CRS.EPSG4326
        // },
        {
            type: "vector",
            name: "osm",
            attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
    ],
    layers: [
        {
            key: "tasks",
            type: LAYER_TYPE.GEOJSON,
            style: {
                "color": "#ff7800",
                "weight": 5,
                "opacity": 1,
                "fillOpacity": 0
            },
            iconUrl: "polygon.svg"
        },
        {
            key: "tfi",
            by_attr: "tfi",
            type: LAYER_TYPE.MARKERS,
            iconUrl: "med_act.svg",
            iconSize: 25,
            iconAnchorX: 9,
            iconAnchorY: 9
        },
        {
            key: "mer",
            by_attr: "mer",
            type: LAYER_TYPE.MARKERS,
            iconUrl: "med_cen.svg",
            iconSize: 25,
            iconAnchorX: 20,
            iconAnchorY: 20
        }        
    ],
    selected_item_layer: {
        key: "selected_item",
        name: "Selected Item",
        type: LAYER_TYPE.MARKERS,
        iconUrl: "selected-map-marker.svg",
        iconSize: 25,
        iconAnchorX: 15,
        iconAnchorY: 15
    }
}

export class LayerParameters {
    constructor(geoPropPath, popupKeyAndPathArr) {
        this.geoPropPath = geoPropPath
        this.popupKeyAndPathArr = popupKeyAndPathArr        
    }
}