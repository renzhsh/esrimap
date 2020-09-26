<template>
  <SplitLayout
    :buildMap="CreateMap"
    :esriInitOption="generalOption.esriInitOption"
    :viewOption="generalOption.viewOption"
  >
    <MapView slot="left" :groups="groups"></MapView>
    <template slot="right">
      <MapView :groups="groups"></MapView>
      <sd-tool-bar position="top-right"></sd-tool-bar>
      <Draw position="top-right"></Draw>
    </template>
  </SplitLayout>
</template>
<script>
import SplitLayout from "./split/splitMain";
import MapView from "./split/MapView";
import Draw from './draw';
import { esri, EsriMap, tasks, esriUtils } from "esri";
export default {
  components: { SplitLayout, MapView, Draw },
  data() {
    return {
      generalOption: null,
      mapOption: null,
      groups: []
    };
  },
  created() {
    this.generalOption = this.$userData.get("General");

    let option = this.$userData.get("Land");
    this.mapOption = option.mapOption;
    this.groups = option.layers;
  },
  methods: {
    async CreateMap() {
      let map = esriUtils.createMap(this.mapOption);

      return Promise.resolve(map);
    }
  }
};
</script>