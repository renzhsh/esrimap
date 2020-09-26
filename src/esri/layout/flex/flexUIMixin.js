import { esri } from "../../core";

class DOMUtil {
    isWidget(item) {
        return item && item instanceof esri.widgets.Widget;
    }

    isDOM(item) {
        return item && typeof item === 'object' && item.nodeType === 1 && typeof item.nodeName === 'string';
    }

    getDomNodes(widget) {
        let target;

        if (!(widget instanceof Array)) {
            target = [widget];
        } else {
            target = widget;
        }

        return target.map(item => {
            if (this.isWidget(item)) {
                if (item.container == null) {
                    item.container = document.createElement('div');
                }
                return item.domNode;
            }
            if (this.isDOM(item)) {
                return item;
            }
            if (typeof item == "string") {
                var dom = document.getElementById(item);
                if (dom == null) {
                    dom = document.getElementsByClassName('esri-' + item);
                    if (dom && dom.length > 0) {
                        dom = dom[0];
                    }
                }
                return dom;
            }
        });
    }
};

export default {
    data() {
        return {
            domUtil: new DOMUtil()
        }
    },
    methods: {
        grids(position) {
            let target = null;
            switch (position) {
                case "top-left":
                    target = this.$refs.tl.$el;
                    break;
                case "top-right":
                    target = this.$refs.tr.$el;
                    break;
                case "bottom-left":
                    target = this.$refs.bl.$el;
                    break;
                case "bottom-right":
                    target = this.$refs.br.$el;
                    break;
            }
            return target;
        },
        isValidPos(pos) {
            return ["top-left", "top-right", "bottom-left", "bottom-right"].findIndex(item => item == pos) > -1;
        },
        add(widget, position) {
            if (!this.isValidPos(position)) {
                return;
            }

            let domNodes = this.domUtil.getDomNodes(widget);
            domNodes.forEach((dom) => {
                if (this.domUtil.isDOM(dom)) {
                    dom.classList.add('esri-component');
                    this.grids(position).appendChild(dom);
                }
            });
        },
    }
}