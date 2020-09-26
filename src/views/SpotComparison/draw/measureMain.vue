<template>
    <div class="esri-toolkit-measure">
        <div class="sadie-measure-panel">
            <!-- <div class="panel-header" style="">
                <span>测量工具</span>
                <i class="el-icon-close" @click="closeWidget"></i>
            </div> -->
            <div class="panel-main">
                <div class="toolbar">
                    <!-- <button class="action-button esri-icon-blank-map-pin" :class="{active:activeBtn=='point'}" @click="btnClick('point')" type="button" title="Draw point"></button> -->
                    
                    
                    <!-- <button class="action-button esri-icon-polyline" :class="{active:activeBtn=='polyline'}" @click="beginDraw('polyline')" type="button" title="线"></button> -->
                    <!-- <el-tooltip placement="top" content="线">
                        <el-button :type="activeBtn=='polyline' ? 'primary' : ''" circle @click="beginDraw('polyline')">
                            <i class="fa fa-share-alt"></i>
                        </el-button>
                    </el-tooltip> -->
                    
                    <!-- <button class="action-button esri-icon-polygon" :class="{active:activeBtn=='polygon'}" @click="beginDraw('polygon')" type="button" title="多边形"></button> -->
                    <el-tooltip placement="top" content="多边形">
                        <el-button :type="activeBtn=='polygon' ? 'primary' : ''" circle @click="beginDraw('polygon')">
                            <i class="fa fa-bookmark-o"></i>
                        </el-button>
                    </el-tooltip>
                    <!-- <button class="action-button esri-icon-checkbox-unchecked" :class="{active:activeBtn=='rectangle'}" @click="beginDraw('rectangle')" type="button" title="矩形"></button> -->
                    <el-tooltip placement="top" content="矩形">
                        <el-button :type="activeBtn=='rectangle' ? 'primary' : ''" circle @click="beginDraw('rectangle')">
                            <i class="fa fa-square-o"></i>
                        </el-button>
                    </el-tooltip>
                    
                    <!-- <button class="action-button esri-icon-radio-unchecked" :class="{active:activeBtn=='circle'}" @click="beginDraw('circle')" id="circleButton" type="button" title="Draw circle"></button> -->
                    <!-- <button class="action-button esri-icon-radio-unchecked" :class="{active:activeBtn=='ellipse'}" @click="beginDraw('ellipse')" type="button" title="圆"></button> -->
                    
                    <!-- <button class="action-button esri-icon-trash" @click="reset" type="button" title="清除"></button> -->
                </div>

                <div class="toolbar">
                    <el-switch v-model="UpdateEnable" active-color="#13ce66" inactive-text="编辑" style="width:115px">
                    </el-switch>
                    <el-button v-if="drawing" @click="cancelDraw" type="info" size="small">取消绘制</el-button>
                </div>
            </div>
        </div>

        <div class="sadie-measure-view">
            <!-- <div class="sadie-measure-toolbar" v-if="drawing">
                <div class="drawing-bar">
                    <el-button @click="cancelDraw" type="info">取消绘制</el-button>
                </div>
            </div> -->
            <transition enter-active-class="fadeInLeftBig" leave-active-class="fadeOutDown">
                <div class="sadie-measure-toolbar" v-if="UpdateEnable">
                    <div class="editing-bar">
                        <el-tooltip class="item" effect="light" content="编辑属性">
                            <el-button class="edit-toolbar-button" type="info" icon="el-icon-edit" circle @click="editAttributes"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="删除">
                            <el-button class="edit-toolbar-button" type="info" icon="el-icon-close" circle @click="deleteGraphic"></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import "./main.less";
import DrawMixin from "./drawMixin";
import UpdateMixin from "./updateMixin";
import DisplayMixin from "./displayMixin";
export default {
    props: ["position"],
    inject: ["esriMap"],
    mixins: [DrawMixin, UpdateMixin, DisplayMixin],
    data() {
        return {
            lastActiveBtn: "polyline",
            lengthUnit: "meters",
            areaUnit: "mu"
        };
    },
    computed: {
        realAreaUnit(){
            if(this.areaUnit=='mu'){
                return 'square-meters';
            }
            else{
                return this.areaUnit;
            }
        },
        resultList() {
            return this.measureResult.map(item => {
                return item.graphic.attributes;
            });
        }
    },
    watch: {
        activeBtn() {
            if (this.activeBtn != "reset") {
                this.lastActiveBtn = this.activeBtn;
            }
        }
    }
};
</script>

