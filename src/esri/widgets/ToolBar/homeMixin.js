import { esri } from '../../core';
export default {
    created() {
        this.esriMap.loadModules(["esri/widgets/Home/HomeViewModel"]).then(resp => {
            this.homeModel = new esri.widgets.Home.HomeViewModel({
                view: this.esriMap.view
            });
        });
    },
    data() {
        return {
            homeModel: null
        }
    },
    methods: {
        home() {
            this.homeModel && this.homeModel.go();
        }
    }
}