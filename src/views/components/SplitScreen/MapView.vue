<template>
    <WidgetView>
        <Tools style="flex-shrink:0;" position="top-left" @toggle="toggle"></Tools>
        <sd-layer-manager :groups="groups" position="top-left" v-show="show"></sd-layer-manager>
    </WidgetView>
</template>
<script>
import { esri, tasks } from "esri";
import lmkits from "@/lmkits";
import Tools from "./tools";
export default {
    components: { Tools },
    props: {
        groups: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            show: false
        };
    },
    methods: {
        toggle() {
            this.show = !this.show;
        }
    }
};
</script>