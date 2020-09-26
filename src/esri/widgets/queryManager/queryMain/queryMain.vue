<template>
  <div class="saide-query-manager">
    <el-tabs
      type="border-card"
      style="height:259px;"
    >
      <el-tab-pane label="属性查询">
        <QueryTab
          :layerInfos="layerInfos"
          @submitJob="executeJob"
        ></QueryTab>
      </el-tab-pane>
      <el-tab-pane label="空间查询">
        <GeoTab
          :layerInfos="layerInfos"
          @submitJob="executeJob"
        ></GeoTab>
      </el-tab-pane>
    </el-tabs>
    <div class="sadie-searchlist">
      <no-data v-if="!queryResults.length" text="无查询数据" style="margin-top:20px;">
      </no-data>
      <div
        class="list-title"
        v-if="queryResults.length"
      >
        <span class="list-title-result">查询结果({{queryResults.length}})</span>
        <el-button
          size="mini"
          round
          type="warning"
          @click="clear"
        >清除</el-button>
      </div>
      <ul
        class="list-body"
        v-if="queryResults.length"
      >
        <li
          class="searchlist-wrap"
          @click="locateMarker(item)"
          v-for='(item, index) in queryResults'
          :key="index"
        >
          <div class="searchlist-left">
            <i class="el-icon-location"></i>
          </div>
          <div class="searchlist-right">
            <p class="searchlist-name">{{item.label}}</p>
            <p class="searchlist-type"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { esri, loader } from "../../../core";
import QueryTab from "../queryTab";
import GeoTab from "../geoTab";
import MarkerMixin from "./markerMixin";
import NoData from "@/views/components/NoData";
export default {
  inject: ["esriMap"],
  mixins: [MarkerMixin],
  components: { QueryTab, GeoTab, NoData },
  provide() {
    return {
      esriMap: this.esriMap
    };
  },
  data() {
    return {
      tempGraphicsLayer: null,
      layerInfos: [],
      queryResults: [
        // {
        //     label: "",
        //     mapPoint: ""
        // }
      ]
    };
  },
  created() {
    (async () => {
      await loader.loadModules([
        "esri/tasks/QueryTask",
        "esri/tasks/IdentifyTask",
        "esri/tasks/support/Query",
        "esri/tasks/support/IdentifyParameters",
        "esri/widgets/Sketch/SketchViewModel",
        "esri/Graphic"
      ]);
    })();

    this.esriMap.view.on(["layerview-create", "layerview-destroy"], event => {
      this.layerInfos = this.getLayerInfos();
    });

    this.tempGraphicsLayer = this.esriMap.view.graphics;
  },
  methods: {
    locateMarker(info) {
      this.esriMap.view.goTo(info.mapPoint);

      this.showPopup(info);
    },
    clear() {
      this.tempGraphicsLayer.removeAll();
      this.queryResults = [];
      this.esriMap.popup.close();
    },
    getLayerInfos() {
      let queryServers = this.esriMap.view.map.layers.filter(l => {
        // 不支持 Identify
        if (
          !l.capabilities ||
          (l.capabilities instanceof Array &&
            l.capabilities.indexOf("Query") == -1)
        )
          return false;
        if (!l.layerInfos) return false;
        return true;
      });

      let infos = [];

      queryServers.forEach(srv => {
        srv.layerInfos.forEach(l => {
          infos.push(
            Object.assign({}, l, {
              url: `${srv.url}/${l.id}`
            })
          );
        });
      });

      return infos;
    },
    executeJob(payload) {
      this.clear();
      let threads = Array.isArray(payload) ? payload : [payload];
      let ps = [];
      threads.forEach(t => {
        ps.push(
          t.task
            .execute(t.params)
            .then(resp => {
              return resp.features.map(f => {
                f.info = t.info;
                return f;
              });
            })
            .catch(er => er)
        );
      });

      Promise.all(ps).then(resp => {
        let features = [];

        resp.forEach(r => {
          features = [...features, ...r];
        });

        this.showMarkers(features);
      });
    }
  }
};
</script>
<style lang="less">
.saide-query-manager {
  width: 350px;

  .sadie-searchlist {
    position: absolute;
    bottom: 0px;
    width: 100%;
    top: 261px;
    opacity: 1;
    // background-color: whitesmoke;
    background-color: #fff;

    .list-title {
      height: 40px;
      line-height: 40px;
      margin-left: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 10px;
      .list-title-result {
        font-size: 14px;
        color: #a2a2a2;
      }
    }

    .list-body {
      position: absolute;
      top: 50px;
      bottom: 0px;
      width: 100%;
      overflow-y: auto;

      .searchlist-wrap {
        margin: 0px 20px;
        display: flex; /*设置为flex布局*/
        justify-content: flex-start;
        align-items: center;
        height: 36px;
        // border-bottom: 1px solid #efefef;
        cursor: pointer;
        div {
          flex: none;
        }

        .searchlist-left {
          width: 40px;
          height: 40px;
        }

        .searchlist-right {
          margin-left: 10px;
        }

        .el-icon-location {
          width: 40px;
          font-size: 24px;
          line-height: 40px;
          text-align: center;
          color: red;
        }

        .searchlist-name {
          font-size: 14px;
          color: #409eff;
        }

        .searchlist-type {
          font-size: 13px;
          margin-top: 5px;
        }
      }
      .searchlist-wrap:hover {
        background-color: #f7f7f7;
      }
    }
  }

  .el-tabs--border-card > .el-tabs__content {
    padding: 5px;
  }

  .el-form {
    padding: 10px;
    padding-bottom: 0;
  }
}
</style>


