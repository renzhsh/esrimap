<template>
    <div class="saide-geoquery-tab">

        <el-form label-width="80px">
            <p style="margin-top:0px;">查询要素：</p>
            <el-checkbox-group v-model="selected" v-if="layerInfos.length">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="(item) in layerInfos" :key="item.title + item.id">
                        <el-checkbox :label="item.title"></el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
            <span v-else class="tips">暂无可查询要素</span>
        </el-form>
        <el-button class="query-button" type="primary" @click="getFeature('box')" size="mini">框选查询</el-button>
        <el-button class="query-button" type="primary" @click="getFeature('feature')" size="mini">拾取要素查询</el-button>
    </div>
</template>
<script>
import { esri } from "../../../core";
import BoxMixin from "./boxMixin";
import FeatureMixin from "./featureMixin";
export default {
    inject: ["esriMap"],
    mixins: [BoxMixin, FeatureMixin],
    props: {
        layerInfos: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tempGraphicsLayer: null,
            polygonSymbol: {
                // symbol used for polygons
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                // color: "red",
                style: "cross",
                outline: {
                    color: "rgba(138,43,226, 1)",
                    width: 1
                }
            },
            selected: []
        };
    },
    created() {
        this.tempGraphicsLayer = this.esriMap.view.graphics;
    },
    methods: {
        getFeature(mode) {
            if (!this.selected || this.selected.length == 0) {
                this.$notify({
                    title: "警告",
                    message: "请选择要查询的要素",
                    type: "warning"
                });
                return;
            }

            this.tempGraphicsLayer.removeAll();

            if (mode == "box") {
                this.startBoxSelect();
            } else if (mode == "feature") {
                this.startFeatureSelect();
            }
        },
        callQueryTask(geometry) {
            var params = new esri.tasks.support.Query({
                geometry: geometry,
                distance: 1,
                outFields: ["*"],
                spatialRelationship: "intersects",
                returnGeometry: true
            });

            let tuples = [];

            this.layerInfos
                .filter(info => this.selected.indexOf(info.title) > -1)
                .forEach(info => {
                    tuples.push({
                        task: new esri.tasks.QueryTask({
                            url: info.url
                        }),
                        params: params,
                        info: info
                    });
                });

            this.esriMap.view.goTo(geometry)

            this.$emit("submitJob", tuples);
        }
    }
};
</script>
<style lang="less" scoped>
.saide-geoquery-tab {
    padding:5px;

    p {
        margin: 20px 0;
    }
    .tips {
        font-size: 14px;
        color: #cbcccd;
    }

    .clear {
        color: #409eff;
        margin-left: 10px;
    }

    .query-button {
        margin-top: 30px;
        margin-left: 33px;
    }

    .el-checkbox-group {
        margin-top:30px;
    }
}
</style>
