import { esri } from "../base";

function defValue(arg, defaultValue) {
    if (arg == undefined || arg == null) {
        return defaultValue;
    } else {
        return arg;
    }
}

export default class {

    get pointSymbol() {
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

    get polylineSymbol() {
        return {
            // symbol used for polylines
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#8A2BE2",
            width: "4",
            style: "solid"
        };
    }

    get polygonSymbol() {
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

    readyForDisplay(view) {
        this.layer = view.graphics;
        // let res = view.map.layers.filter(
        //     layer => layer.title == "task result"
        // );
        // if (res && res.length) {
        //     this.layer = res.items[0];
        // } else {
        //     this.layer = new esri.layers.GraphicsLayer({
        //         title: "task result"
        //     });
        //     view.map.add(this.layer);

        //     // view.map.allLayers.on("change", (event) => {
        //     //     let length = view.map.allLayers.length;
        //     //     let index = view.map.allLayers.findIndex(l => l.title == this.layer.title);
        //     //     if (index < length - 1) {
        //     //         view.map.reorder(this.layer, length - 1);
        //     //     }

        //     //     this.layer.removeAll();
        //     // })
        // }

        // let length = view.map.allLayers.length;
        // let index = view.map.allLayers.findIndex(l => l.title == this.layer.title);
        // if (index < length - 1) {
        //     view.map.reorder(this.layer, length - 1);
        // }

        this.clear(view);
    }

    clear(view) {
        if (this.layer) {
            this.layer.removeAll();
        }
        view.popup.visible = false;
    }

    locate(view, target, option) {
        view.goTo(target, option);
    }

    openPopup(view, feature, option) {

        this.readyForDisplay(view);

        let features = feature instanceof Array ? feature : [feature];

        features.forEach(f => {
            if (option.popupTemplate) {
                f.popupTemplate = option.popupTemplate;
            }
        })

        let graphics = features.map(f => {
            return new esri.Graphic({
                geometry: f.geometry,
                symbol: f.symbol,
                attributes: f.attributes,
                popupTemplate: f.popupTemplate
            });
        });
        view.popup.open({
            location: features[0].geometry.centroid,
            features: graphics
        });
    }

    addGraphic(view, feature, option) {

        if (!option) option = {};
        this.readyForDisplay(view);

        let features = feature instanceof Array ? feature : [feature];

        features.forEach(f => {
            if (option.symbol) {
                f.symbol = option.symbol;
            } else {
                switch (f.geometry.type) {
                    case "point":
                        f.symbol = defValue(option.pointSymbol, this.pointSymbol);
                        break;
                    case "polyline":
                        f.symbol = defValue(option.polylineSymbol, this.polylineSymbol);
                        break;
                    default:
                        f.symbol = defValue(option.polygonSymbol, this.polygonSymbol);
                        break;
                }

            }

        })

        this.layer.addMany(features);
    }
};