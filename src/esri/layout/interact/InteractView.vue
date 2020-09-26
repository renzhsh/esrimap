<template>
    <flex-view>
        <div class="sadie-interact-view">
            <div class="interact-toolbar" v-if="isMounted">
                <template v-for="(item,index) in btns">
                    <div class="toolbar-item" :class="{'active':item.label==activeBtn}" @click="toggle(item)" :key="index">
                        <i :class="item.icon"></i>{{item.label}}
                    </div>
                </template>
            </div>

            <div id="panel-shrink" class="interact-panel transition" :style="{'margin-left':offsetLeft}">
                <slot></slot>
                <i class="panel-close" @click="closese" :class="{'icon-open':offsetLeft != 0, 'icon-close':offsetLeft == 0}"></i>
            </div>

            <div class="interact-result">
                <ResultPanel></ResultPanel>
            </div>
        </div>
    </flex-view>
</template>
<script>
import FlexView from "../flex/FlexView";
import ResultPanel from "./resultPanel";
export default {
    inject: ["esriMap"],
    components: { FlexView, ResultPanel },
    provide() {
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
    data() {
        return {
            activeBtn: "",
            isMounted: false,
            lastActiveItem: null,
            offsetLeft: 0
        };
    },
    computed: {
        btns() {
            return this.$slots.default
                .map(item => item.componentInstance)
                .filter(item => item);
        }
    },
    mounted() {
        this.isMounted = true;
        this.esriMap.view.padding = {
            left: 60
        };

        setTimeout(() => {
            let actives = this.btns.filter(item => item.active);

            if (actives && actives.length) {
                this.toggle(actives[0]);
            }
            else{
                this.toggle(this.btns[0]);
            }
        }, 300);
    },
    methods: {
        toggle(item) {
            this.offsetLeft = 0;

            if (item.IsCommand) {
                item.trigger();
                this.esriMap.$emit('interact:trigger',item);
            } else {
                this.activeBtn = item.label;

                item.toggle(this.activeBtn);
                this.lastActiveItem &&
                    this.lastActiveItem.toggle(this.activeBtn, this.close);

                this.lastActiveItem = item;
                this.esriMap.$emit('interact:active',item);
            }
        },
        closese() {
            let width = document.getElementById('panel-shrink').clientWidth;

            this.offsetLeft == 0
                ? (this.offsetLeft = `-${width}px`)
                : (this.offsetLeft = 0);
        }
    }
};
</script>
<style lang="less">
@import "./styles.less";
</style>
