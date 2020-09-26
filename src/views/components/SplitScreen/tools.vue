<template>
    <el-tooltip effect="dark" content="图层管理">
        <el-button type="info" icon="esri-icon-layers" @click="handle"></el-button>
    </el-tooltip>
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
