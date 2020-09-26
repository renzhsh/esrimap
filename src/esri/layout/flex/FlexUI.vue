<template>
    <flex-view class="saide-flex-ui">
        <flex-grid flexDirection="column" style="height:100%;">
            <flex-grid class="sadie-flex-row">
                <flex-grid ref="tl" :flexFlow="tlProp.flexFlow" :justifyContent="tlProp.justifyContent" :alignItems="tlProp.alignItems" class="sadie-flex-col"></flex-grid>
                <flex-grid ref="tr" :flexFlow="trProp.flexFlow" :justifyContent="trProp.justifyContent" :alignItems="trProp.alignItems" class="sadie-flex-col"></flex-grid>
            </flex-grid>
            <flex-grid class="sadie-flex-row">
                <flex-grid ref="bl" :flexFlow="blProp.flexFlow" :justifyContent="blProp.justifyContent" :alignItems="blProp.alignItems" class="sadie-flex-col"></flex-grid>
                <flex-grid ref="br" :flexFlow="brProp.flexFlow" :justifyContent="brProp.justifyContent" :alignItems="brProp.alignItems" class="sadie-flex-col"></flex-grid>
            </flex-grid>
        </flex-grid>
    </flex-view>
</template>
<script>
import FlexView from "./FlexView";
import FlexGrid from "./FlexGrid";
import FlexUiMixin from "./flexUIMixin";
export default {
    inject: ["esriMap", "viewId"],
    mixins: [FlexUiMixin],
    components: { FlexView, FlexGrid },
    provide: function() {
        return {
            esriMap: this.esriMap
        };
    },
    props: {
        autoMount: {
            // 自动挂接
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tlProp: {
                flexFlow: "column nowrap",
                justifyContent: "flex-start",
                alignItems: "flex-start"
            },
            trProp: {
                flexFlow: "column nowrap",
                justifyContent: "flex-start",
                alignItems: "flex-end"
            },
            blProp: {
                flexFlow: "row nowrap",
                justifyContent: "flex-start",
                alignItems: "flex-end"
            },
            brProp: {
                flexFlow: "column-reverse nowrap",
                justifyContent: "flex-start",
                alignItems: "flex-end"
            }
        };
    },
    methods: {
        setFlex(position, flexProps) {
            switch (position) {
                case "top-left":
                    this.tlProp = Object.assign(this.tlProp, flexProps);
                    break;
                case "top-right":
                    this.trProp = Object.assign(this.trProp, flexProps);
                    break;
                case "bottom-left":
                    this.blProp = Object.assign(this.blProp, flexProps);
                    break;
                case "bottom-right":
                    this.brProp = Object.assign(this.brProp, flexProps);
                    break;
            }
        }
    },
    mounted() {
        document
            .querySelector(`#${this.viewId}` + " .esri-ui")
            .appendChild(this.$el);

        this.esriMap.flexUi = {
            add: (args, position) => {
                this.add(args, position);
            },
            setFlex: (position, flexProps) => {
                this.setFlex(position, flexProps);
            }
        };
    }
};
</script>
<style lang="less">
.saide-flex-ui {
    .sadie-flex-row {
        height: 50%;
        .sadie-flex-col {
            width: 50%;
            display: flex;
            padding: 5px;
        }
    }

    .esri-component {
        margin: 5px;
    }
}
</style>


