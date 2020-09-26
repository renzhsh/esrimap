<template>
  <EsriLayout
    :buildMap="CreateMap"
    :viewOption="viewOption"
    :esriInitOption="esriInitOption"
    @viewSetup="viewSetup"
  >
    <WidgetView>
      <sd-tool-bar position="top-right">
        <li
          v-if="tools.indexOf('split')>-1"
          class="tool-item"
          @click="handle('splitscreen')"
        >
          <i class="esri-icon-swap"></i>
          <span class="item-text">分屏对比</span>
        </li>
      </sd-tool-bar>
      <sd-gallery
        position="bottom-right"
        :items="gallery.items"
      ></sd-gallery>
      <slot name="widget"></slot>
    </WidgetView>
    <slot></slot>
    <PresentView>
      <SplitScreenView
        v-if="tools.indexOf('split')>-1"
        :mapOption="mapOption"
        :groups="groups"
      ></SplitScreenView>
      <slot name="present"></slot>
    </PresentView>
  </EsriLayout>
</template>
<script>
import { esri, tasks, esriUtils } from "esri";
import SplitScreenView from "./SplitScreen";
export default {
  components: { SplitScreenView },
  props: {
    mapOption: {
      type: Object,
      required: true
    },
    groups: {
      type: Array,
      required: false
    },
    onViewSetup: {
      type: Function
    },
    tools: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      esriMap: null,
      esriInitOption: {},
      viewOption: {},
      gallery: {}
    };
  },
  created() {
    let general = this.$userData.get("General");
    this.esriInitOption = general.esriInitOption;
    this.viewOption = general.viewOption;
    this.gallery = general.esriInitOption.gallery;
  },
  methods: {
    async CreateMap() {
      let map = esriUtils.createMap(this.mapOption);
      console.dir(map);
      return Promise.resolve(map);
    },
    viewSetup(esriMap) {
      this.esriMap = esriMap;
      this.loadWidget(esriMap);
      this.onViewSetup && this.onViewSetup(esriMap);
    },
    loadWidget(esriMap) {
      let view = esriMap.view;

      view.ui.remove("attribution");
      view.ui.remove("zoom");

      esriMap.loadModules(["esri/widgets/ScaleBar"]).then(() => {
        var scaleBar = new esri.widgets.ScaleBar({
          view: view,
          unit: "metric"
        });
        // Add widget to the bottom left corner of the view
        esriMap.flexUi.add(scaleBar, "bottom-left");
      });
    },
    handle(name) {
      this.esriMap.$emit(name);
    }
  }
};
</script>
<style lang="less" scoped>
.esri-icon-swap {
  vertical-align: middle;
}
</style>
