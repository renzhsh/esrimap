export * from './core';

/**
 * 组件
 */
import LayoutWidgetInstall from './layout';
import WidgetInstall from './widgets';

/**
 * 指令
 */
import DirectiveInstall from './directives';

export default {
    install: function(Vue) {
        [
            ...LayoutWidgetInstall,
            ...WidgetInstall,
            ...DirectiveInstall
        ].forEach(itemInstall => {
            itemInstall(Vue);
        })
    }
}