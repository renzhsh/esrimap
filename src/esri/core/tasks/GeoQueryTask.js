import {
    esri,
    loader
} from "../base";

export default class {
    async geoQuery(url, geometry, option = {}) {
        await loader.loadModules(["esri/tasks/QueryTask",
            "esri/tasks/support/Query"
        ]);

        let arrs = url.split('/');
        let last = arrs[arrs.length - 1];
        if (last.indexOf('Server') > -1 || last.indexOf('server') > -1) {
            url += '/0';
        }

        var queryTask = new esri.tasks.QueryTask({
            url: url
        });

        var query = new esri.tasks.support.Query(Object.assign({
            geometry: geometry,
            distance: 0,
            outFields: ["*"],
            spatialRelationship: "intersects",
            returnGeometry: true
        }, option));

        return new Promise((resolve, reject) => {
            queryTask
                .execute(query)
                .then(result => {
                    var features = result.features;
                    resolve(features);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
