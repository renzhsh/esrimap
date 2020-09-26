import { esri, esriUtils } from '../../core';
export default {
    data() {
        return {
            dict: new Map(),
            currentLayer: null,
            opacity: 1,
        };
    },
    computed: {
        map() {
            return this.esriMap.view.map;
        },
    },
    watch: {
        opacity() {
            if (this.currentLayer) {
                this.currentLayer.opacity = this.opacity;
            }
        },
    },
    methods: {
        triggerOpacity(node, data) {
            if (this.dict.has(data.url)) {
                let layer = this.dict.get(data.url);

                this.currentLayer = layer;
                this.opacity = layer.opacity;
            }
        },
        addNode(data) {
            if (!(data.ltype && data.url)) return;

            let layer = null;
            if (this.dict.has(data.url)) {
                layer = this.dict.get(data.url);
            } else {
                layer = esriUtils.createLayer(data);
                this.dict.set(data.url, layer);
            }

            if (data.sublayers && data.sublayers.length) {
                const l = this.map.layers.items.filter(
                    item => item.url === data.url
                );
                if (!l.length) {
                    this.map.add(layer);
                }
                const sublayer = layer.findSublayerById(data.layerid);
                sublayer.visible = true;
            } else {
                this.map.add(layer);
            }

            layer.when(() => {
                this.esriMap.view.goTo(
                    {
                        target: layer.fullExtent,
                        zoom: 14,
                    },
                    {
                        duration: 1000,
                    }
                );
            });
        },
        removeNode(data) {
            if (this.dict.has(data.url)) {
                let layer = this.dict.get(data.url);
                if (data.sublayers && data.sublayers.length) {
                    const sublayer = layer.findSublayerById(data.layerid);
                    sublayer.visible = false;
                } else {
                    this.map.remove(layer);
                }
            }
        },
    },
};
