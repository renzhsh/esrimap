<template>
    <i class="fold-close" @click="onClick" :class="iconClasses"></i>
</template>
<script>
export default {
  props: {
    cont: String,
    direction: String
  },
  data() {
    return {
      shrinkMask: false
    };
  },
  computed: {
    iconClasses() {
      return {
        "caret-left":
          (!this.shrinkMask && this.direction == "left") ||
          (this.shrinkMask && this.direction == "right"),
        "caret-right":
          (this.shrinkMask && this.direction == "left") ||
          (!this.shrinkMask && this.direction == "right")
      };
    }
  },
  methods: {
    onClick(item) {
      var dom = document.getElementById(this.cont);
      var width = dom.offsetWidth;
      var direction = 0;

      this.shrinkMask ? (direction = 0) : (direction = `-${width}`);
      if (this.direction == "left") dom.style.left = `${direction}px`;
      if (this.direction == "right") dom.style.right = `${direction}px`;
      this.shrinkMask = !this.shrinkMask;
    }
  }
};
</script>
<style lang="less" scoped>
.esri-tree {
  .fold-close {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #ffd14a;
    display: inline-block;
    cursor: pointer;
    background-size: 62%;
  }

  .caret-left {
    background-image: url("../images/close.png");
    background-repeat: no-repeat;
  }

  //   .caret-left:hover {
  //     background-image: url("../images/close-hover.png");
  //     background-repeat: no-repeat;
  //   }

  .caret-right {
    background: url("../images/open.png");
    background-repeat: no-repeat;
  }

  //   .caret-right:hover {
  //     background: url("../images/open-hover.png");
  //     background-repeat: no-repeat;
  //   }
}
</style>
