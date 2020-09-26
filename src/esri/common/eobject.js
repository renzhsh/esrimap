import Vue from 'vue';

/**
 * 提供基本的消息机制
 */
class EObject {
    constructor() {
        this.iBus = new Vue();
    }

    $emit(event, payload) {
        this.iBus.$emit(event, payload);
    }

    $on(event, fn) {
        this.iBus.$on(event, fn);
    }
};


export default EObject;