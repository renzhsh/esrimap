<template>
  <div>
    <el-dialog
      :title="info.title+'详情'"
      :visible.sync="detailVisible"
      width="1010px"
      @closed="detailDialogClosed"
    >
      <land-detail
        ref="landDetail"
        :info="info"
        :visible="detailVisible"
      ></land-detail>
    </el-dialog>
    <el-dialog
      :title="info.title+'编辑'"
      :visible.sync="editVisible"
      width="1010px"
      @closed="editDialogClosed"
    >
      <land-edit
        ref="landEdit"
        :info="info"
        :visible="editVisible"
      ></land-edit>
    </el-dialog>
  </div>

</template>

<script>
import LandDetail from "./LandDetail";
import LandEdit from "./LandEdit";
import iBus from "@/lmkits/iBus";
const ibus = new iBus();
export default {
  inject: ["esriMap"],
  components: { LandDetail, LandEdit },
  data() {
    return {
      detailVisible: false,
      editVisible: false,
      info: {}
    };
  },
  created() {
    this.esriMap.$on("infoWindow:action", info => {
      this.info = info;
      if (info.event === "land-detail") {
        this.detailVisible = true;
      } else if (info.event === "land-edit") {
        this.editVisible = true;
      } else if (info.event === "land-pic") {
        ibus.$emit("landPic:trigger", info);
      }
    });
  },
  methods: {
    editDialogClosed() {
      this.$refs.landEdit.detail = null;
      this.$refs.landEdit.carryTable = [];
    },
    detailDialogClosed() {
      this.$refs.landDetail.detail = null;
      this.$refs.landDetail.carryTable = [];
    }
  }
};
</script>

<style lang="less">
.el-dialog__body {
  padding: 0px 20px 20px 20px;
}
</style>
