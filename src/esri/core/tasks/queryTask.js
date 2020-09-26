import { esri, loader } from "../base";
import axios from 'axios';

class WhereBuilder {
    constructor(source) {
        this.source = source;
    }

    getFields() {
        return new Promise((resolve, reject) => {
            if (!this._fields) {
                let url = this.source.featureLayer.url;
                let arrs = url.split('/');
                let last = arrs[arrs.length - 1];
                if (last.indexOf('Server') > -1 || last.indexOf('server') > -1) {
                    // reject({
                    //     error: 'in QueryTask: feature Url应该是图层地址，而非服务地址'
                    // });
                    url += '/0';
                }
                axios.get(url + '?f=json')
                    .then(resp => {
                        var dat = resp.data;
                        if (dat.error) {
                            reject(dat);
                        }
                        else {
                            this._fields = {};
                            dat.fields.forEach(element => {
                                this._fields[element["alias"]] = element["type"];
                            });
                            resolve(this._fields);
                        }
                    })
            }
            else {
                resolve(this._fields);
            }
        });
    }

    get searchFields() {
        if (!this.source.searchFields) {
            throw 'searchFields cannot be undefined';
        }
        var item = this.source.searchFields;

        if (typeof item == 'string') {
            return [item];
        } else if (item instanceof Array) {
            return item;
        } else {
            throw 'searchFields should be string or array of string';
        }
    }

    get exactMatch() {
        if (this.source.exactMatch === undefined) {
            return false;
        }
        return this.source.exactMatch;
    }

    buildSection(esriTypeObject, field, term) {
        if (typeof esriTypeObject[field] === undefined) {
            console.error(`Field ${field} is not exist`);
            return '1=0';
        }

        switch (esriTypeObject[field]) {
            case 'esriFieldTypeInteger':
            case 'esriFieldTypeOID':
                return `${field} = ${parseInt(term)}`;
            case 'esriFieldTypeDouble':
                return `${field} = ${parseFloat(term)}`;
            case 'esriFieldTypeString':
                if (this.exactMatch) {
                    return `${field} = ${term}`;
                }
                else {
                    return `${field} like '%${term}%'`;
                }
                break;
            case 'esriFieldTypeGeometry':
                console.error(`esriFieldTypeGeometry is not supported in terms of Field '${field}'`);
                return '1=0';
        }
    }

    async build(term) {
        return new Promise((resolve, reject) => {
            var f = this.getFields().then(resp => {
                var result = "";
                this.searchFields
                    .map(field => {
                        if (field == '*') {
                            throw `searchFields is not support '*'`;
                        }
                        return this.buildSection(resp, field, term);
                    })
                    .forEach(sect => {
                        result += sect + ' or ';
                    });

                result = result.substring(0, result.length - 4);

                resolve(result);

            }).catch(error => {
                reject(error);
            });
        });
    }
}

let sourceExample = [{
    featureLayer: {
        title: "太白镇行政村",
        url:
            "/arcgis/rest/services/boundary/TBZXZC/MapServer/0",
        popupTemplate: {}
    },
    searchFields: ["MC"],
    exactMatch: false,
    outFields: ["*"],
}];

export default class {
    async singleSourceQuery(source, term) {
        await loader.loadModules(["esri/tasks/QueryTask",
            "esri/tasks/support/Query"]);
        var featureLayer = source.featureLayer;
        if (!featureLayer) {
            throw 'featureLayer must be provided';
        }
        if (!featureLayer['url']) {
            throw 'featureLayer.url must be provided';
        }

        let url = featureLayer.url;
        let arrs = url.split('/');
        let last = arrs[arrs.length - 1];
        if (last.indexOf('Server') > -1 || last.indexOf('server') > -1) {
            url += '/0';
        }

        var queryTask = new esri.tasks.QueryTask({
            url: url
        });

        var whereClause = await new WhereBuilder(source).build(term);

        var query = new esri.tasks.support.Query({
            returnGeometry: true,
            outFields: source.outFields,
            where: whereClause
        });

        return new Promise((resolve, reject) => {
            queryTask
                .execute(query)
                .then(result => {
                    var features = result.features;
                    features.forEach(f => {
                        f.source = source;
                        f.sourceLayer = f.source.featureLayer;
                        if (f.sourceLayer.popupTemplate) {
                            f.popupTemplate = f.sourceLayer.popupTemplate;
                        }
                    });
                    resolve(features);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async execute(sources, term) {
        let queryResults = [], count = 0;
        return new Promise((resolve, reject) => {
            sources
                .map(s => {
                    return Object.assign({}, {
                        exactMatch: false,
                        outFields: ["*"],
                    }, s);
                })
                .forEach(s => {
                    this.singleSourceQuery(s, term)
                        .then(result => {
                            count++;
                            if (result && result.length) {
                                queryResults.push(...result);
                            }
                            if (count == sources.length) {
                                resolve(queryResults);
                            }
                        })
                        .catch(err => {
                            count++;
                            console.error(err);
                            if (count == sources.length) {
                                resolve(queryResults);
                            }
                        })
                })
        })
    }
};