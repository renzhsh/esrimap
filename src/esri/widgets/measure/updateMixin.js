export default {
    data() {
        return {
            graphicInUpdate: null,
            UpdateEnable: false
        }
    },
    created() {
        // ************************************************************************************
        // set up logic to handle geometry update and reflect the update on "tempGraphicsLayer"
        // ************************************************************************************
        let view = this.esriMap.view;
        view.on("click", (evt) => {
            this.UpdateEnable && view.hitTest(evt).then((response) => {
                var results = response.results.filter(geo => {
                    // return geo.graphic.layer.title == 'tempGraphics' &&
                    //     geo.graphic.geometry.type !== 'point';
                    return true;
                });

                // Found a valid graphic
                if (results.length && results[results.length - 1]
                    .graphic) {
                    // Check if we're already editing a graphic
                    if (!this.graphicInUpdate) {
                        // Save a reference to the graphic we intend to update
                        this.graphicInUpdate = results[results.length - 1].graphic;
                        // Remove the graphic from the GraphicsLayer
                        // Sketch will handle displaying the graphic while being updated
                        // this.tempGraphicsLayer.remove(this.graphicInUpdate);
                        this.sketchViewModel.update(this.graphicInUpdate.geometry);
                    }
                }
            });
        });
    },
    methods: {
        updateGraphic(evt) {
            var geometry = evt.geometry;

            let identify = this.graphicInUpdate.identify;
            let attributes = this.graphicInUpdate.attributes;

            this.deleteGraphicByIdentify(identify);

            let geoGraphic = this.createGeoGraphic(geometry, identify);
            this.tempGraphicsLayer.add(geoGraphic);

            let measureLabel = this.createMeasureLabel(geometry, identify);
            this.tempGraphicsLayer.add(measureLabel);

            let identifyLabel = this.createIdentifyLabel(geometry, identify);
            this.tempGraphicsLayer.add(identifyLabel);

            geoGraphic.attributes = Object.assign(
                attributes, {
                    measure: measureLabel.symbol.text
                });

            this.measureResult.push({
                identify: identify,
                graphic: geoGraphic
            })

            this.graphicInUpdate = null;
        },
        editAttributes() {
            if (this.graphicInUpdate) {
                let geometry = this.graphicInUpdate.geometry;
                let attributes = this.graphicInUpdate.attributes;
                if (['polygon', 'rectangle', 'circle', 'ellipse'].indexOf(geometry.type) > -1) {
                    this.chooseType = {
                        show: true,
                        attributes: attributes
                    };
                }
                this.sketchViewModel.complete();
            } else {
                this.$notify.info({
                    title: '提醒',
                    message: '请先选择要编辑的图形'
                });
            }
        },
        deleteGraphic() {
            if (this.graphicInUpdate) {
                let identify = this.graphicInUpdate.identify;
                this.sketchViewModel.complete();
                this.deleteGraphicByIdentify(identify);
            } else {
                this.$notify.info({
                    title: '提醒',
                    message: '请先选择要删除的图形'
                });
            }
        },
        deleteGraphicByIdentify(identify) {
            let delGraphics = this.tempGraphicsLayer.graphics.filter(g => {
                return g.identify == identify;
            })
            let index = this.measureResult.findIndex(item => item.identify == identify);
            this.measureResult.splice(index, 1);

            this.tempGraphicsLayer.removeMany(delGraphics.items)
        }
    },
    watch: {
        UpdateEnable() {
            if (this.UpdateEnable && this.drawing) {
                this.cancelDraw();
            }
        }
    }
}
