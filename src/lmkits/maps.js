import { esriUtils } from 'esri';

export default {
    createMap(esri, mapOption, mapHost) {
        var basemaps = [];

        let basemapLayers = mapOption.basemaps;
        basemapLayers.forEach(item => {
            basemaps.push(this.createLayer(esri, item, mapHost));
        });

        var layers = [];

        let clayers = mapOption.layers || [];
        clayers.forEach(l => {
            layers.push(this.createLayer(esri, l, mapHost));
        });

        return new esri.Map({
            basemap: {
                baseLayers: basemaps
            },
            layers: layers
        });
    },
    createLayer(esri, layerOption, mapHost) {
        let opt = Object.assign({}, layerOption);
        if (opt.url.indexOf('http://') == -1 && opt.url.indexOf('https://') == -1) {
            opt.url = mapHost + opt.url;
        }

        return esriUtils.createLayer(opt);
    }
}