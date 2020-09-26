import * as esriLoader from 'esri-loader';
import EObject from '../../../common/eobject';
import DefaultList from './list.default.js';
import LoaderConfig from './loaderConfig';
import Esri from '../esri';

const LoadState = {
    NotLoad: 0,
    Loading: 1,
    Loaded: 2
};

const loadConfig = new LoaderConfig();

/**
 * 使用esriLoader加载模块和样式
 */
export default class extends EObject {
    constructor() {
        super();
        this.moduleList = [];
        this.waitPromise = {};
        //  [{
        //     name: 'esri/views/MapView', // module 名
        //     ready: false, // 是否加载完成
        //     target: {}
        // }];

        this.config = loadConfig;
        this.state = LoadState.NotLoad;
    }

    init() {

        this.state = LoadState.Loading;
        if (this.config.IsOffical) {
            this.loadCss("https://js.arcgis.com/4.6/esri/css/main.css");
        }

        this.loadModules(DefaultList);
    }

    /**
     * Module 已加载完成
     */
    OnReady() {
        return new Promise((reslove, reject) => {
            if (this.state == LoadState.Loaded) {
                reslove(true);
            } else {
                if (this.state == LoadState.NotLoad) {
                    this.init();
                }
                this.$on('loadone', (Target) => {
                    if (this.state != LoadState.Loaded) {
                        if (this.moduleList.findIndex(item => item.ready == false) == -1) {
                            this.state = LoadState.Loaded;
                            reslove(true);
                        }
                    }
                })
            }
        });
    }

    // get ready() {
    //     return this.state == LoadState.Loaded;
    // }

    async loadModules(args) {
        if (this.state == LoadState.NotLoad) {
            this.init();
        }

        if (args) {
            return new Promise(async (resolve, reject) => {
                if (args instanceof Array) {
                    let ps = [];
                    args.forEach(async m => {
                        ps.push(this.load(m).then(r => r).catch(e => e));
                    })
                    Promise.all(ps).then((res) => {
                        resolve(true);
                    }).catch(err => {
                        console.error(err)
                    });

                }
                if (args instanceof String) {
                    await this.load(args);
                    resolve(true);
                }
            })
        }
        else {
            throw `null of args in loadModules`;
        }


    }

    loadCss(url) {
        esriLoader.loadCss(url);
    }

    async load(name) {
        return new Promise(async (resolve, reject) => {
            let record = this.moduleList.find(item => item.name == name);

            if (record && record.ready) {
                resolve(record.target);
            }
            else {

                if (!this.waitPromise[name]) {
                    this.waitPromise[name] = [];
                }
                this.waitPromise[name].push(resolve);

                if (!record) {
                    record = {
                        name: name,
                        ready: false,
                        target: null
                    };

                    this.moduleList.push(record);

                    let Target = await esriLoader.loadModules([name], loadConfig.LoadOptions);
                    record.ready = true;
                    record.target = Target[0];

                    this.buildEsri(name, Target[0]);

                    this.$emit('loadone', Target[0]);

                    this.waitPromise[name].forEach(resv => {
                        resv(true);
                    })

                    delete this.waitPromise[name];
                }
            }
        });
    }

    buildEsri(name, module) {
        let sections = name.split('/');

        let target = Esri,
            moduleName = sections[sections.length - 1];

        for (let i = 1; i < sections.length - 1; i++) {
            let section = sections[i];

            if (target[section] == undefined) {
                Object.assign(target, {
                    [section]: {}
                });
            }

            target = target[section];
        }

        Object.assign(target, {
            [moduleName]: module
        })
    }
};
