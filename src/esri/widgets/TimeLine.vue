<template>
    <div class="esri-timeline" :style="{width: timeLineWidth}">
        <div class="timeline-vertical" v-if="direction=='vertical'">
            <div class="timeline-border" :style="{height: timeBorderHeight}"></div>
            <div class="time-node" v-for="(item, index) in timeList" :key="index">
                <div class="time-item transition" :title="item.content" :class="{'time-item-active':activeTime==item.time}" @click="select(item)">
                    <span>{{item.time}}</span>
                </div>
            </div>
        </div>
        <div class="timeline-horizontal" v-else>
            <div class="time-node" v-for="(item, index) in timeList" :key="index">
                <div class="time-item transition" :title="item.content" :class="{'time-item-active':activeTime==item.time}" :style="'left:'+(index * 96)+'px'" @click="select(item)">
                    <span>{{item.time}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        direction: {
            type: String,
            default: "horizontal" //vertical
        },
        timeList: Array
    },
    data() {
        return {
            activeTime: "",
            depth: 0
        };
    },
    computed: {
        timeBorderHeight: function() {
            return (this.timeList.length - 1) * 74 + "px";
        },
        timeLineWidth: function() {
            if (this.direction == "horizontal") {
                return this.timeList.length * 95 + "px";
            } else {
                return "92px";
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.timeList && this.timeList.length) {
                this.timeList.forEach(item => {
                    if (item.active) {
                        this.select(item);
                    }
                });
            }
        },
        select(item, index) {
            if (this.activeTime != item.time) {
                this.activeTime = item.time;
                this.$emit("change", item);
            }
        }
    },
    watch: {
        timeList: function() {
            this.init();
        }
    }
};
</script>
<style lang="less" scoped>
//-------------垂直时间轴样式---------------
.timeline-vertical {
    position: relative;
    width: 92px;

    .timeline-border {
        width: 5px;
        height: 100%;
        position: absolute;
        top: 2px;
        left: 10px;
        bottom: 0;
        border-left: 5px solid #323333;
        opacity: 0.8;
    }

    .time-node {
        width: 88px;
        height: 74px;
        position: relative;
        z-index: 9;
        cursor: pointer;

        &:last-child {
            height: 26px;
        }

        .time-item {
            position: absolute;
            font-size: 12px;
            width: 100%;
            height: 26px;
            text-align: center;
            background: url("./images/right.png");
            background-repeat: no-repeat;
            color: #000;
        }

        .time-item-active {
            font-size: 14px !important;
            background: url("./images/right-on.png");
            color: #fff;
        }
    }
}

//-------------水平时间轴样式---------------

.timeline-horizontal {
    position: relative;
    height: 32px;
    .time-item {
        position: absolute;
        width: 102px;
        height: 32px;
        cursor: pointer;
        text-align: center;
        line-height: 26px;
        font-size: 12px;
        background-image: url("./images/right.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .time-item-active {
        font-size: 14px;
        background-image: url("./images/right-on.png");
        color: #fff;
    }

    span {
        line-height: 30px;
    }
}
</style>
