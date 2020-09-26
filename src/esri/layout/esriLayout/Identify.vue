<template></template>
<script>
import { esri, loader } from "../../core";
import axios from "axios";
export default {
  inject: ["esriMap"],
  created() {
    (async () => {
      await loader.loadModules([
        "esri/tasks/IdentifyTask",
        "esri/tasks/support/IdentifyParameters"
      ]);
    })();

    let view = this.esriMap.view;

    view.on("click", event => {
      if (this.disable) return;
      let layers = this.getLayer(event.mapPoint);

      this.execute(layers.items, event.mapPoint);
    });
  },
  data() {
    return {
      disable: false,
      IdentifyOption: {
        tolerance: 0,
        layerOption: "visible",
        returnGeometry: true
      }
    };
  },
  methods: {
    execute(layers, mapPoint) {
      let pThreads = [];

      for (var i in layers) {
        ((index, layer) => {
          const vls = layer.allSublayers.items.filter(
            unit => unit.visible === true
          );
          
          pThreads.push(
            this.callIdentify(mapPoint, layer.url, this.esriMap.view, vls)
              .then(result => {
                result.layerIndex = parseInt(index);
                result.mapPoint = mapPoint;
                result.sourceLayer = layer;
                result.results = result.results.filter(
                  rlt => vls.findIndex(value => value.id === rlt.layerId) > -1
                );
                result.results.forEach(rlt => {
                  rlt.feature.sourceLayer = layer;
                });

                return result;
              })
              .catch(ex => ex)
          );
        })(i, layers[i]);
      }

      Promise.all(pThreads).then(result => {
        // 过滤掉没有识别结果的result
        result = result.filter(r => r.results && r.results.length > 0);

        if (result.length > 0) {
          // 获取top-most层识别的result
          let idx = -1,
            ptr;

          result.forEach(r => {
            if (r.layerIndex > idx) {
              idx = r.layerIndex;
              ptr = r;
            }
          });

          this.esriMap.$emit("identify", {
            mapPoint: ptr.mapPoint,
            feature: ptr.results[0].feature,
            popup: (idResults => {
              return () => {
                if (!idResults.sourceLayer.layerInfos) return;
                
                for (const item of idResults.results) {
                  const cl = item.feature.sourceLayer.allSublayers.items.filter(
                    unit => unit.id === item.layerId
                  );
                  if (cl[0].visible) {
                    let metas = idResults.sourceLayer.layerInfos.filter(
                      info => info.id == item.layerId
                    );
                    if (metas && metas.length) {
                      let meta = metas[0];
                      if (meta.popupEnabled !== false) {
                        this.popup(idResults.mapPoint, item.feature, meta);
                      }
                    }
                  }
                }

                // let item = idResults.results[0];

                // const cl = item.feature.sourceLayer.allSublayers.items.filter(
                //   unit => unit.id === item.layerId
                // );
                // if (!cl[0].visible) return;

                // let metas = idResults.sourceLayer.layerInfos.filter(
                //   info => info.id == item.layerId
                // );

                // if (!metas || metas.length == 0) return;

                // let meta = metas[0];

                // // popupEnabled 默认 true
                // if (meta.popupEnabled == false) return;

                // this.popup(idResults.mapPoint, item.feature, meta);
              };
            })(ptr)
          });
        }
      });
    },
    getLayer(point) {
      return this.esriMap.view.map.layers.filter(l => {
        // 不支持 Identify
        if (
          !l.capabilities ||
          (l.capabilities instanceof Array &&
            l.capabilities.indexOf("Query") == -1)
        )
          return false;

        // 禁止 Identify
        if (l.disableIdentify) return false;

        // 触发点不在图层范围内
        if (!l.fullExtent.contains(point)) return false;

        return true;
      });
    },
    callIdentify(point, url, view, vls) {
      let identifyTask = new esri.tasks.IdentifyTask(url);
      let layerIds = [];
      for (const item of vls) {
        layerIds.push(item.id);
      }

      // Set the parameters for the Identify
      let params = new esri.tasks.support.IdentifyParameters(
        Object.assign(this.IdentifyOption, {
          geometry: point,
          // width: option.view.width,
          // height: option.view.height,
          mapExtent: view.extent,
          layerIds: layerIds
        })
      );
      return identifyTask.execute(params);
    },
    popup(location, feature, meta) {
      let attributes = feature.attributes;

      let title = attributes[meta.titleField];

      let template = meta.popupTemplate;

      if (!template) return;

      let hasProps = template && template.fields && template.fields.length;

      let hasRemoteFn = template.remoteUrl && meta.idField;

      if (!hasProps && !hasRemoteFn) {
        this.esriMap.popup.open(location, {
          mode: "title",
          title: title
        });
        return;
      }

      let props = [];
      let propFields = meta.alias.filter(
        f => template.fields.indexOf(f.field) > -1
      );

      propFields.forEach(f => {
        props.push({
          label: f.label,
          text: attributes[f.field]
        });
      });

      if (hasRemoteFn) {
        var url = template.remoteUrl;

        url = url.replace(/:id/g, attributes[meta.idField]);

        axios
          .get(url)
          .then(resp => {
            if (resp.data.Success) {
              let opt = Object.assign(
                {
                  title: title,
                  property: props,
                  actions: template.actions
                },
                resp.data.Data
              );

              this.esriMap.popup.open(location, opt);
            }
          })
          .catch(er => er);
      } else {
        this.esriMap.popup.open(location, {
          title: title,
          property: props,
          actions: template.actions
        });
      }
    },
    setOption(option) {
      Object.assign(this.IdentifyOption, option);
    },
    enable(flag = true) {
      this.disable = !flag;
    }
  }
};
</script>

