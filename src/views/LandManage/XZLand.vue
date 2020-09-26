<template>
  <div class="sadie-layer-manager">
    <div class="panel-content">
      <el-collapse>
        <el-collapse-item
          v-for="(item,index) in items"
          :key="index"
        >
          <template slot="title">{{item.title}}</template>
          <el-tree
            :data="item.land"
            @node-click="select"
          ></el-tree>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { esri, task, tasks } from "../../esri";
export default {
  data() {
    return {
      items: [
        {
          title: "园区闲置地块",
          land: [
            {
              label: "当土挂2016-20号"
            }
          ]
        },
        {
          title: "功能区闲置地块",
          land: [
            {
              label: "低碳经济团组"
            },
            {
              label: "生物医药团组"
            },
            {
              label: "智慧物流团组",
              children: [
                {
                  label: "当土挂2016-21号"
                },
                {
                  label: "当土挂2013-22号"
                }
              ]
            },
            {
              label: "智能制造团组",
              children: [
                {
                  label: "当土挂2015-35号"
                }
              ]
            },
            {
              label: "综合服务团组",
              HTQDSJ: ""
            },
            {
              label: "新材料循环经济产业团组",
              HTQDSJ: ""
            },
            {
              label: "科技创新产业团组",
              children: [
                {
                  label: "当土挂2016-58号"
                }
              ]
            },
            {
              label: "现代服务及生产研发团组",
              HTQDSJ: ""
            },
            {
              label: "产业备用团组",
              HTQDSJ: ""
            },
            {
              label: "新桥产业团组",
              children: [
                {
                  label: "当土挂2015-36号"
                },
                {
                  label: "当土挂2016-59号"
                }
              ]
            }
          ]
        },
        {
          title: "企业闲置用地"
        }
      ],
      checked: true
    };
  },
  props: {
    esriMap: {
      type: Object,
      required: true
    }
  },
  mounted() {},
  methods: {
    select(data) {
      let layer = this.esriMap.view.map.layers.filter(l => {
        if (
          !l.capabilities ||
          (l.capabilities instanceof Array &&
            l.capabilities.indexOf("Query") == -1)
        )
          return false;
        return l.label == "闲置用地";
      });

      if (layer && layer.length > 0) {
        layer = layer.items[0];
      } else {
        this.$notify({
          title: "警告",
          message: "请先添加闲置土地图层",
          type: "warning"
        });
      }

      if (data.children) {
        var params = new esri.tasks.support.Query({
          where: `GYBH like '%${data.children.label}%'`,
          distance: 1,
          outFields: ["*"],
          spatialRelationship: "intersects",
          returnGeometry: true
        });
      } else {
        var params = new esri.tasks.support.Query({
          where: `GYBH like '%${data.label}%'`,
          //where:`FID like ${index}`,
          distance: 1,
          outFields: ["*"],
          spatialRelationship: "intersects",
          returnGeometry: true
        });
      }
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
<style lang="less" scoped>
.sadie-layer-manager {
  .el-checkbox {
    display: block;
    margin-left: 15px;
  }
}
</style>
