import { esri, loader } from "../../core";
import axios from 'axios';

class GPTasks {
    /**
     * option
     * @param {*} outSpatialReference The spatial reference of the output geometries.
     * @param {*} processSpatialReference  The spatial reference that the model will use to perform geometry operations.
     * @param {*} distince  default 1
     * @param {*} unit  feet | kilometers(default) | meters | miles | nautical-miles | yards
     */
    async callGP(url, graphics, option) {
        await loader.loadModules(["esri/tasks/Geoprocessor", "esri/tasks/support/FeatureSet", "esri/tasks/support/LinearUnit"]);
        let resp = (await axios.get(`${url}?f=pjson`)).data;

        if (resp.error) {
            console.error(resp.error.message);
            return;
        }

        let meta = resp;

        let outParams = meta.parameters.filter(item => item.direction == 'esriGPParameterDirectionOutput');
        let inParams = meta.parameters.filter(item => item.direction == 'esriGPParameterDirectionInput');

        let gp = new esri.tasks.Geoprocessor(Object.assign({ url: url }, option));

        let featureset = new esri.tasks.support.FeatureSet();
        featureset.features = Array.isArray(graphics) ? graphics : [graphics];

        let linearUnit = new esri.tasks.support.LinearUnit();
        linearUnit.distance = (option && option.distince) || 1;
        linearUnit.units = (option && option.unit) || 'kilometers';

        let params = {};

        inParams.forEach(p => {
            if (p.name == 'InputPolygon') {
                params[p.name] = featureset;

            } else if (p.name == 'Featurelayer') {
                params[p.name] = {
                    url: 'http://arcgis.mascj.com:81/arcgis/rest/services/GPDLTB/MapServer/0/query?where=1%3D1&f=json'
                };
            }

            // if (p.displayName == 'ContaminatedAreas') {
            //     // params[p.name] = featureset;
            //     params[p.name] = {
            //         url: 'http://192.168.0.210:6080/arcgis/rest/services/China/MapServer/1/query?where=1%3D1&f=json'
            //     };
            // } else if (p.displayName == 'res2_4m') {
            //     params[p.name] = {
            //         url: 'http://192.168.0.221:6080/arcgis/rest/services/China/MapServer/0/query?where=1%3D1&f=json'
            //     };
            // }
        });

        let jobInfo = await gp.submitJob(params);

        console.dir(jobInfo)

        if (["job-timed-out", "job-failed"].indexOf(jobInfo.jobStatus) > -1) {
            throw jobInfo.messages;
        }

        if (jobInfo.jobStatus == "job-succeeded") {
            let pthreads = [];

            outParams.forEach(out => {
                pthreads.push(gp.getResultData(jobInfo.jobId, out.name).then(r => {
                    let res = {};
                    res[out.name] = r;
                    return res;
                }).catch(e => e));
            });

            let gpResults = await Promise.all(pthreads);

            // Array ==> Object
            let result = {};
            for (var item of gpResults) {
                Object.assign(result, item);
            }

            return result;
        }
    }
}

export default new GPTasks();