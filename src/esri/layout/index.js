import EsriLayout from './esriLayout';
import PresentView from './PresentView';
import WidgetView from './WidgetView';
import FlexView from './flex/FlexView';
import FlexGrid from './flex/FlexGrid';
import InteractView from './interact/InteractView';
import InteractItem from './interact/InteractItem';

export {
    EsriLayout,
    PresentView,
    WidgetView,
    FlexView,
    FlexGrid,
    InteractView,
    InteractItem
};

export default [
    (Vue) => {
        Vue.component('EsriLayout', EsriLayout)
    },
    (Vue) => {
        Vue.component('PresentView', PresentView)
    },
    (Vue) => {
        Vue.component('WidgetView', WidgetView)
    },
    (Vue) => {
        Vue.component('FlexView', FlexView)
    },
    (Vue) => {
        Vue.component('FlexGrid', FlexGrid)
    },
    (Vue) => {
        Vue.component('InteractView', InteractView)
    },
    (Vue) => {
        Vue.component('InteractItem', InteractItem)
    }
];