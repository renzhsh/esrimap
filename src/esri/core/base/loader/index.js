import EsriModuleLoader from './loader';
export const loader = new EsriModuleLoader();
export const ModuleLoader = {
    install: function (EsriMap) {
        EsriMap.prototype.loadModules = (args) => {
            return loader.loadModules(args);
        };

        EsriMap.prototype.loadCss = (args) => {
            return loader.loadCss(args);
        }

        EsriMap.prototype.UseOffical = () => {
            return loader.config.UseOffical();
        }

        EsriMap.prototype.UseUrl = (args) => {
            return loader.config.UseUrl(args);
        }

        EsriMap.prototype.OnReady = () => {
            return loader.OnReady();
        };
    }
};