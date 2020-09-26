<template>
    <sd-split-screen ref="split" :buildMap="CreateMap">
        <MapView slot="left" :groups="groups"></MapView>
        <MapView slot="right" :groups="groups"></MapView>
    </sd-split-screen>
</template>
<script>
import { esriUtils } from "esri";
import MapView from "./MapView";
export default {
    inject: ["esriMap"],
    components: { MapView },
    props: {
        mapOption: {
            type: Object,
            required: true
        },
        groups: {
            type: Array,
            required: true
        }
    },
    created() {
        this.esriMap.$on("splitscreen", () => {
            this.$refs.split.open();
        });
    },
    methods: {
        async CreateMap() {
            let map = esriUtils.createMap(this.mapOption);

            return Promise.resolve(map);
        }
    }
};
</script>