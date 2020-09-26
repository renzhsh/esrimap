<template>
    <div class="interact-content" v-show="IsActive">
        <div class="title" v-if="title">
            <slot name='title'>
                {{title }}
            </slot>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    inject: ["esriMap"],
    props: {
        label: String,
        icon: String,
        title: String,
        active: Boolean,
        IsCommand: Boolean,
        callbackFn: Function
    },
    data() {
        return {
            currentActiveLabel: ""
        };
    },
    computed: {
        IsActive() {
            return this.label == this.currentActiveLabel;
        }
    },
    methods: {
        toggle(label) {
            this.currentActiveLabel = label;
        },
        triggle() {
            this.callbackFn && this.callbackFn();
        }
    }
};
</script>