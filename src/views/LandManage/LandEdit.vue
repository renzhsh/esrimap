<template>
  <div v-loading="loading">
    <el-form
      v-if="detail"
      class="land-form-edit"
      label-width="90px"
      label-position="right"
    >
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="地块编码:">
            <span>{{detail.Code}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地块名称:">
            <span>{{detail.Title}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="行政区域:">
            <span>{{detail.Region}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <span slot="label">面&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;积:</span>
            <span>{{detail.Area}}亩</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规划用途:">
            <span>{{detail.PlanUsage}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前状态:">
            <el-tag
              color="#00ffc5"
              v-if="detail.State === '0'"
              effect="dark"
              size="small"
              style="borderColor:#00ffc5;"
            >未开始</el-tag>
            <el-tag
              color="#ff73df"
              v-else-if="detail.State === '1'"
              effect="dark"
              size="small"
              style="borderColor:#ff73df;"
            >正在出让推进</el-tag>
            <el-tag
              color="#98e600"
              v-else-if="detail.State === '2'"
              effect="dark"
              size="small"
              style="borderColor:#98e600;"
            >出让完成</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="投资成本:">
            <el-input
              v-model="detail.InvestCost"
              size="small"
              type="number"
            >
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="成交价款:">
            <el-input
              v-model="detail.DealAmount"
              size="small"
              type="number"
            >
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <span slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</span>
            <el-input
              v-model="detail.Remarks"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div>
            <el-button
              type="primary"
              size="mini"
              @click="saveBasicInfo"
              :loading="baseInfoSaveLoading"
              style="margin:5px 0px 0px 18px;"
            >
              保存
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs
      v-model="activeTab"
      tab-position="left"
      type="border-card"
      style="margin-top:10px;height: 500px;"
      v-if="carryTable.length"
    >
      <el-tab-pane
        v-for="carry in carryTable"
        :key="carry.Id"
        :name="carry.OrderIndex"
      >
        <span slot="label">
          {{carry.Title}}
          <i
            v-if="carry.State === 0"
            class="el-icon-close"
          ></i>
          <i
            v-else-if="carry.State === 1"
            class="el-icon-caret-top"
          ></i>
          <i
            v-else-if="carry.State === 2"
            class="el-icon-check"
          ></i>
          <i
            v-else
            class="el-icon-minus"
          ></i>
        </span>
        <h3 style="margin:0px;">
          {{carry.Title}}
          <el-tag
            type="info"
            v-if="carry.State === 0"
            effect="dark"
            size="small"
          >未完成</el-tag>
          <el-tag
            type="warning"
            v-else-if="carry.State === 1"
            effect="dark"
            size="small"
          >正在开展</el-tag>
          <el-tag
            type="success"
            v-else-if="carry.State === 2"
            effect="dark"
            size="small"
          >完成</el-tag>
          <el-tag
            type="primary"
            v-else
            effect="dark"
            size="small"
          >无需办理</el-tag>
        </h3>
        <el-form
          class="land-form-edit"
          label-width="90px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="开始时间:">
                <span>{{carry.StartDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="完成时间:">
                <span>{{carry.FinishDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <span slot="label">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片:</span>
                <el-upload
                  class="land-edit-upload"
                  action="/api/files/jdkg"
                  list-type="picture-card"
                  :file-list="carry.Photos"
                  :on-change="imgFileChange"
                  accept="image/*"
                  :before-upload="beforeImgUpload"
                >
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >只能上传图片文件，且每张大小不超过2M</div>
                  <i
                    slot="default"
                    class="el-icon-plus"
                  ></i>
                  <div
                    slot="file"
                    slot-scope="{file}"
                  >
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt=""
                    />
                    <!-- <label
                      class="el-upload-list__item-status-label"
                      v-if="file.status === 'success'"
                    >
                      <i class="el-icon-upload-success el-icon-check"></i>
                    </label> -->
                    <p class="el-upload-list__file-name">{{file.name}}</p>
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleImgRemove(file,carry)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="margin-top:5px;">
                <span slot="label">文&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;档:</span>
                <el-upload
                  class="land-edit-upload"
                  action="/api/files/jdkg"
                  list-type="picture-card"
                  :file-list="carry.Documents"
                  :on-change="fileChange"
                  accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf"
                  :before-upload="beforefileUpload"
                >
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >只能上传.doc,.docx,.xls,.xlsx,.pdf文档，且每个大小不超过2M</div>
                  <i
                    slot="default"
                    class="el-icon-plus"
                  ></i>
                  <div
                    slot="file"
                    slot-scope="{file}"
                  >
                    <img
                      v-if="getExcelFileType(file.name)"
                      class="el-upload-list__item-thumbnail"
                      src="/static/images/ico/excel.png"
                      alt=""
                    >
                    <img
                      v-if="getWordFileType(file.name)"
                      class="el-upload-list__item-thumbnail"
                      src="/static/images/ico/word.png"
                      alt=""
                    >
                    <img
                      v-if="getPdfFileType(file.name)"
                      class="el-upload-list__item-thumbnail"
                      src="/static/images/ico/pdf.png"
                      alt=""
                    >
                    <!-- <label
                      class="el-upload-list__item-status-label"
                      v-if="file.status === 'success'"
                    >
                      <i class="el-icon-upload-success el-icon-check"></i>
                    </label> -->
                    <p class="el-upload-list__file-name">{{file.name}}</p>
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                        <i class="el-icon-download"></i>
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleFileRemove(file,carry)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div style="text-align:center;">
                <el-button
                  type="primary"
                  size="small"
                  @click="save"
                >
                  <!-- <span
                    v-if="altered"
                    style="position:relative;top:3px;"
                  >*</span> -->
                  保存文件
                </el-button>
                <el-button
                  v-if="carry.State === 0"
                  type="success"
                  size="small"
                  @click="startStage(carry)"
                >开始此阶段</el-button>
                <el-button
                  v-if="carry.State === 0"
                  type="warning"
                  size="small"
                  @click="noNeedStage(carry)"
                >无需办理此阶段</el-button>
                <el-button
                  v-if="carry.State === 1"
                  type="success"
                  size="small"
                  @click="finishStage(carry)"
                >完成此阶段</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { landApi, carryApi } from "./api";
export default {
  props: {
    info: Object,
    visible: Boolean
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.getDetail();
      }
    }
  },
  computed: {
    code() {
      return this.info.property[0].text;
    }
  },
  created() {
    this.getDetail();
  },
  data() {
    return {
      detail: null,
      carryTable: [],
      activeTab: "1",
      loading: false,
      baseInfoSaveLoading: false
    };
  },
  methods: {
    getDetail() {
      this.newProject();
      this.loading = true;
      landApi.getLandInfoByCode(this.code).then(res => {
        this.loading = false;
        res.Area = (res.Area * 0.0015).toFixed(2);
        // this.detail = res
        this.detail = Object.assign(
          JSON.parse(JSON.stringify(this.detail)),
          res,
          {
            PlanUsage: this.info.property[4].text
          }
        );
        let carryTable = [];
        if (res.CarryTable.length) {
          for (const item of res.CarryTable) {
            if (item.StartDate === "0001-01-01T00:00:00") {
              item.StartDate = "未开始";
            } else {
              item.StartDate = item.StartDate.replace("T", " ");
            }
            if (item.FinishDate === "0001-01-01T00:00:00") {
              item.FinishDate = "未完成";
            } else {
              item.FinishDate = item.FinishDate.replace("T", " ");
            }
            if (item.Photos && item.Photos.length) {
              for (const p of item.Photos) {
                p.name = p.Name;
                p.url = "/api/files/" + p.StoreId;
              }
            } else {
              item.Photos = [];
            }
            if (item.Documents && item.Documents.length) {
              for (const p of item.Documents) {
                p.name = p.Name;
                p.url = "/api/files/" + p.StoreId;
              }
            } else {
              item.Documents = [];
            }
            const i = parseInt(item.OrderIndex, 10) - 1;
            carryTable[i] = item;
          }
          this.carryTable = carryTable;
        }
      });
    },
    newProject() {
      console.log(this.info);
      this.detail = {
        Code: this.info.property[0].text,
        Title: this.info.property[1].text,
        Region: this.info.property[2].text,
        Area: (this.info.property[3].text * 0.0015).toFixed(2),
        PlanUsage: this.info.property[4].text,
        State: this.info.property[5].text
      };
    },
    saveBasicInfo() {
      this.baseInfoSaveLoading = true;
      if (this.carryTable.length) {
        // 编辑
        landApi
          .updateLandInfo({
            InvestCost: parseFloat(this.detail.InvestCost),
            DealAmount: parseFloat(this.detail.DealAmount),
            Remarks: this.detail.Remarks,
            Code: this.detail.Code
          })
          .then(() => {
            this.baseInfoSaveLoading = false;
            this.$message.success("基本信息编辑成功");
          });
      } else {
        // 新增
        landApi
          .addLandInfo({
            InvestCost: parseFloat(this.detail.InvestCost),
            DealAmount: parseFloat(this.detail.DealAmount),
            Remarks: this.detail.Remarks,
            Code: this.detail.Code,
            Title: this.detail.Title,
            Region: this.detail.Region,
            Area: this.detail.Area,
            PlanUsage: this.detail.PlanUsage || "-"
          })
          .then(() => {
            this.baseInfoSaveLoading = false;
            this.$message.success("基本信息新增成功");
          });
      }
    },
    imgFileChange(file, fileList) {
      this.carryTable[parseInt(this.activeTab, 10) - 1].Photos = fileList;
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
    },
    handleImgRemove(file, carry) {
      this.$confirm("是否确定删除该图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let collection = [];
          let newList = [];
          if (file.uid) {
            newList = carry.Photos.filter(item => item.uid !== file.uid);
          } else if (file.Id) {
            newList = carry.Photos.filter(item => item.Id !== file.Id);
          }
          carry.Photos = newList;
        })
        .catch(() => {});
    },
    handleFileRemove(file, carry) {
      this.$confirm("是否确定删除该文档?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let collection = [];
          let newList = [];
          if (file.uid) {
            newList = carry.Documents.filter(item => item.uid !== file.uid);
          } else if (file.Id) {
            newList = carry.Documents.filter(item => item.Id !== file.Id);
          }
          carry.Documents = newList;
        })
        .catch(() => {});
    },
    fileChange(file, fileList) {
      this.carryTable[parseInt(this.activeTab, 10) - 1].Documents = fileList;
    },
    handleDownload(file) {
      window.open(file.url);
    },
    save() {
      this.savePhoto();
      this.saveFile();
    },
    savePhoto() {
      const photos = this.carryTable[parseInt(this.activeTab, 10) - 1].Photos;
      if (photos) {
        let collection = [];
        for (const p of photos) {
          collection.push({
            Name: p.name,
            StoreId: p.StoreId || p.response[0]
          });
        }
        carryApi
          .savePhoto(
            { code: this.code, index: this.activeTab },
            {
              Collection: collection
            }
          )
          .then(() => {
            this.$message.success("图片保存成功");
          });
      }
    },
    saveFile() {
      const documents = this.carryTable[parseInt(this.activeTab, 10) - 1]
        .Documents;
      if (documents) {
        let collection = [];
        for (const p of documents) {
          collection.push({
            Name: p.name,
            StoreId: p.StoreId || p.response[0]
          });
        }
        carryApi
          .saveFile(
            { code: this.code, index: this.activeTab },
            {
              Collection: collection
            }
          )
          .then(() => {
            this.$message.success("文档保存成功");
          });
      }
    },
    startStage(carry) {
      this.$confirm("是否确定开始此阶段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          carryApi
            .startStage({ code: this.code, index: this.activeTab })
            .then(() => {
              this.$message.success("此阶段已开始");
              carry.State = 1;
            });
        })
        .catch(() => {});
    },
    finishStage(carry) {
      this.$confirm("是否确定完成此阶段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          carryApi
            .finishStage({ code: this.code, index: this.activeTab })
            .then(() => {
              this.$message.success("此阶段已完成");
              carry.State = 2;
            });
        })
        .catch(() => {});
    },
    noNeedStage(carry) {
      this.$confirm("是否确定此阶段无需办理?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          carryApi
            .changeStage({ code: this.code, index: this.activeTab, state: 3 })
            .then(() => {
              this.$message.success("此阶段无需办理成功");
              carry.State = 3;
            });
        })
        .catch(() => {});
    },
    getExcelFileType(name) {
      const types = name.split("."),
        type = types[types.length - 1];
      if (type === "xlsx" || type === "xls" || type === "csv") {
        return true;
      } else {
        return false;
      }
    },
    getWordFileType(name) {
      const types = name.split("."),
        type = types[types.length - 1];
      if (type === "doc" || type === "docx") {
        return true;
      } else {
        return false;
      }
    },
    getPdfFileType(name) {
      const types = name.split("."),
        type = types[types.length - 1];
      if (type === "pdf") {
        return true;
      } else {
        return false;
      }
    },
    beforeImgUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    beforefileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文档大小不能超过 2MB!");
      }
      return isLt2M;
    }
  }
};
</script>

<style lang="less">
.land-form-edit {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-input-group__append {
    padding: 0 5px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }
  .el-form-item__label {
    font-weight: 700;
  }
}
.land-edit-upload {
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 86px;
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 80px;
    height: 80px;
  }
  .el-upload-list__file-name {
    position: absolute;
    bottom: 0px;
    width: 80px;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
