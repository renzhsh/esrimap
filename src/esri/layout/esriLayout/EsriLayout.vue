<template>
    <div class="sadie-esri-layout" :class="layoutClass">
        <!--定义地图Div-->
        <div :id="viewId" class="sadie-esri-view"></div>
        <div class="sadie-custom-view" v-if="viewReady">
            <InfoWindow ref="popup"></InfoWindow>
            <!-- <Identify ref="identify"></Identify> -->
            <FlexUI></FlexUI>
            <slot></slot>
        </div>
    </div>
</template>
<script>
import { esri, EsriMap } from "../../core";
import LifeCycleMixin from "./lifeCycleMixin";
import FlexUI from "../flex/FlexUI";
import InfoWindow from "./InfoWindow";
import Identify from "./Identify";
export default {
    mixins: [LifeCycleMixin],
    components: { FlexUI, InfoWindow, Identify },
    data() {
        return {
            viewId: "sadie-view-" + Math.round(Math.random() * 1000000),
            layoutClass: "layout-" + Math.round(Math.random() * 1000000),
            esriMap: new EsriMap(),
            viewReady: false
        };
    },
    provide: function() {
        return {
            viewId: this.viewId,
            esriMap: this.esriMap,
            options: this.options
        };
    }
};
</script>
<style lang="less" scoped>
.sadie-esri-layout {
    height: 100%;
    .sadie-esri-view {
        height: 100%;
    }
}
</style>


