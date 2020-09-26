import Injector from "../../common/injector";
import { esri } from "../../core";
import config from './config';

/**
 * initialize --> loadModule  --> beforeViewSetup --> ViewSetup
 */
export default {
    props: {
        esriInitOption: Object,
        viewOption: Object,
        beforeViewSetup: Function,
        buildMap: {
            type: Function,
            required: true
        }
    },
    created() {
        this.CreateView();
    },
    methods: {
        init() {
            this.injector = new Injector();

            Object.assign(config, {
                esriInitOption: this.esriInitOption,
                viewOption: this.viewOption
            });

            this.esriMap.context = {
                config
            };

            let options = config.esriInitOption;

            if (options["apiUrl"] && typeof options["apiUrl"] == "string") {
                this.esriMap.UseUrl(options["apiUrl"])
            }

            if (options["cssUrl"] && typeof options["cssUrl"] == "string") {
                this.esriMap.loadCss(options["cssUrl"])
            }

            if (options["modules"]) {
                if (options["modules"] instanceof Array) {
                    this.esriMap.loadModules(options["modules"]);
                }
                if (typeof options["modules"] == 'string') {
                    this.esriMap.loadModules([options["modules"]]);
                }
            }

            if (options["corsServers"] && (typeof options["corsServers"] == 'string' || options["corsServers"] instanceof Array)) {
                this.esriMap.config.pushCorsServers(options["corsServers"]);
            }
        },
        async beforeViewSetupInject() {
            if (!this.beforeViewSetup) {
                Promise.resolve();
                return;
            }

            let injector = new Injector();
            injector.inject(this.beforeViewSetup);

            await injector.ready();
        },
        async CreateView() {
            this.init();
            this.$emit("initialized", this.esriMap);
            await this.esriMap.OnReady();
            this.$emit("moduleLoaded", this.esriMap);
            await this.beforeViewSetupInject();

            let map = await this.buildMap();

            let view = new esri.views.MapView(Object.assign({
                container: this.viewId,
                map: map
            }, config.viewOption));

            view.when(() => {
                this.esriMap.view = view;
                this.$emit("viewSetup", this.esriMap);
                this.viewReady = true;

                setTimeout(() => {
                    this.loadUI();
                    this.loadComponent();
                }, 300);

            });
        },
        loadUI() {
            let uiDom = document.querySelector(`#${this.viewId}` + " .esri-view-root");
            this.$children.forEach(vm => {
                if (vm.$props && vm.$props.autoMount) {
                    uiDom.appendChild(vm.$el);
                }
            });
        },
        loadComponent() {
            this.esriMap.popup = this.$refs.popup;
            this.esriMap.identify = this.$refs.identify;
        }
    }
}