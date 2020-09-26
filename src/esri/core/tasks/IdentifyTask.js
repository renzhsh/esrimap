import { esri, loader } from '../base';

export default class {
    async execute(event, option) {
        let result = await loader.loadModules(["esri/tasks/IdentifyTask",
            "esri/tasks/support/IdentifyParameters"]);
        let identifyTask = new esri.tasks.IdentifyTask(option.url);

        // Set the parameters for the Identify
        let params = new esri.tasks.support.IdentifyParameters(Object.assign({
            tolerance: 3,
            // layerIds: [0],
            layerOption: 'all',
            geometry: event.mapPoint,
            // width: option.view.width,
            // height: option.view.height,
            mapExtent: option.view.extent,
            returnGeometry: true
        }, option));

        return identifyTask.execute(params);
    }
}