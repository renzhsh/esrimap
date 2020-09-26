import { esri } from '../../core';
export default {
    created() {
        this.esriMap.loadModules(["esri/widgets/Zoom/ZoomViewModel"]).then(resp => {
            this.zoomModel = new esri.widgets.Zoom.ZoomViewModel({
                view: this.esriMap.view
            });

            this.canZoomIn = this.zoomModel.canZoomIn;

            this.canZoomOut = this.zoomModel.canZoomOut;
        });
    },
    data() {
        return {
            zoomModel: null,
            canZoomIn: false,
            canZoomOut: false
        }
    },
    computed: {
        plusDisable() {
            return !(this.canZoomIn);
        },
        minDisable() {
            return !(this.canZoomOut);
        }
    },
    methods: {
        plus() {
            this.zoomModel && this.canZoomIn && this.zoomModel.zoomIn();
            setTimeout(() => {
                this.canZoomIn = this.zoomModel.canZoomIn;
                this.canZoomOut = this.zoomModel.canZoomOut;
            }, 300);

        },
        minus() {
            this.zoomModel && this.canZoomOut && this.zoomModel.zoomOut();
            setTimeout(() => {
                this.canZoomIn = this.zoomModel.canZoomIn;
                this.canZoomOut = this.zoomModel.canZoomOut;
            }, 300);
        },
    }
}