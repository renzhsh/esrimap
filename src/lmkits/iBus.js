import Vue from 'vue';

const iBus = new Vue();

/**
 * 提供基本的消息机制
 */
class EObject {
    $emit(event, payload) {
        iBus.$emit(event, payload);
    }

    $on(event, fn) {
        iBus.$on(event, fn);
    }
};


export default EObject;
