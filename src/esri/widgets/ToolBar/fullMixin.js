import { esri } from '../../core';
export default {
    created() {
        this.esriMap.loadModules(["esri/widgets/Fullscreen/FullscreenViewModel"]).then(resp => {
            this.fullModel = new esri.widgets.Fullscreen.FullscreenViewModel({
                view: this.esriMap.view
            });
        });
    },
    data() {
        return {
            fullModel: null,
            inFullScreen: false
        }
    },
    methods: {
        toggle() {
            this.fullModel && this.fullModel.toggle();
            this.inFullScreen = !this.inFullScreen;
        }
    }
}