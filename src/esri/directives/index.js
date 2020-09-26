import Drag from './drag';
import imgBig from './imgbig';
import fullScreen from './fullScreen';
import exitScreen from './exitScreen';

export default [
    (Vue) => {
        Vue.directive('drag', Drag);
        Vue.directive('imgBig', imgBig);
        Vue.directive('fullScreen', fullScreen);
        Vue.directive('exitScreen', exitScreen);
    }
];