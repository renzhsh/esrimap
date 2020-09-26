<template>
  <div class="sadie-layer-manager">
    <div class="panel-content">
      <el-collapse>
        <el-collapse-item
          :title="group.title"
          v-for="(group,index) in groups"
          :key="index"
        >
          <el-tree
            ref="tree"
            node-key="label"
            :data="group.nodes"
            show-checkbox
            @check-change="handleCheckChange"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
            >
              <span>
                <!-- <span><i class="esri-icon-drag-horizontal"></i></span> -->
                <span>{{ node.label }}</span>
              </span>
              <el-tooltip
                tooltip-class="opacity-switch-bar"
                effect="light"
                placement="right"
                v-if="!data.children && node.checked"
              >
                <div slot="content">
                  <el-slider
                    v-model="opacity"
                    :max="1"
                    :step="0.1"
                    vertical
                    height="100px"
                  ></el-slider>
                </div>
                <span
                  @mouseover="triggerOpacity(node,data)"
                  title="亮度调节"
                ><i class="esri-icon-environment-settings"></i></span>
              </el-tooltip>
            </span>
          </el-tree>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import LayerControlMixin from "./layerControlMixin";
export default {
  inject: ["esriMap"],
  mixins: [LayerControlMixin],
  props: {
    position: String,
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkedNodes: []
    };
  },
  mounted() {
    this.groups.forEach(g => {
      this.findDefaultChkNodes(g.nodes);
    });

    this.$refs.tree.forEach(tree => {
      tree.setCheckedKeys(this.checkedNodes);
    });
  },
  methods: {
    findDefaultChkNodes(list) {
      if (list && list.length) {
        list.forEach(item => {
          if (item.checked) {
            this.checkedNodes.push(item.label);
          }
          if (item.children && item.children.length) {
            this.findDefaultChkNodes(item.children);
          }
        });
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.addNode(data);
        
        setTimeout(() => {
          const map = this.esriMap.view.map,
            layers = map.layers.items,
            layer = layers.filter(item => item.tag === "dk");
          if (layer && layer.length) {
            map.reorder(layer[0], layers.length - 1);
          }
        }, 3000);
      } else {
        this.removeNode(data);
      }
    }
  }
};
</script>
<style lang="less">
.sadie-layer-manager {
  position: relative;
  min-width: 275px;
  max-width: 300px;
  background: #fff;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  .panel-header {
    width: 100%;
    height: 40px;
    background-color: #409eff;
    border-radius: 5px 5px 0 0;

    .el-icon-close {
      cursor: pointer;
    }

    span {
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      font-size: 19px;
    }

    i {
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }

  .panel-content {
    padding: 10px;
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
      height: 10px;
      background-color: #b5b1b1;
    }

    .el-checkbox__inner {
      z-index: inherit;
    }
  }

  .el-collapse-item__content {
    padding-bottom: 10px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-checkbox:last-of-type {
    margin-right: 5px;
  }
}
.el-slider.is-vertical .el-slider__runway,
.el-slider.is-vertical .el-slider__bar {
  width: 3px!important;
}
.el-slider.is-vertical .el-slider__button-wrapper {
  left: -13px!important;
}
.el-slider__button {
  width: 8px!important;
  height: 8px!important;
}
.el-slider__button-wrapper {
  width: 28px!important;
  height: 28px!important;
}
</style>


