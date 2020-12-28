import purple from '@material-ui/core/colors/purple'

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
            type: "wms",
            name: "wms",
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            // layers: "mapbox.streets"
        },
        // {
        //     type: "vector",
        //     name: "osm",
        //     attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        //     url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // }
    ],
    layers: [
        {
            key: "tasks",
            type: LAYER_TYPE.GEOJSON,
            style: {
                "stroke": true,
                "weight": 3,
                "color": "white",
                "fill": true,
                "fillOpacity": 1,
            },
            iconUrl: "polygon.svg"
        },
        {
            key: "mer",
            by_attr: "mer",
            type: LAYER_TYPE.MARKERS,
            iconUrl: "stars.svg",
            iconSize: 45,
            iconAnchorX: 25,
            iconAnchorY: 45
        },
        {
            key: "nef",
            by_attr: "nef",
            type: LAYER_TYPE.MARKERS,
            iconUrl: "bars6.svg",
            iconSize: 25,
            iconAnchorX: 20,
            iconAnchorY: 20
        }        
    ],
    // selected_item_layer: {
    //     key: "selected_item",
    //     name: "Selected Item",
    //     type: LAYER_TYPE.MARKERS,
    //     iconUrl: "selected-map-marker.svg",
    //     iconSize: 25,
    //     iconAnchorX: 15,
    //     iconAnchorY: 15
    // },
    selected_item_layer: {
        key: "selected_item",
        type: LAYER_TYPE.GEOJSON,
        style: {
            "stroke": true,
            "weight": 3,
            "color": purple.A400,
            "fill": true,
            "fillOpacity": 1,
        }
    },
    popup: {
        minWidth: 200,
        opacity: 1
    }
}