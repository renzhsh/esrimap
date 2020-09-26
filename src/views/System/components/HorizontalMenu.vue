<template>
  <el-menu
    :default-active="current"
    close="horizontal-menu"
    mode="horizontal"
    @select="handleSelect"
    background-color="transparent"
    text-color='#ffffff'
    active-text-color="399aea"
  >
    <template v-for="(item,index) in list">
      <el-menu-item
        :index="item.url"
        :key="index+'s'"
      >
        <i :class="item.icon"></i>
        <p>{{item.title}}</p>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      current: ""
    };
  },
  mounted() {
    //debugger
    this.current = this.$route.path;
  },
  methods: {
    handleSelect(path) {
      if (path.indexOf("://") > -1) {
        window.open(path);
      } else {
        this.$router.push(path);
      }
    }
  },
  watch: {
    $route(to, from) {
      this.current = to.path;
      // console.log(to.path);
    }
  }
};
</script>
<style lang="less">
.horizontal-menu {
  .el-submenu .is-active {
    .el-submenu__title {
      background-color: #006ad4 !important;
    }
  }

  .el-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0px !important;
  }

  i {
    width: 34px;
    height: 34px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-top: 14px;
  }

  p {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .el-menu-item:hover {
    background-color: #55a7fb !important;
    background-image: linear-gradient(to top, #55a7fb, #0682de);
    border-bottom: 0px !important;
  }
  .el-menu-item [class^="el-icon-"] {
    width: auto;
    font-size: 24px;
  }
}

.el-menu--horizontal {
  .is-active {
    background-color: #55a7fb !important;
    background-image: linear-gradient(to top, #55a7fb, #0682de);
    border-bottom: 0px !important;
  }
}
</style>


