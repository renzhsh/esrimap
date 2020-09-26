import { esri, loader } from "../base";
import axios from 'axios';

export default class GPTasks {
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
            if (p.dataType == 'GPFeatureRecordSetLayer') {
                params[p.name] = featureset;
            } else if (p.dataType == 'GPLinearUnit') {
                params[p.name] = linearUnit;
            }
        });

        let jobInfo = await gp.submitJob(params);

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