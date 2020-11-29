export const LAYER_TYPE = {
    GEOJSON: "geojson",
    MARKERS: "markers"
}

export default [
    {
        key: "buildings",
        name: "Buildings",
        type: LAYER_TYPE.GEOJSON,
        style: {
            "color": "black",
            "weight": 0,
            "fillOpacity": 0.4
        }
    },
    {
        key: "tasks",
        name: "Tasks",
        type: LAYER_TYPE.GEOJSON,
        style: {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 1,
            "fillOpacity": 0
        }
    },
    {
        key: "tfi",
        name: "Activity",
        type: LAYER_TYPE.MARKERS,
        iconUrl: "high_tfi.svg",
        iconSize: 25,
        iconAnchorX: 9,
        iconAnchorY: 9
    },
    {
        key: "mer",
        name: "Centrality",
        type: LAYER_TYPE.MARKERS,
        iconUrl: "selected-map-marker.svg",
        iconSize: 25,
        iconAnchorX: 20,
        iconAnchorY: 20
    }
]

export class LayerParameters {
    constructor(geoPropPath, popupKeyAndPathArr) {
        this.geoPropPath = geoPropPath
        this.popupKeyAndPathArr = popupKeyAndPathArr        
    }
}