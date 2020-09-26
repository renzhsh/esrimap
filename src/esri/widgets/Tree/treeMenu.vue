<template>
  <ul>
    <li v-for='(item, index) in data' :key="index" :class="[item.children ? 'has-children' :'has-nochildren' , labelClasses]">
      <p class="label-wrapper" @click='toggleChildren($event, item)' :class="firstpClasses">
        <i :style="indent" v-if="item.children" class="fa" :class="iconClasses"></i>
        <i :style="indent" v-if="!item.children" class="no-fa"></i>
        <i v-if="!item.children" class="no-child-i el-icon-location-outline"></i>
        <span>{{item.label}}</span>
      </p>

      <tree-menu :data='item.children' @select="select" :depth="depth + 1" class="is-focusable" mask="close"></tree-menu>
    </li>
  </ul>
</template>
<script>
import treeMenu from "./treeMenu.vue";
export default {
  name: "treeMenu",
  props: ["data", "depth"],
  data() {
    return {
      showChildren: false
    };
  },
  computed: {
    iconClasses() {
      return {
        "el-icon-arrow-right": !this.showChildren,
        "el-icon-arrow-down": this.showChildren
      };
    },
    labelClasses() {
      return { "has-border": this.depth == 0 };
    },
    firstpClasses() {
      return { "first-p": this.depth == 0 };
    },
    indent() {
      return `margin-left:${this.depth * 12}px`;
    }
  },
  methods: {
    select(item) {
      this.$emit("select", item);
    },
    toggleChildren(event, item) {
      if (!item.children) {
        this.select(item);
      }
      if (!item.children) return;
      var el = event.currentTarget;
      var next = $(el).next();
      var mask = next.attr("mask");

      if (mask == "close") {
        next.removeClass("is-focusable").addClass("is-expanded");
        next.attr("mask", "open");
      }

      if (mask == "open") {
        next.removeClass("is-expanded").addClass("is-focusable");
        next.attr("mask", "close");
      }

      this.showChildren = !this.showChildren;
    }
  }
};
</script>
<style lang="less">
.esri-tree {
  .label-wrapper {
    line-height: 30px;
    height: 30px;
    color: #fff;
    font-size: 15px;
    background-color: rgba(0, 0, 0, 0.4);
    margin-left: 10px;
    margin-top: 7px;
    border-bottom: 1px solid gray;
    cursor: pointer;
  }

  .first-p {
    background-color: transparent !important;
    border: 0 !important;
  }
  .has-children {
    cursor: pointer;
  }

  .has-nochildren {
    cursor: default;
  }

  .has-border {
    border-bottom: 1px solid #606266;
  }

  .fa {
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  }

  .no-fa {
    width: 14px;
    height: 14px;
    display: inline-block;
  }

  .no-child-i {
    width: 16px;
    height: 16px;
    float: right;
    margin-top: 5px;
    margin-right: 5px;
  }
  .label-wrapper span {
    display: inline-block;
    margin-left: 2px;
  }

  .label-wrapper:hover {
    color: #e87819;
  }

  .is-expanded {
    display: block;
  }

  .is-focusable {
    display: none;
  }
}
</style>
