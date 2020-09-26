<template>
    <div class="sadie-flex-grid" :style="styles">
        <slot></slot>
    </div>
</template>
<script>
export default {
    inject: ["esriMap"],
    props: {
        // 决定主轴的方向
        //row | row-reverse | column | column-reverse
        flexDirection: {
            type: String,
            default: "row"
        },
        // 如果一条轴线排不下，决定如何换行
        // nowrap | wrap | wrap-reverse
        flexWrap: {
            type: String,
            default: "nowrap"
        },
        // <flex-direction> || <flex-wrap>
        flexFlow: {
            type: String
        },
        // 在主轴上的对齐方式
        // flex-start | flex-end | center | space-between | space-around
        justifyContent: {
            type: String,
            default: "flex-start"
        },
        // 在交叉轴上如何对齐
        // flex-start | flex-end | center | baseline | stretch
        alignItems: {
            type: String,
            default: "stretch"
        },
        // 多根轴线的对齐方式
        // flex-start | flex-end | center | space-between | space-around | stretch
        alignContent: {
            type: String,
            default: "stretch"
        }
    },
    computed: {
        _flexFlow() {
            return this.flexFlow
                ? this.flexFlow
                : `${this.flexDirection} ${this.flexWrap}`;
        },
        styles() {
            return {
                "flex-flow": this._flexFlow,
                "justify-content": this.justifyContent,
                "align-items": this.alignItems,
                "align-content": this.alignContent
            };
        }
    }
};
</script>
<style lang="less" scoped>
.sadie-flex-grid {
    display: flex;
}
</style>


