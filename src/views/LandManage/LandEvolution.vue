<template>
  <div
    class="land-evolution"
    v-loading="loading"
  >
    <div v-if="info">
      <h5>
        {{info.title}}
      </h5>
      <el-timeline>
        <el-timeline-item
          :timestamp="today"
          placement="top"
        >
          <el-button
            icon="el-icon-plus"
            circle
            @click="addEvolution"
          ></el-button>
        </el-timeline-item>
        <template v-if="nodes.length">
          <el-timeline-item
            placement="top"
            v-for="(node,nindex) in nodes"
            :key="nindex"
            :timestamp="node.DatePoint"
          >
            <el-card class="custom-card">
              <el-carousel
                trigger="click"
                height="150px"
              >
                <el-carousel-item
                  class="el-carousel__item"
                  v-for="(p,index) in node.Photos"
                  :key="index"
                >
                  <img
                    class="carousel-image"
                    :src="'/api/files/' + p"
                    alt=""
                    @click="preview('/api/files/' + p)"
                  >
                </el-carousel-item>
              </el-carousel>
              <div
                class="desc"
                v-if="node.SceneUrl || node.Text"
              >
                <p v-if="node.SceneUrl"><a
                    :href="node.SceneUrl"
                    target="_blank"
                  >{{node.SceneTitle|| node.SceneUrl}}</a></p>
                <p v-if="node.Text">{{node.Text}}</p>
              </div>
              <div class="btns">
                <a
                  href="javascript:;"
                  style="border-right: 1px solid #e3e7ec;"
                  @click="editNode(node)"
                >
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="mini"
                  ></el-button>
                </a>
                <a
                  href="javascript:;"
                  @click="deleteNode(node)"
                >
                  <el-button
                    style="color:red;"
                    type="text"
                    icon="el-icon-delete"
                    size="mini"
                  ></el-button>
                </a>
              </div>
            </el-card>
          </el-timeline-item>
        </template>

      </el-timeline>
    </div>
    <div v-else>
      <!-- <p class="empty-txt">请先选择地块</p> -->
      <no-data
        text="请先选择地块"
      >
      </no-data>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
    <el-dialog
      :visible.sync="newEvolutionVisible"
      width="800px"
      :title="info && info.title"
      @closed="detailDialogClosed"
    >
      <evolution-add
        ref="evolutionAdd"
        :code="code"
        @ok="evolutionAddOk"
        :node="node"
      ></evolution-add>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import EvolutionAdd from "./EvolutionAdd";
import { nodeApi } from "./api/";
import NoData from "@/views/components/NoData";
export default {
  props: {
    info: Object
  },
  components: { EvolutionAdd, NoData },
  computed: {
    code() {
      return this.info && this.info.property[0].text;
    }
  },
  watch: {
    info(newVal) {
      console.log(newVal);
      this.loadNodes();
    }
  },
  data() {
    return {
      today: moment().format("YYYY-MM-DD"),
      dialogVisible: false,
      newEvolutionVisible: false,
      dialogImageUrl: "",
      nodes: [],
      node: null,
      loading: false
    };
  },
  methods: {
    loadNodes() {
      this.loading = true;
      nodeApi.getNodeInfo(this.code).then(res => {
        this.loading = false;
        for (const item of res) {
          item.Photos = item.Photos.split(",");
          item.DatePoint = item.DatePoint.split("T")[0];
        }
        this.nodes = res;
      });
    },
    preview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    addEvolution() {
      this.newEvolutionVisible = true;
    },
    detailDialogClosed() {
      this.$refs.evolutionAdd.resetData();
      this.node = null;
    },
    editNode(node) {
      this.newEvolutionVisible = true;
      this.node = node;
    },
    deleteNode(node) {
      this.$confirm("是否确定删除该节点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          nodeApi.deleteNode(node.Id).then(() => {
            this.$message.success("删除成功");
            this.loadNodes();
          });
        })
        .catch(() => {});
    },
    evolutionAddOk() {
      this.newEvolutionVisible = false;
      this.loadNodes();
    }
  }
};
</script>

<style lang="less">
.custom-card {
  .el-card__header {
    padding: 8px 10px;
  }
  .el-card__body {
    padding: 0px;
  }
}
</style>

<style scoped lang="less">
.land-evolution {
  padding: 10px 20px 20px 10px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.6);
  h5 {
    margin: 0px 0px 10px 10px;
  }
}
.el-carousel__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .carousel-image {
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }
}
.desc {
  padding: 10px;
  p {
    color: #5e6d82;
    line-height: 25px;
    font-size: 14px;
    a {
      color: #1989fa;
    }
  }
}
p.empty-txt {
  color: #5e6d82;
  line-height: 25px;
  font-size: 14px;
  text-align: center;
}
.btns {
  display: -webkit-flex;
  display: flex;
  flex: 1;
  a {
    flex: 1;
    border-top: 1px solid #e3e7ec;
    text-align: center;
  }
}
</style>
