<template>
    <div>
        <Tree class="esri-visual-card" :option="treeOption" style="left:0;top:100px" @select="queryAndLocate" v-if="treeEnable"></Tree>
        <Search class="esri-visual-card" style="right:20px;top:30px;" :queryFn="query" @select="locate" v-if="searchEnable"></Search>
        <div class="esri-visual-card" style="width:100%;bottom:70px;">
            <TimeLine style="margin:0 auto;" :timeList="timeList" @change="changeLayer" v-if="timeLineEnable"></TimeLine>
        </div>
    </div>
</template>
<script>
import { esri } from "esri";
import SearchMixin from "./searchMixin";
import TimeLineMixin from "./timeLineMixin";
export default {
    mixins: [SearchMixin, TimeLineMixin],
    inject: ["esriMap"]
};
</script>
