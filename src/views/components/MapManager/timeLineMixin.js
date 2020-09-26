import { esri } from "esri";
import lmkits from "lmkits";
export default {
    props: {
        timeLineEnable: {
            type: Boolean,
            default: true
        },
        timeNodes: Array,
        mapHost: String
    },
    data() {
        return {
            currentTime: "",
            timeList: [],
        }
    },
    mounted() {
        this.timeList = this.timeNodes;
        if (this.timeList && this.timeList.length) {
            let length = this.timeList.length;
            this.timeList[length - 1].active = true;
        }
    },
    methods: {
        changeLayer(item) {
            if (this.currentTime == item.time) {
                return;
            }

            let map = this.esriMap.view.map;

            this.clearLayer(this.currentTime);

            this.currentTime = item.time;
            if (item.tileLayer) {
                let list = [];
                if (Array.isArray(item.tileLayer)) {
                    list = item.tileLayer;
                } else if (item.tileLayer instanceof Object) {
                    list.push(item.tileLayer);
                }
                // if (item.tileLayer instanceof Object) {
                //     list.push(item.tileLayer);
                // } else if (item.tileLayer instanceof Array) {
                //     list = item.tileLayer;
                // }

                list.forEach(l => {
                    map.add(lmkits.maps.createLayer(esri,
                        Object.assign({}, l, {
                            time: item.time
                        }),
                        this.mapHost), 0);
                })
            }
            if (item.featureLayer) {
                let list = [];
                if (Array.isArray(item.featureLayer)) {
                    list = item.featureLayer;
                } else if (item.featureLayer instanceof Object) {
                    list.push(item.featureLayer);
                }
                // if (item.featureLayer instanceof Object) {
                //     list.push(item.featureLayer);
                // } else if (item.featureLayer instanceof Array) {
                //     list = item.featureLayer;
                // }

                list.forEach(l => {
                    map.add(lmkits.maps.createLayer(esri,
                        Object.assign({}, l, {
                            time: item.time
                        }),
                        this.mapHost));
                })

            }
        },
        clearLayer(time) {
            let map = this.esriMap.view.map;

            let layers = map.layers.filter(l => l.time && l.time == time);
            layers.forEach(l => {
                map.remove(l);
            });
        }
    }
}