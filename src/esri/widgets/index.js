import Measure from './measure';
import Search from './Search';
import Tree from './Tree';
import TimeLine from './TimeLine';
import Gallery from './gallery';
import ToolBar from './ToolBar';
import Print from './Print';
import LayerManager from './LayerManager';
import SplitScreen from './SplitScreen';
import QueryManager from './queryManager';

export default [
    (Vue) => {
        Vue.component('Search', Search)
    },
    (Vue) => {
        Vue.component('Tree', Tree)
    },
    (Vue) => {
        Vue.component('TimeLine', TimeLine)
    },
    (Vue) => {
        Vue.component('sd-gallery', Gallery)
    },
    (Vue) => {
        Vue.component('sd-tool-bar', ToolBar)
    },
    (Vue) => {
        Vue.component('sd-print', Print)
    },
    (Vue) => {
        Vue.component('sd-measure', Measure)
    },
    (Vue) => {
        Vue.component('sd-layer-manager', LayerManager)
    },
    (Vue) => {
        Vue.component('sd-split-screen', SplitScreen)
    },
    (Vue) => {
        Vue.component('sd-query-manager', QueryManager)
    }
];
