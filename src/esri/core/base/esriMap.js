import EObject from '../../common/eobject';

/**
 * 最外层对象，提供简单的操作接口
 */
class EsriMap extends EObject {
    constructor() {
        super();
    }
};

EsriMap.use = (module) => {
    module.install && module.install(EsriMap);
}

export { EsriMap as default };