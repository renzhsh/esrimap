<template>
  <div>
    <el-form
      v-if="detail"
      class="land-form-edit"
      label-width="90px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="时间点:">
            <el-date-picker
              v-model="detail.DatePoint"
              type="date"
              placeholder="时间点"
              :disabled="node !== null"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="场景名称:">
            <el-input
              v-model="detail.SceneTitle"
              size="small"
              placeholder="场景名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="场景地址:">
            <el-input
              v-model="detail.SceneUrl"
              size="small"
              placeholder="场景地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传图片:">
            <el-upload
              class="land-edit-upload"
              action="/api/files/jdkg"
              list-type="picture-card"
              :file-list="fileList"
              multiple
              accept="image/*"
              :before-upload="beforeImgUpload"
              :on-change="imgFileChange"
              :on-remove="onRemove"
              :limit="8"
            >
              <i class="el-icon-plus"></i>
              <div
                slot="tip"
                class="el-upload__tip"
              >只能上传图片文件，且每张大小不超过2M，最多上传8张图片。</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述:">
            <el-input
              type="textarea"
              :rows="3"
              v-model="detail.Text"
              size="small"
              placeholder="描述"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="text-align:right;">
            <el-button
              type="primary"
              size="small"
              @click="save"
            >保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import { nodeApi } from "./api/";
export default {
  props: {
    code: String,
    node: Object
  },
  data() {
    return {
      detail: {
        SceneTitle: "",
        SceneUrl: "",
        Text: "",
        DatePoint: moment().format("YYYY-MM-DD")
      },
      fileList: []
    };
  },
  watch: {
    node(newVal) {
      if (newVal) {
        this.init(newVal);
      }
    }
  },
  mounted() {
    if (this.node) {
      this.init(this.node);
    }
  },
  methods: {
    init(newVal) {
      this.detail.SceneTitle = newVal.SceneTitle;
      this.detail.SceneUrl = newVal.SceneUrl;
      this.detail.Text = newVal.Text;
      this.detail.DatePoint = newVal.DatePoint;
      let list = [];
      for (const p of newVal.Photos) {
        list.push({
          name: "",
          url: "/api/files/" + p,
          storeId: p
        });
      }
      this.fileList = list;
    },
    beforeImgUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2,
        len = this.fileList.length;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    imgFileChange(file, fileList) {
      this.fileList = fileList;
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    resetData() {
      this.fileList = [];
      this.detail = {
        SceneTitle: "",
        SceneUrl: "",
        Text: "",
        DatePoint: moment().format("YYYY-MM-DD")
      };
    },
    save() {
      if (!this.fileList.length) {
        this.$message.warning("请上传图片");
        return;
      }
      let ps = [];
      for (const item of this.fileList) {
        ps.push(item.storeId || item.response[0]);
      }
      const data = Object.assign(this.detail, {
        LandCode: this.code,
        Photos: ps.join(",")
      });
      if (this.node) {
        nodeApi
          .updateNode(Object.assign(data, { Id: this.node.Id }))
          .then(() => {
            this.$message.success("保存成功");
            this.$emit("ok");
          });
      } else {
        nodeApi.addNode(data).then(() => {
          this.$message.success("保存成功");
          this.$emit("ok");
        });
      }
    }
  }
};
</script>

<style lang="less">
.land-form-edit {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.land-edit-upload {
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 106px;
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 100px;
    height: 100px;
  }
  .el-upload-list__file-name {
    position: absolute;
    bottom: 0px;
    width: 100px;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
