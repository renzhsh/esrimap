<template>
  <div class="saide-query-tab">
    <el-form label-width="80px">
      <el-form-item label="业务图层">
        <el-select
          v-model="selected"
          value-key="title"
          clearable
          size="small"
          style="width:100%"
        >
          <el-option
            :label="item.title"
            :value="item"
            v-for="(item) in layerInfos"
            :key="item.title + item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="查询字段">
        <el-select
          v-model="queryFields"
          clearable
          multiple
          size="small"
          style="width:100%"
        >
          <el-option
            :label="item.label"
            :value="item.field"
            v-for="(item,index) in searchFields"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input
          placeholder="查询关键字"
          clearable
          v-model="keywords"
          @keyup.enter.native="callQueryTask"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="fuzzyMatch">模糊查询</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="callQueryTask"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <!-- <el-input
        placeholder="查询关键字"
        clearable
        v-model="keywords"
        @keyup.enter.native="callQueryTask"
        class="query-tab-keywords"
        size="small"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="callQueryTask"
        ></el-button>
      </el-input> -->
      <!-- <el-checkbox
        v-model="fuzzyMatch"
        class="query-tab-checkbox"
      >模糊查询</el-checkbox> -->
    </div>

  </div>
</template>
<script>
import { esri } from "../../core";
export default {
  props: {
    layerInfos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selected: "",
      queryFields: [],
      fuzzyMatch: true,
      keywords: ""
    };
  },
  computed: {
    searchFields() {
      this.queryFields = [];
      if (!this.selected) return [];

      return this.selected.alias.filter(
        f => this.selected.searchFields.indexOf(f.field) > -1
      );
    }
  },
  methods: {
    callQueryTask() {
      if (!this.selected) {
        this.$notify({
          title: "警告",
          message: "请选择查询的图层",
          type: "warning"
        });
        return;
      }
      if (this.queryFields.length == 0) {
        this.$notify({
          title: "警告",
          message: "请选择查询的字段",
          type: "warning"
        });
        return;
      }

      if (!this.keywords) {
        this.$notify({
          title: "警告",
          message: "请输入查询关键字",
          type: "warning"
        });
        return;
      }

      var queryTask = new esri.tasks.QueryTask({
        url: this.selected.url
      });

      var whereClause = "";

      this.queryFields.forEach(f => {
        if (this.fuzzyMatch) {
          whereClause += `${f} like '%${this.keywords}%' and `;
        } else {
          whereClause += `${f} = ${this.keywords} and `;
        }
      });

      var params = new esri.tasks.support.Query({
        returnGeometry: true,
        outFields: ["*"],
        where: whereClause.substring(0, whereClause.length - 5)
      });

      this.$emit("submitJob", {
        task: queryTask,
        params: params,
        info: this.selected
      });
    }
  }
};
</script>
<style lang="less">
.saide-query-tab {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>