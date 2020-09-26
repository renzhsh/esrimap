<template>
    <FlexView class="sadie-split-screen" v-if="show">
        <el-row :gutter="20" class="split-screen-wrapper">
            <el-col :span="12" class="split-screen-col enable-point-event right-border">
                <div class="screen-item">
                    <EsriLayout :buildMap="buildMap" :esriInitOption="esriInitOption" :viewOption="viewOption" @viewSetup="arg=>viewSetup('left',arg)">
                        <PresentView>
                            <cross></cross>
                        </PresentView>
                        <slot name="left"></slot>
                    </EsriLayout>
                </div>
            </el-col>
            <el-col :span="12" class="split-screen-col enable-point-event">
                <div class="screen-item">
                    <EsriLayout :buildMap="buildMap" :esriInitOption="esriInitOption" :viewOption="viewOption" @viewSetup="arg=>viewSetup('right',arg)">
                        <PresentView>
                            <cross></cross>
                        </PresentView>
                        <slot name="right"></slot>
                    </EsriLayout>
                </div>
            </el-col>
        </el-row>
        <div class="split-screen-tools">
            <el-tooltip class="item enable-point-event" effect="dark" content="关闭">
                <el-button type="info" icon="el-icon-close" circle @click="show=false"></el-button>
            </el-tooltip>
        </div>
    </FlexView>
</template>
<script>
import Cross from "./cross";
export default {
    inject: ["esriMap"],
    components: { Cross },
    props: {
        buildMap: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            show: false,
            leftView: null,
            rightView: null,
            leftViewMoving: false,
            rightViewMoving: false
        };
    },
    computed: {
        esriInitOption() {
            return this.esriMap.context.config.esriInitOption;
        },
        viewOption() {
            return this.esriMap.context.config.viewOption;
        }
    },
    methods: {
        open() {
            this.show = true;
        },
        close() {
            this.show = false;
        },
        loadWidget(esriMap) {
            let view = esriMap.view;

            view.ui.remove("attribution");
            view.ui.remove("zoom");
        },
        viewSetup(pos, esriMap) {
            this.loadWidget(esriMap);

            if (pos == "left") {
                this.leftView = esriMap.view;
            }
            if (pos == "right") {
                this.rightView = esriMap.view;
            }

            if (this.leftView && this.rightView) {
                this.leftView.watch("viewpoint", viewpoint => {
                    if (this.leftViewMoving) {
                        this.rightView.goTo(viewpoint);
                    }
                });

                this.rightView.watch("viewpoint", viewpoint => {
                    if (this.rightViewMoving) {
                        this.leftView.goTo(viewpoint);
                    }
                });

                this.leftView.on(["drag", "mouse-wheel"], args => {
                    this.leftViewMoving = true;
                    this.rightViewMoving = false;
                });
                this.rightView.on(["drag", "mouse-wheel"], args => {
                    this.leftViewMoving = false;
                    this.rightViewMoving = true;
                });

                // 没有拖动前，确定主导的view
                this.leftView.on(["pointer-enter"], args => {
                    if (!this.leftViewMoving && !this.rightViewMoving) {
                        this.leftViewMoving = true;
                    }
                });
                this.rightView.on(["pointer-enter"], args => {
                    if (!this.leftViewMoving && !this.rightViewMoving) {
                        this.rightViewMoving = true;
                    }
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
.sadie-split-screen {
    position: relative;
    z-index: 999;
    .enable-point-event {
        pointer-events: all;
    }

    .split-screen-wrapper {
        height: 100%;
        margin: 0 !important;

        .split-screen-col {
            height: 100%;
            padding: 0 !important;
        }

        .right-border {
            border-right: 2px solid aquamarine;
        }
    }
    .screen-item {
        height: 100%;
    }
    .split-screen-tools {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;

        .item {
            margin: 10px 10px 0 0;
        }
    }
}
</style>


