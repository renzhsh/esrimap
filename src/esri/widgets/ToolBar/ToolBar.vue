<template>
  <div class="sadie-tool-bar">
    <ul>
      <slot></slot>
      <slot name="index_2"></slot>
      <li
        class="tool-item"
        :class="{'disabled':plusDisable}"
        @click="plus"
      >
        <i class="el-icon-circle-plus-outline"></i>
        <span class="item-text">放大</span>
      </li>
      <slot name="index_3"></slot>
      <li
        class="tool-item"
        :class="{'disabled':minDisable}"
        @click="minus"
      >
        <i class="el-icon-remove-outline"></i>
        <span class="item-text">缩小</span>
      </li>
      <slot name="index_4"></slot>
      <li
        class="tool-item"
        @click="toggle"
      >
        <template v-if="inFullScreen">
          <i class="esri-icon-zoom-in-fixed"></i>
          <span class="item-text">退出全屏</span>
        </template>
        <template v-else>
          <i class="esri-icon-zoom-out-fixed"></i>
          <span class="item-text">全屏</span>
        </template>
      </li>
      <slot name="index_5"></slot>
      <li
        class="tool-item"
        @click="home"
      >
        <i class="esri-icon-home"></i>
        <span class="item-text">重置</span>
      </li>
      <slot name="index_6"></slot>
    </ul>
  </div>
</template>
<script>
import ZoomMixin from "./zoomMixin";
import HomeMixin from "./homeMixin";
import FullMixin from "./fullMixin";
export default {
  props: ["position"],
  inject: ["esriMap"],
  mixins: [ZoomMixin, HomeMixin, FullMixin],
  methods: {
    handle(name) {
      this.esriMap.$emit(name);
    }
  }
};
</script>
<style lang="less">
.sadie-tool-bar {
  position: relative;
  height: 34px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 1px 1px 1px #a8a8a8;
  user-select: none;

  ul,
  li,
  span {
    margin: 0px;
    padding: 0px;
  }

  li {
    list-style: none;
    [class^="esri-icon-"],
    [class^="el-icon-"] {
      vertical-align: middle;
    }
  }

  .tool-item {
    display: inline-block;
    border-right: 1px solid #f0f0f0;
    padding: 5px;
    cursor: pointer;

    &:hover {
      color: #3385ff;
    }

    &.disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: #ebeef5;
    }

    .item-text {
      height: 20px;
      font-size: 10px;
      line-height: 20px;
      padding-right: 5px;
      margin-top: 5px;
    }
  }
}
</style>


