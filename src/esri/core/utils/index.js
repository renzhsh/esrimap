import MapUtils from './maps';

export const esriUtils = {
    createMap(args) {
        return MapUtils.createMap(args);
    },
    createBaseMap(args) {
        return MapUtils.createBaseMap(args);
    },
    createLayer(args) {
        return MapUtils.createLayer(args);
    }
}