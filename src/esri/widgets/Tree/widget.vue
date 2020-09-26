<template>
    <div id="esri-treem" class="transition esri-tree" :style="{'z-index': zindex}">
        <div class="tree-search">
            <div class="tree-close">
                <fold cont="esri-treem" direction="left"></fold>
            </div>
            <el-input v-model="keyword" placeholder="关键字" class="input-search" clearable="">
            </el-input>
        </div>
        <div class="tree-menu">
            <treeMenu :data="treeData" @select="select" :depth=0></treeMenu>
        </div>
    </div>
</template>
<script>
import treeMenu from "./treeMenu.vue";
import fold from "./fold.vue";
import treeFactory from "./treeFactory";

/**
 * list(id,parent,label)
 */
export default {
  components: {
    treeMenu,
    fold
  },
  props: {
    option: {
      type: Object,
      validator: function(value) {
        return true;
      },
      default: function() {
        return {
          list: [],
          fn: () => {}
        };
      }
    },
    zindex: ""
  },
  data() {
    return {
      keyword: ""
    };
  },
  computed: {
    treeData: function() {
      let list = this.option.list,
        nodes = [];

      if (!list || list.length == 0) {
        return [];
      }

      let fun = this.option.fn;
      if (!fun) {
        fun = item => {
          return item;
        };
      }

      list.forEach(element => {
        nodes.push(Object.assign({}, fun(element)));
      });

      if (this.keyword && this.keyword.length) {
        nodes = nodes.filter(item => {
          return item.label.indexOf(this.keyword) > -1;
        });
      }

      return treeFactory(nodes);
    }
  },
  methods: {
    select(item) {
      this.$emit("select", item);
    }
  }
};
</script>
<style lang="less">
.esri-tree {
  width: 218px;
  background-color: rgba(0, 0, 0, 0.4);
  position: static;
  border-radius: 5px;

  .tree-menu {
    max-height: 197px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: -10px;
  }

  .tree-search {
    width: 218px;
    height: 56px;
  }

  .input-search {
    width: 198px;
    height: 31px;
    margin-top: 7px;
    margin-left: 8px;
  }

  .tree-close {
    position: absolute;
    top: 4px;
    left: 218px;
    width: 35px;
    height: 40px;
  }

  .el-input__inner {
    height: 35px;
  }

  .tree-menu::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
  }
  .tree-menu::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #2e2e2e;
  }
  .tree-menu::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
