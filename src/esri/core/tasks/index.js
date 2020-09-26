import QueryTask from './queryTask';
import IdentifyTask from './IdentifyTask';
import GeoQueryTask from './GeoQueryTask';
import TaskView from './taskView';
import GPTasks from './gpTasks';

let queryTask = new QueryTask();
let identifyTask = new IdentifyTask();
let geoQueryTask = new GeoQueryTask();
let taskView = new TaskView();

let gpTask = new GPTasks();

class Tasks {
    /**
     * let sourceExample = [{
            featureLayer: {
                title: "太白镇行政村",
                url:
                    "/arcgis/rest/services/boundary/TBZXZC/MapServer/0",
                popupTemplate: {}
            },
            searchFields: ["MC"],
            exactMatch: false,
            outFields: ["*"],
        }];
     */
    query(term, sources) {
        return queryTask.execute(sources, term);
    }

    identify(clickEvent, option) {
        return identifyTask.execute(clickEvent, option);
    }

    geoQuery(url, geometry, option = {}) {
        return geoQueryTask.geoQuery(url, geometry, option);
    }

    async callGP(url, graphics, distince, unit) {
        return await gpTask.callGP(url, graphics, distince, unit);
    }

    locate(view, feature, option) {
        taskView.locate(view, feature, option);
    }

    openPopup(view, feature, option) {
        taskView.openPopup(view, feature, option);
    }

    addGraphic(view, feature, option) {
        taskView.addGraphic(view, feature, option);
    }

    clearGraphic(view) {
        taskView.clear(view);
    }

    /**
     * 闪烁动画
     * @param {*} view
     * @param {*} feature 
     * @param {*} frameIndexList 
     * @param {*} interval 
     * @param {*} frame0
     * @param {*} frame2 
     */
    flick(view, feature, frameIndexList, interval, frameSymbol0, frameSymbol2) {
        let type = feature.geometry.type;

        if (["polygon", "point"].indexOf(type) == -1) {
            throw `flick 不支持的geometry类型 ${type}`;
        }

        let symbols = {
            "polygon": [{
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "#ff0",
                style: "solid"
                // outline: {
                //     color: "white",
                //     width: 1
                // }
            }, {
                type: "simple-line",
                color: "#ff0",
                width: "4",
                style: "solid"
            }],
            "point": [{
                // symbol used for points
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                // color: "#fff7e6",
                size: 30,
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: 'red',
                    width: 2 // points
                }
            }, {
                type: "simple-marker",
                color: "#ff0",
                width: "4",
                size: "4px"
            }]
        };

        let frame0 = () => {
            this.addGraphic(view, feature, {
                symbol: Object.assign({}, symbols[type][0], frameSymbol0)

            });
        };

        let frame1 = () => {
            this.clearGraphic(view);
        };

        let frame2 = () => {
            this.addGraphic(view, feature, {
                symbol: Object.assign({}, symbols[type][1], frameSymbol2)
            });
        };

        let frames = [frame0, frame1, frame2];

        let actions = [],
            index = 0;

        frameIndexList.forEach(f => {
            actions.push(frames[f]);
        })

        let timer = setInterval(() => {
            actions[index++]();
            if (index >= actions.length) {
                clearInterval(timer);
            }
        }, interval ? interval : 300);
    }
}

export const tasks = new Tasks();
