import {
    esri
} from "../../core";
import gpTask from './gp';
export default {
    props: {
        pointSymbol: {
            type: Object,
            required: false,
            default: function () {
                return { // symbol used for points
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    style: "square",
                    color: "#8A2BE2",
                    size: "4px",
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 2 // points
                    }
                }
            }
        },
        polylineSymbol: {
            type: Object,
            required: false,
            default: function () {
                return { // symbol used for polylines
                    type: "simple-line", // autocasts as new SimpleLineSymbol()
                    color: "#8A2BE2",
                    width: "4",
                    style: "solid"
                }
            }
        },
        polygonSymbol: {
            type: Object,
            required: false,
            default: function () {
                return { // symbol used for polygons
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: "rgba(138,43,226, 0.8)",
                    style: "solid",
                    outline: {
                        color: "white",
                        width: 1
                    }
                }
            }
        }
    },
    data() {
        return {
            measureResult: [],
            chooseType: {
                show: false,
                attributes: {}
            },
            // 地块类型
            blockType: [
                "未知区域",
                "城市公园",
                "地区",
                "县",
                "县分支",
                "范围/4倍",
                "耕地",
                "干涸的湖床",
                "高尔夫球场",
                "季节湖",
                "季节河/间歇河",
                "潮间带",
                "岛",
                "等深线面积",
                "Ios-height面积",
                "湖",
                "土地面积",
                "政府赠与地",
                "大型城域",
                "大河川",
                "公园",
                "映射目录层边界",
                "海上交通区",
                "测量区域",
                "地铁区域",
                "小河川",
                "人造区域",
                "国家公园",
                "海",
                "果园或人工林",
                "区域辐射",
                "礁",
                "区域河流",
                "保留地",
                "石",
                "粗糙区域",
                "盐",
                "沙",
                "散生树",
                "丛林地区",
                "小地铁区域",
                "雪或冰川",
                "测量组",
                "苔原",
                "未分类的区域特征",
                "未知区域分类",
                "棚覆盖区域",
                "分水岭",
                "湿地",
                "林地"
            ]
        }
    },
    methods: {
        addGraphic(evt) {
            var geometry = evt.geometry;

            let identify = this.confirmIdentify(geometry);

            let geoGraphic = this.createGeoGraphic(geometry, identify);
            this.tempGraphicsLayer.add(geoGraphic);

            // gpTask.callGP('http://192.168.1.60:6080/arcgis/rest/services/INDLTB/GPServer/INDLTB', geoGraphic).then(resp => {
            //     console.dir(resp)
            // })

            let measureLabel = this.createMeasureLabel(geometry, identify);
            this.tempGraphicsLayer.add(measureLabel);

            let identifyLabel = this.createIdentifyLabel(geometry, identify);
            this.tempGraphicsLayer.add(identifyLabel);

            let attributes = {
                identify: identify,
                type: "",
                measure: measureLabel.symbol.text
            }

            geoGraphic.attributes = attributes;

            // if (['polygon', 'rectangle', 'circle', 'ellipse'].indexOf(geometry.type) > -1) {
            //     this.chooseType = {
            //         show: true,
            //         attributes: attributes
            //     };
            // }

            this.measureResult.push({
                identify: identify,
                graphic: geoGraphic
            })

            // 开启下一轮测量
            setTimeout(() => {
                this.sketchViewModel.create(this.activeBtn);
            }, 500);
        },
        createGeoGraphic(geometry, identify) {
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
                identify: identify,
                geometry: geometry,
                symbol: symbol
            });
        },
        createIdentifyLabel(geometry, identify) {
            var centroid = null; // 质心
            if (geometry.type == "polyline") {
                centroid = geometry.getPoint(0, 0);
            } else {
                centroid = geometry.centroid;
            }
            return new esri.Graphic({
                identify: identify,
                geometry: centroid,
                symbol: {
                    type: "text",
                    color: "white",
                    haloColor: "black",
                    haloSize: "1px",
                    text: identify,
                    xoffset: 3,
                    yoffset: 15,
                    font: { // autocast as Font
                        size: 14,
                        family: "sans-serif"
                    }
                }
            });
        },
        createMeasureLabel(geometry, identify) {
            let measureText = this.measure(geometry);

            var centroid = null; // 质心
            if (geometry.type == "polyline") {
                centroid = geometry.getPoint(0, 0);
            } else {
                centroid = geometry.centroid;
            }
            return new esri.Graphic({
                identify: identify,
                geometry: centroid,
                symbol: {
                    type: "text",
                    color: "white",
                    haloColor: "black",
                    haloSize: "1px",
                    text: measureText,
                    xoffset: 3,
                    yoffset: -15,
                    font: { // autocast as Font
                        size: 14,
                        family: "sans-serif"
                    }
                }
            });
        },
        confirmIdentify(geometry) {

            let max = 0,
                prefix;

            switch (geometry.type) {
                case "point":
                    prefix = "P";
                    break;
                case "polyline":
                    prefix = "L";
                    break;
                default:
                    prefix = "A";
                    break;
            }
            this.measureResult.forEach(m => {
                let regexp2 = /[0-9]+/g;
                let ll = m.identify.match(regexp2);
                let num = parseInt(ll[0]);
                if (num > max) {
                    max = num;
                }
            })
            max++;

            return prefix + (max > 10 ? max : '0' + max);
        },
        confirmType() {},
        measure(geometry) {

            var engine = esri.geometry.geometryEngine;

            // 是否是平面坐标系
            var isPlanar = !(geometry.spatialReference.isWGS84 || geometry.spatialReference.isWebMercator /*莫卡拓 大地2000*/ );
            var pArea = isPlanar ? engine.planarArea : engine.geodesicArea;
            var pLength = isPlanar ? engine.planarLength : engine.geodesicLength;

            let measureText = "";
            switch (geometry.type) {
                case "point":
                    break;
                case "polyline":
                    var length = pLength(geometry, this.lengthUnit);
                    if (length < 0) {
                        // simplify the polygon if needed and calculate the area again
                        var simplifiedPolygon = engine.simplify(geometry);
                        if (simplifiedPolygon) {
                            length = pLength(simplifiedPolygon, this.lengthUnit);
                        }
                    }

                    measureText = `${length.toFixed(2)}${this.UnitCn(this.lengthUnit)}`;
                    break;
                default:
                    // calculate the area of the polygon
                    var area = pArea(geometry, this.realAreaUnit);
                    if (area < 0) {
                        // simplify the polygon if needed and calculate the area again
                        var simplifiedPolygon = engine.simplify(geometry);
                        if (simplifiedPolygon) {
                            area = pArea(simplifiedPolygon, this.realAreaUnit);
                        }
                    }
                    if (this.areaUnit == 'mu') {
                        area = area * 0.0015;
                    }
                    measureText = `${area.toFixed(2)}${this.UnitCn(this.areaUnit)}`;
                    break;
            }

            return measureText;

        },
        UnitCn(unit) {
            var result = "";
            switch (unit) {
                case "meters":
                    result = "米";
                    break;
                case "feet":
                    result = "英尺";
                    break;
                case "kilometers":
                    result = "公里";
                    break;
                case "miles":
                    result = "英里";
                    break;
                case "nautical-miles":
                    result = "海里";
                    break;
                case "yards":
                    result = "码";
                    break;
                case "acres":
                    result = "英亩";
                    break;
                case "hectares":
                    result = "公顷";
                    break;
                case "square-feet":
                    result = "平方英尺";
                    break;
                case 'mu':
                    return '亩';
                    break;
                case "square-meters":
                    result = "平方米";
                    break;
                case "square-yards":
                    result = "平方码";
                    break;
                case "square-kilometers":
                    result = "平方千米";
                    break;
                case "square-miles":
                    result = "平方英里";
                    break;
            };

            return result;
        }
    }
}
