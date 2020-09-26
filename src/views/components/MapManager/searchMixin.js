import {
    tasks
} from 'esri';

export default {
    props: {
        treeEnable: {
            type: Boolean,
            default: true
        },
        searchEnable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            treeOption: {
                list: [],
                fn: item => item
            }
        }
    },
    computed: {
        SearchSource: function () {
            let layers = this.esriMap.view.map.layers.filter(l => {
                return l.queryEnable == true;
            });

            return layers.map(l => {
                let fields = [];
                if (l.searchFields) {
                    fields = l.searchFields;
                } else {
                    fields = l.fields.map(f => f.alias);
                }

                return {
                    featureLayer: l,
                    searchFields: fields,
                    exactMatch: false,
                    outFields: ["*"],
                }
            });
        }
    },
    created() {
        this.enableIdentify();
        this.loadTreeNode();
    },
    methods: {
        enableIdentify() {
            this.esriMap.view.on("click", event => {
                let layers = this.esriMap.view.map.layers.filter(l => l.queryEnable && l.tag != 'boundary');

                if (layers && layers.length) {
                    let target = layers.items[0];

                    tasks.identify(event, {
                        url: target.url,
                        view: this.esriMap.view
                    }).then(resp => {
                        let features = resp.results.map(r => {
                            r.feature.sourceLayer = target;
                            return r.feature;
                        });

                        if (features.length) {
                            this.$emit('identify', features[0]);
                        }
                    }).catch(err => {
                        console.error(err)
                    })
                }
            });
        },
        async loadTreeNode() {
            let boundarySource = this.SearchSource.filter(item => item.featureLayer.tag == 'boundary');

            let result = await tasks.query("", boundarySource);
            if (result && result.length) {
                let list = result.filter(f => f.attributes.XZQDM && f.attributes.XZQMC).map(item => {
                    return {
                        id: item.attributes.XZQDM,
                        label: item.attributes.XZQMC
                    }
                });
                this.treeOption.list = list;
            }
        },
        query(term) {
            return tasks.query(term, this.SearchSource);
        },
        async queryAndLocate(treeItem) {
            let treeSearchSource = this.SearchSource.filter(s => {
                return s.featureLayer.tag == 'boundary'
            });

            let result = await tasks.query(treeItem.label, treeSearchSource);
            if (result && result.length) {
                this.locate(result[0]);
            }
        },
        locate(feature) {
            this.$emit('locate', feature);
        }
    }
}
