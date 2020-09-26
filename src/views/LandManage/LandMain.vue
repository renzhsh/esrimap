<template>
  <MapCreation
    :tools="['split']"
    :mapOption="mapOption"
    :groups="groups"
    :onViewSetup="viewSetup"
    v-loading="loading"
    element-loading-text="拼命计算中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <InteractView ref="interactView">
      <interact-item
        label="图层管理"
        active
        icon="esri-icon-layers"
      >
        <sd-layer-manager :groups="groups"></sd-layer-manager>
      </interact-item>
      <interact-item
        ref="landManageInteractItem"
        label="地块列表"
        icon="el-icon-menu"
      >
        <land-manage :esriMap="esriMap"></land-manage>
      </interact-item>
      <interact-item
        ref="landEvolution"
        label="地块演变"
        icon="el-icon-picture-outline"
      >
        <land-evolution :info="landInfo"></land-evolution>
      </interact-item>
      <interact-item
        label="查询"
        icon="esri-icon-search"
      >
        <sd-query-manager></sd-query-manager>
      </interact-item>
      <interact-item
        label="打印"
        icon="esri-icon-printer"
      >
        <sd-print></sd-print>
      </interact-item>
      <interact-item
        label="测量"
        icon="esri-icon-experimental"
      >
        <sd-measure></sd-measure>
      </interact-item>
    </InteractView>
    <land-modal></land-modal>
  </MapCreation>
</template>
<script>
import LandManage from "./LandManage";
import LandModal from "./LandModal";
import LandEvolution from "./LandEvolution";
import MapCreation from "../components/MapCreation";
import { esri, tasks } from "../../esri";
import iBus from "@/lmkits/iBus";
const ibus = new iBus();
export default {
  components: { MapCreation, LandManage, LandModal, LandEvolution },
  data() {
    return {
      loading: false,
      mapOption: null,
      groups: null,
      esriMap: null,
      landInfo: null
    };
  },
  created() {
    let option = this.$userData.get("Land");
    this.mapOption = option.mapOption;

    this.groups = option.layers;
  },
  mounted() {
    ibus.$on("landPic:trigger", info => {
      this.landInfo = info;
      this.$refs.interactView.toggle(this.$refs.landEvolution);
    });
  },
  methods: {
    async viewSetup(esriMap) {
      this.esriMap = esriMap;

      esriMap.$on("identify", event => {
        event.popup();
      });
    }
  }
};
</script>
