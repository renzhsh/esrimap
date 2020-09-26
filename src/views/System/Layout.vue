<template>
  <el-container class="sadie-layout-container">
    <el-header class="sadie-layout-header">
      <TopBanner :list="menu"></TopBanner>
    </el-header>
    <el-main class="sadie-layout-main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import TopBanner from "./components/TopBanner";
import "./styles/global.less";
export default {
  components: {
    TopBanner
  },
  data() {
    return {
      menu: this.$userData.get("Menu")
    };
  }
};
</script>
<style lang="less" scoped>
.sadie-layout-container {
  height: 100%;
  background-color: #c7cde2;

  .sadie-layout-header {
    display: block;
    padding: 0px;
    height: 72px !important;
    background-image: url(./images/top-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    z-index: 999;
  }

  .sadie-layout-main {
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .sadie-asidemenu-container {
    .sadie-asidemenu-switch {
      position: absolute;
      bottom: 20px;
      left: 15px;
      width: 50px;
      height: 50px;
      z-index: 1999;
      pointer-events: all !important;

      i {
        display: block;
        width: 45px;
        height: 50px;
        pointer-events: all !important;
      }

      .asidemenu-switch-open {
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url(./images/menu-open.png);
      }

      .asidemenu-switch-close {
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url(./images/menu-close.png);
      }
    }

    .sadie-layout-wrap {
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>


