<template>
    <div class="sadie-flex-view">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inject: ["esriMap"]
};
</script>
<style lang="less" scoped>
.sadie-flex-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>