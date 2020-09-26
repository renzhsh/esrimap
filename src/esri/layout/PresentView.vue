<template>
    <div class="sadie-present-view">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inject: ["esriMap", "viewId"],
    provide: function() {
        return {
            esriMap: this.esriMap
        };
    },
    props: {
        autoMount: {
            // 自动挂接
            type: Boolean,
            default: true
        }
    }
};
</script>
<style lang="less">
.sadie-present-view {
    width: 100%;
    height: 100%;
    .esri-visual-card {
        pointer-events: all;
    }
}
</style>

