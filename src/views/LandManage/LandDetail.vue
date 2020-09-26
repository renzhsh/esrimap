<template>
  <div v-loading="loading">
    <div v-if="detail">
      <el-form
        class="land-form-detail"
        label-width="90px"
      >
        <el-row>
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
              <span>{{detail.InvestCost}}万元</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成交价款:">
              <span>{{detail.DealAmount}}万元</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <span slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</span>
              <span>{{detail.Remarks}}</span>
            </el-form-item>
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
                    class="land-detail-upload"
                    action="#"
                    list-type="picture-card"
                    :file-list="carry.Photos"
                  >
                    <div
                      slot="file"
                      slot-scope="{file}"
                    >
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                      />
                      <p class="el-upload-list__file-name">{{file.name}}</p>
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
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
                    class="land-detail-upload"
                    action="#"
                    list-type="picture-card"
                    :file-list="carry.Documents"
                  >
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
                      <p class="el-upload-list__file-name">{{file.name}}</p>
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-delete"
                          @click="handleDownload(file)"
                        >
                          <i class="el-icon-download"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <p v-else>暂无项目数据，请添加项目信息</p>
  </div>
</template>

<script>
import { landApi } from "./api";
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
  data() {
    return {
      detail: null,
      carryTable: [],
      activeTab: "1",
      loading: false
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.loading = true;
      landApi.getLandInfoByCode(this.info.property[0].text).then(res => {
        this.loading = false;
        res.Area = (res.Area * 0.0015).toFixed(2);
        this.detail = Object.assign(res, {
          State: this.info.property[5].text,
          PlanUsage: this.info.property[4].text
        });
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
    handleDownload(file) {
      window.open(file.url);
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
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
    }
  }
};
</script>

<style lang="less">
.land-form-detail {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__label {
    line-height: 25px;
  }
  .el-form-item__content {
    line-height: 25px;
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
.land-detail-upload {
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
  .el-upload--picture-card {
    display: none;
  }
}
</style>
