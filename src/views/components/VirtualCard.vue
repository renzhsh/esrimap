<template>
    <div>
        <div class="esri-virtual-background" :style="{ background: bg}"></div>
        <div class="esri-virtual-solt">
            <slot ></slot>
        </div>
    </div>   
</template>
<script>
export default {
  props: {
    bg: String
  }
};
</script>
<style lang="less" scoped>
.esri-virtual-background {
  position: absolute;
  height: 100%;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  background-color: whitesmoke;
}

.esri-virtual-solt {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}
</style>


