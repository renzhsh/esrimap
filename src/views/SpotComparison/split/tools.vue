<template>
  <el-button type="info" icon="esri-icon-layers" @click="handle"></el-button>
</template>
<script>
export default {
  props: ["position"],
  methods: {
    handle() {
      this.$emit("toggle");
    }
  }
};
</script>
