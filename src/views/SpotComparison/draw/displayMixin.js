import { esri } from "esri";
export default {
  props: {
    pointSymbol: {
      type: Object,
      required: false,
      default: function() {
        return {
          // symbol used for points
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          style: "square",
          color: "#8A2BE2",
          size: "4px",
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2 // points
          }
        };
      }
    },
    polylineSymbol: {
      type: Object,
      required: false,
      default: function() {
        return {
          // symbol used for polylines
          type: "simple-line", // autocasts as new SimpleLineSymbol()
          color: "#8A2BE2",
          width: "4",
          style: "solid"
        };
      }
    },
    polygonSymbol: {
      type: Object,
      required: false,
      default: function() {
        return {
          // symbol used for polygons
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: "rgba(138,43,226, 0.8)",
          style: "solid",
          outline: {
            color: "white",
            width: 1
          }
        };
      }
    }
  },
  data() {
    return {
      measureResult: [],
      chooseType: {
        show: false,
        attributes: {}
      }
    };
  },
  methods: {
    addGraphic(evt) {
      var geometry = evt.geometry;

      let geoGraphic = this.createGeoGraphic(geometry, {
        type: geometry.type
      });

      this.featureLayer
        .applyEdits({
          addFeatures: [geoGraphic]
        })
        .then(res => {
          this.featureLayer.refresh();
          this.sketchViewModel.create(this.activeBtn);
        });

      // 开启下一轮测量
      // setTimeout(() => {
      //   this.sketchViewModel.create(this.activeBtn);
      // }, 500);
    },
    createGeoGraphic(geometry, attributes = {}) {
      var symbol;

      // Choose a valid symbol based on return geometry
      switch (geometry.type) {
        case "point":
          symbol = this.pointSymbol;
          break;
        case "polyline":
          symbol = this.polylineSymbol;
          break;
        default:
          symbol = this.polygonSymbol;
          break;
      }
      // Create a new graphic
      return new esri.Graphic({
        geometry,
        symbol,
        attributes: Object.assign({}, attributes)
      });
    }
  }
};
