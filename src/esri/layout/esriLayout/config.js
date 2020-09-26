export default {
    esriInitOption: {
        apiUrl: "http://static.ahygis.com/arcgis/v47/api/init.js",
        cssUrl: "http://static.ahygis.com/arcgis/v47/api/esri/css/main.css",
        modules: [],
        corsServers: ["static.ahygis.com"]
    },
    // 视图初始化配置
    viewOption: {
        constraints: {
            // 禁止旋转
            rotationEnabled: false
        }
    }
};
