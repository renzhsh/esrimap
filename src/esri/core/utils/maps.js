import { esri } from '../base';
import tileInfoJSON from './tileInfo';
class MapUtils {
    createMap(mapOption) {
        var basemaps = [];

        let basemapLayers = mapOption.basemaps;
        basemapLayers.forEach(item => {
            basemaps.push(this.createLayer(item));
        });

        var layers = [];

        let clayers = mapOption.layers || [];
        clayers.forEach(l => {
            layers.push(this.createLayer(l));
        });

        return new esri.Map({
            basemap: {
                baseLayers: basemaps
            },
            layers: layers
        });
    }

    createBaseMap(layers) {
        var basemaps = [];

        let basemapLayers = layers || [];
        basemapLayers.forEach(item => {
            basemaps.push(this.createLayer(item));
        });

        return new esri.Basemap({
            baseLayers: basemaps
        });
    }
    createLayer(layerOption) {
        let opt = Object.assign({}, layerOption);

        let layer = null;
        switch (opt.ltype) {
            case 'tile':
                layer = new esri.layers.TileLayer(opt);
                break;
            case 'feature':
                layer = new esri.layers.FeatureLayer(opt);
                break;
            case "mapimage":
                layer = new esri.layers.MapImageLayer(opt);
                break;
            case 'webtile':
                // fullExtent: {
                //     xmin: "13178126.842",
                //     ymin: "3701201.595",
                //     xmax: "13184126.115",
                //     ymax: "3704827.879",
                //     spatialReference: {
                //         latestWkid: 3857,
                //         wkid: 102100
                //     }
                // }
                opt.urlTemplate = opt.url;
                opt.tileInfo = tileInfoJSON;
                layer = new esri.layers.WebTileLayer(opt);
                break;
        }

        return layer;
    }
}

export default new MapUtils();