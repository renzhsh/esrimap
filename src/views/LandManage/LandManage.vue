<template>
  <div class="land-manage">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(item,index) in list"
        :key="index"
        :name="index+1"
      >
        <template slot="title">{{item.label}}</template>
        <el-tree
          :data="item.children"
          @node-click="select"
        ></el-tree>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { esri, task, tasks } from "../../esri";
import layers from "@/config/userData/land";
export default {
  props: {
    esriMap: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeNames: [1],
      list: [
        {
          label: "地块列表",
          children: []
        }
      ]
    };
  },
  mounted() {
    setTimeout(() => {
      let params = new esri.tasks.support.Query({
        where: "1=1",
        distance: 1,
        outFields: ["*"],
        spatialRelationship: "intersects",
        returnGeometry: true
      });
      
      const l = layers.layers.filter(item => item.tag === "dk");
      return;
      let task = new esri.tasks.QueryTask({
        url: l[0].nodes[0].url + "/0"
      });
      task.execute(params).then(resp => {
        if (resp.features) {
          let list = [];
          for (const item of resp.features) {
            list.push({
              label: item.attributes["DKMC"]
            });
          }
          this.list[0].children = list;
        }
      });
    }, 1000);
  },
  methods: {
    select(data) {
      let layer = this.esriMap.view.map.layers.items.filter(l => {
        if (
          !l.capabilities ||
          (l.capabilities instanceof Array &&
            l.capabilities.indexOf("Query") == -1)
        ) {
          return false;
        }
        return l.tag === "dk";
      });

      if (layer && layer.length > 0) {
        layer = layer[0];
      } else {
        this.$notify({
          title: "警告",
          message: "请先添加地块图层",
          type: "warning"
        });
      }

      var params = new esri.tasks.support.Query({
        where: `DKMC like '%${data.label}%'`,
        distance: 1,
        outFields: ["*"],
        spatialRelationship: "intersects",
        returnGeometry: true
      });
      let task = new esri.tasks.QueryTask({
        url: layer.url + "/0"
      });

      task.execute(params).then(resp => {
        if (resp.features.length > 0) {
          let feature = resp.features[0];
          this.esriMap.view.goTo(
            {
              center: feature.geometry.centroid,
              zoom: 17
            },
            {
              duration: 300
            }
          );

          setTimeout(() => {
            tasks.flick(this.esriMap.view, feature, [1, 0, 1, 0, 1]);
          }, 300);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.land-manage {
  padding: 10px;
}
</style>
