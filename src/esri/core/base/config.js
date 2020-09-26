import esri from './esri';
import EObject from '../../common/eobject';

/**
 * esri的配置类
 */
class Config extends EObject {
    constructor() {
        super();
        this.corsServers = [];
        this.corsWaiting = false;
    }

    // 设置跨域
    pushCorsServers(args) {
        if (args) {
            if (args instanceof Array) {
                this.corsServers.push(...args);
            }
            if (args instanceof String) {
                this.corsServers.push(args);
            }
        }
        if (esri.config) {
            esri.config.request.corsEnabledServers.push(...this.corsServers);
            this.corsServers = [];
        } else {
            if (!this.corsWaiting) {
                this.$on('ready', () => {
                    if (!esri.config) throw 'config.pushCorsServers failed, esri.config is undefined';
                    esri.config.request.corsEnabledServers.push(...this.corsServers);
                    this.corsServers = [];
                    this.corsWaiting = false;
                });
                this.corsWaiting = true;
            }
        }
    }
};

export default {
    install: function(EsriMap) {
        EsriMap.prototype.config = new Config();
    }
}
