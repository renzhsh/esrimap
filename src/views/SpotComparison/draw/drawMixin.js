import { esri } from "esri";
export default {
  created() {
    this.Setup();
  },
  data() {
    return {
      open: false,
      activeBtn: "",
      tempGraphicsLayer: null,
      featureLayer: null,
      sketchViewModel: null,
      view: null,
      drawing: false
    };
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

      //
      this.view.on("layerview-create", event => {
        var layers = this.view.map.layers.items;

        var map = this.view.map;
        var graphics = layers.filter(l => l.type == "graphics");
        if (graphics.length > 0) {
          var graphic = graphics[0];
          map.reorder(graphic, layers.length - 1);
        }

        var flrs = layers.filter(l => l.type == "feature");
        if (flrs.length > 1) {
          this.$notify.info({
            title: "提醒",
            message: "只能保留一个图斑存储图层"
          });
          return;
        }
        if (flrs.length == 1) {
          var flrs = flrs[0];
          map.reorder(flrs, layers.length - 2);
        }
      });

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
      if (!this.featureLayer && !this.getFeatureLayer()) {
        return;
      }
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
    },
    getFeatureLayer() {
      var layers = this.esriMap.view.map.layers.items.filter(
        l => l.type == "feature"
      );
      if (layers.length == 0) {
        this.$notify.info({
          title: "提醒",
          message: "请先添加图斑存储图层"
        });
        return false;
      }

      if (layers.length > 1) {
        this.$notify.info({
          title: "提醒",
          message: "只能保留一个图斑存储图层"
        });

        return false;
      }

      this.featureLayer = layers[0];

      return true;
    }
  }
};
