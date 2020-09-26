<template>
    <div class="gallery-container">
        <div class="gallery-maptype" @mouseenter="mainOver" @mouseleave="mainLeave" :class="{'expand' : expandMask}">
            <template v-for="(item,index) in items">
                <div class="gallery-card" :class="{'gallery-sl': item.tag == 'vector' , 'gallery-yx': item.tag == 'image'}" :key="index" @click="change(item, index)">
                    <span class="gallery-card-text" :class="{'active' : activeTag == item.tag}">{{item.title}}</span>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { esri } from "../core";
import { esriUtils } from "../core";
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        position: String
    },
    inject: ["esriMap"],
    created() {
        this.items.forEach(item => {
            if (item.active) {
                this.activeTag = item.tag;
            }
        });
    },
    data() {
        return {
            activeTag: "",
            expandMask: false
        };
    },
    methods: {
        change(item, index) {
            let basemapLayers = item.basemaps;

            var basemap = esriUtils.createBaseMap(basemapLayers);

            this.esriMap.view.map.basemap = basemap;

            this.activeTag = item.tag;
        },
        mainOver() {
            this.expandMask = true;
        },
        mainLeave() {
            this.expandMask = false;
        }
    }
};
</script>
<style lang="less" scoped>
.gallery-container {
    position: relative;
    .gallery-maptype {
        height: 80px;
        cursor: pointer;
        -webkit-transition-duration: 0.4s;
        transition-duration: 0.4s;
        width: 110px;
        background-color: rgba(255, 255, 255, 0);
    }

    .gallery-card {
        height: 60px;
        width: 86px;
        position: absolute;
        border-radius: 2px;
        top: 10px;
        box-sizing: border-box;
        border: 1px solid rgba(153, 153, 153, 1);

        -webkit-transition-duration: 0.4s;
        transition-duration: 0.4s;

        .gallery-card-text {
            position: absolute;
            bottom: 0;
            right: 0;
            display: block;
            font-size: 12px;
            height: 20px;
            width: 84px;
            line-height: 14px;
            color: #fff;
            border-top-left-radius: 2px;
            line-height: 21px;
            text-align: center;
        }
    }

    .gallery-yx {
        background-image: url(/images/yx.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        right: 5px;
        // z-index: 2;
    }

    .gallery-sl {
        background-image: url(/images/sl.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        right: 5px;
    }

    .active {
        background-color: #409eff;
    }
}

.gallery-sl {
    right: 20px !important;
}

.expand .gallery-maptype {
    width: 196px !important;
}
.expand .gallery-sl {
    right: 100px !important;
}
</style>


