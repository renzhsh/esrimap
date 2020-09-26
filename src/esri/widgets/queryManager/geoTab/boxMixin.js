import { esri } from "../../../core";
export default {
    data() {
        return {
            sketchViewModel: null
        }
    },
    created() {
        // create a new sketch view model
        this.sketchViewModel = new esri.widgets.Sketch.SketchViewModel({
            view: this.esriMap.view,
            layer: this.tempGraphicsLayer,
            polygonSymbol: this.polygonSymbol
        });

        this.sketchViewModel.on("draw-complete", (event) => { this.addBoxGraphic(event) });
        this.sketchViewModel.on("update-cancel", () => {});
        this.sketchViewModel.on("update-complete", () => {});
    },
    methods: {
        startBoxSelect() {
            this.endFeature();
            this.sketchViewModel.create('rectangle');
            this.$message({
                message: '请在地图中框选查询的范围',
                type: 'success'
            });
        },
        endBox() {
            this.sketchViewModel.reset();
            this.tempGraphicsLayer.removeAll();
        },
        addBoxGraphic(evt) {
            this.tempGraphicsLayer.removeAll();
            var geometry = evt.geometry;

            let graphic = new esri.Graphic({
                geometry: geometry,
                symbol: this.polygonSymbol
            });

            this.tempGraphicsLayer.add(graphic);

            this.callQueryTask(geometry);
        }
    }
}