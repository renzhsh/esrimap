import { esri } from '../../../core';
export default {
    data() {
        return {
            featureSelecting: false,
        };
    },
    created() {
        let view = this.esriMap.view;

        view.on('click', event => {
            if (!this.featureSelecting) return;
            let layers = this.getLayer(event.mapPoint);

            this.execute(layers.items, event.mapPoint);
        });
    },
    methods: {
        startFeatureSelect() {
            this.endBox();
            this.featureSelecting = true;
            this.$message({
                message: '请在地图中拾取查询范围',
                type: 'success',
            });
        },
        endFeature() {
            this.featureSelecting = false;
            this.tempGraphicsLayer.removeAll();
        },
        execute(layers, mapPoint) {
            let pThreads = [];

            for (var i in layers) {
                ((index, layer) => {
                    pThreads.push(
                        this.callIdentify(
                            mapPoint,
                            layer.url,
                            this.esriMap.view
                        )
                            .then(result => result)
                            .catch(ex => ex)
                    );
                })(i, layers[i]);
            }

            Promise.all(pThreads).then(resp => {
                // 过滤掉没有识别结果的result
                resp = resp.filter(r => r.results && r.results.length > 0);
                if (resp.length > 0) {
                    this.addGraphic(resp[resp.length - 1].results[0].feature);
                } else {
                    this.$message({
                        message: '请重新拾取查询范围',
                        type: 'warning',
                    });
                }
                this.featureSelecting = false;
            });
        },
        addGraphic(evt) {
            this.tempGraphicsLayer.removeAll();
            var geometry = evt.geometry;

            let graphic = new esri.Graphic({
                geometry: geometry,
                symbol: this.polygonSymbol,
            });

            this.tempGraphicsLayer.add(graphic);

            this.geometry = geometry;

            this.esriMap.view.goTo(geometry);

            this.callQueryTask(geometry);
        },
        getLayer(point) {
            return this.esriMap.view.map.layers.filter(l => {
                // 不支持 Identify
                if (
                    !l.capabilities ||
                    (l.capabilities instanceof Array &&
                        l.capabilities.indexOf('Query') == -1)
                )
                    return false;

                // 触发点不在图层范围内
                if (!l.fullExtent.contains(point)) return false;

                return true;
            });
        },
        callIdentify(point, url, view) {
            let identifyTask = new esri.tasks.IdentifyTask(url);

            // Set the parameters for the Identify
            let params = new esri.tasks.support.IdentifyParameters(
                Object.assign(
                    {
                        tolerance: 0,
                        layerOption: 'top',
                        returnGeometry: true,
                    },
                    {
                        geometry: point,
                        // width: option.view.width,
                        // height: option.view.height,
                        mapExtent: view.extent,
                    }
                )
            );
            return identifyTask.execute(params);
        },
    },
};
