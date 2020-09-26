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
                    <el-tooltip placement="top" content="线">
                        <el-button :type="activeBtn=='polyline' ? 'primary' : ''" circle @click="beginDraw('polyline')">
                            <i class="fa fa-share-alt"></i>
                        </el-button>
                    </el-tooltip>
                    
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
                    <el-tooltip placement="top" content="清除">
                        <el-button type="danger" circle @click="reset" style="margin-right:5px;">
                            <i class="fa fa-trash-o"></i>
                        </el-button>
                    </el-tooltip>


                    <el-select v-if="lastActiveBtn=='polyline'" v-model="lengthUnit" size="small">
                        <el-option v-for="(item,index) in unitList" :key="index" :value="item.value" :label="item.text"></el-option>
                    </el-select>
                    <el-select v-else v-model="areaUnit" size="small">
                        <el-option v-for="(item,index) in unitList" :key="index" :value="item.value" :label="item.text">{{item.text}}</el-option>
                    </el-select>
                </div>

                <div class="toolbar">
                    <!-- <el-switch v-model="UpdateEnable" active-color="#13ce66" inactive-text="编辑" style="width:115px"> -->
                    <!-- </el-switch> -->
                    <el-button @click="exportExcel" type="primary" size="small">导出excel</el-button>
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
                        <el-tooltip class="item" effect="light" content="编辑">
                            <el-button class="edit-toolbar-button" type="info" icon="el-icon-edit" circle @click="editAttributes"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="删除">
                            <el-button class="edit-toolbar-button" type="info" icon="el-icon-close" circle @click="deleteGraphic"></el-button>
                        </el-tooltip>
                    </div>

                </div>
            </transition>
        </div>
        <el-table id="out-table" :data="resultList" style="width: 100%" v-show="false">
            <el-table-column prop="identify" label="名称" width="80">
            </el-table-column>
            <el-table-column prop="type" label="类型">
            </el-table-column>
            <el-table-column prop="measure" label="测量结果">
            </el-table-column>
        </el-table>
        <el-dialog title="地块类型" :visible.sync="chooseType.show" width="30%" center>
            <el-form label-width="60px">
                <el-form-item label="名称">
                    <el-input v-model="chooseType.attributes.identify" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="chooseType.attributes.type" placeholder="请选择">
                        <el-option v-for="item in blockType" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="chooseType.show=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import "./main.less";
import DrawMixin from "./drawMixin";
import UpdateMixin from "./updateMixin";
import DisplayMixin from "./displayMixin";
import FileSaver from "file-saver";
import XLSX from "xlsx";
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
        unitList() {
            if (this.lastActiveBtn == "polyline") {
                // 线
                return [
                    {
                        text: "米",
                        value: "meters"
                    },
                    {
                        text: "公里",
                        value: "kilometers"
                    }
                    // {
                    //     text: "英尺",
                    //     value: "feet"
                    // },

                    // {
                    //     text: "英里",
                    //     value: "miles"
                    // },
                    // {
                    //     text: "海里",
                    //     value: "nautical-miles"
                    // },
                    // {
                    //     text: "码",
                    //     value: "yards"
                    // }
                ];
            } else if (
                ["polygon", "rectangle", "circle", "ellipse"].indexOf(
                    this.lastActiveBtn
                ) > -1
            ) {
                // 面
                return [
                    {
                        text: "亩",
                        value: "mu"
                    },
                    {
                        text: "平方米",
                        value: "square-meters"
                    },
                    {
                        text: "平方千米",
                        value: "square-kilometers"
                    },
                    // {
                    //     text: "公顷",
                    //     value: "hectares"
                    // }
                    // {
                    //     text: "英亩",
                    //     value: "acres"
                    // },
                    // {
                    //     text: "平方英尺",
                    //     value: "square-feet"
                    // },
                    // {
                    //     text: "平方码",
                    //     value: "square-yards"
                    // },
                    // {
                    //     text: "平方英里",
                    //     value: "square-miles"
                    // }
                ];
            }

            return [];
        },
        resultList() {
            return this.measureResult.map(item => {
                return item.graphic.attributes;
            });
        }
    },
    methods: {
        exportExcel() {
            var wb = XLSX.utils.table_to_book(
                document.querySelector("#out-table")
            );
            var wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array"
            });
            try {
                FileSaver.saveAs(
                    new Blob([wbout], { type: "application/octet-stream" }),
                    "测量结果.xlsx"
                );
            } catch (e) {
                if (typeof console !== "undefined") console.log(e, wbout);
            }
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

