import { esri } from "../../core";
export default {
    created() {
        this.Setup();
    },
    data() {
        return {
            open: false,
            activeBtn: '',
            tempGraphicsLayer: null,
            sketchViewModel: null,
            view: null,
            drawing: false
        }
    },
    methods: {
        openWidget() {
            let length = this.view.map.allLayers.length;
            this.view.map.reorder(this.tempGraphicsLayer, length - 1);
            this.open = true;
        },
        closeWidget() {
            this.open = false;
            this.UpdateEnable = false;
            this.cancelDraw();
        },
        Setup() {
            this.view = this.esriMap.view;

            this.tempGraphicsLayer = this.esriMap.view.graphics;

            // let temps = this.view.map.layers.filter(l => l.title == "tempGraphics");
            // if (temps && temps.length > 0) {
            //     this.tempGraphicsLayer = temps[0];
            // } else {
            //     // GraphicsLayer to hold graphics created via sketch view model
            //     this.tempGraphicsLayer = new esri.layers.GraphicsLayer({
            //         title: 'tempGraphics'
            //     });

            //     this.view.map.add(this.tempGraphicsLayer);
            // }

            // create a new sketch view model
            this.sketchViewModel = new esri.widgets.Sketch.SketchViewModel({
                view: this.view,
                layer: this.tempGraphicsLayer,
                pointSymbol: this.pointSymbol,
                polylineSymbol: this.polylineSymbol,
                polygonSymbol: this.polygonSymbol
            });

            // ************************************************************
            // Get the completed graphic from the event and add it to view.
            // This event fires when user presses
            //  * "C" key to finish sketching point, polygon or polyline.
            //  * Double-clicks to finish sketching polyline or polygon.
            //  * Clicks to finish sketching a point geometry.
            // ***********************************************************
            this.sketchViewModel.on("draw-complete", this.addGraphic);
            this.sketchViewModel.on("update-complete", this.updateGraphic);
            this.sketchViewModel.on("update-cancel", this.updateGraphic);

        },
        beginDraw(name) {
            if (this.UpdateEnable) this.UpdateEnable = false;
            this.activeBtn = name;
            this.drawing = true;
            this.sketchViewModel.create(name);
        },
        cancelDraw() {
            this.drawing = false;
            this.sketchViewModel.reset();
            this.activeBtn = "reset";
        },
        reset() {
            this.drawing = false;
            this.sketchViewModel.reset();
            this.tempGraphicsLayer.removeAll();
            this.activeBtn = "reset";
            this.measureResult = [];
        }
    }
}