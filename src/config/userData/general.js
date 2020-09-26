export default {
    esriInitOption: {
        apiUrl: "http://static.ahygis.com/arcgis/v47/api/init.js",
        cssUrl: "http://static.ahygis.com/arcgis/v47/api/esri/css/main.css",
        modules: ["esri/widgets/LayerList"],
        corsServers: [
            "static.ahygis.com",
            "localhost:8087"
        ],
        toolKits: {
            mode: "vertical", //"vertical",horizontal
            tipDirection: "left",
            printOption: {
                printUrl:
                    "http://arcgis.ahygis.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
                tipInfo: "地图仅供内部使用，严禁外泄",
                copyrightInfo: "制图单位：安徽中瀚测绘科技有限公司"
            },
            list: ["print", "measure", "zoom", "home"]
        },
        gallery: {
            items: [
                {
                    title: "马鞍山天地图",
                    tag: "image",
                    basemaps: [
                        {
                            ltype: "webtile",
                            url:
                                "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={col}&y={row}&z={level}&s=Gali"
                        }
                    ]
                },
                {
                    title: "马鞍山矢量图",
                    tag: "vector",
                    active: true,
                    basemaps: [
                        {
                            ltype: "webtile",
                            url:
                                "http://t0.tianditu.com/DataServer?T=vec_w&X={col}&Y={row}&L={level}&tk=7e0ae407dd22e2d8496af3bbf9926cf5"
                        }
                    ]
                }
            ]
        }
    },
    // 视图初始化配置
    viewOption: {
        constraints: {
            // 禁止旋转
            rotationEnabled: false
        },
        zoom: 12, // Sets zoom level based on level of detail (LOD)
        center: [118.56075682937494, 31.697082129783957] // Sets center point of view using longitude,latitude
    },
    mapHost: "http://arcgis.mascj.com:81",
    // logo图片 地址
    logoSrc: "/static/images/logo.png",
    // 网站名称
    siteTitle: "江东控股项目监管平台",
    // 网站short icon
    siteIcon: "/static/images/favicon.ico"
};
