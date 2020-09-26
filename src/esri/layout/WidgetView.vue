<template>
    <div class="sadie-widget-view">
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
    },
    mounted() {
        // 加载组件
        this.$children.forEach(vm => {
            let pos = vm.$props.position;
            if (pos) {
                this.esriMap.flexUi.add(vm.$el, pos);
            }
        });
        this.$emit("loadWidget", this.esriMap);
    }
};
</script>