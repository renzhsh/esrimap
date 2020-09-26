export default {
    mapOption: {
        // 底图
        basemaps: [
            {
                title: "马鞍山矢量图",
                tag: "basemap",
                ltype: "webtile",
                url:
                    "http://t0.tianditu.com/DataServer?T=vec_w&X={col}&Y={row}&L={level}&tk=7e0ae407dd22e2d8496af3bbf9926cf5"
            }
        ],
        layers: []
    },
    layers: [
        {
            title: "影像图",
            nodes: [
                {
                    label: "马鞍山市花山区9月份",
                    ltype: "webtile",
                    url:
                        "http://webtile.ahygis.com/HSQ/HSQ_201909/{level}/{col}/{row}.png",
                    fullExtent: {
                        xmin: 13196094.08,
                        ymin: 3719377.03,
                        xmax: 13211068.51,
                        ymax: 3732373.63,
                        spatialReference: {
                            latestWkid: 3857,
                            wkid: 102100
                        }
                    }
                },
                {
                    label: "马鞍山市花山区11月份",
                    ltype: "webtile",
                    url:
                        "http://webtile.ahygis.com/HSQ/HSQ_201911/{level}/{col}/{row}.png",
                    fullExtent: {
                        xmin: 13196609.66,
                        ymin: 3719563.75,
                        xmax: 13209059.82,
                        ymax: 3732167.15,
                        spatialReference: {
                            latestWkid: 3857,
                            wkid: 102100
                        }
                    }
                }
            ]
        },
        {
            title: "图斑变化",
            nodes: [
                {
                    label: "11月份图斑变化",
                    ltype: "feature",
                    url:
                        "http://arcgis.ahygis.com/arcgis/rest/services/yt/FeatureServer",
                    layerInfos: [
                        {
                            id: 0,
                            alias: [
                                {
                                    field: "SXDYMC",
                                    label: "单元名称"
                                },
                                {
                                    field: "YDNAME",
                                    label: "用地名称"
                                },
                                {
                                    field: "XZQHMC",
                                    label: "行政区划"
                                },
                                {
                                    field: "SXPQ",
                                    label: "片区"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
