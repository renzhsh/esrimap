<template>
  <div class="sadie-print-panel">
    <div class="panel-main" v-loading="printing">
      <el-form label-position="right" label-width="70px">
        <el-form-item label="标题">
          <el-input v-model="printOption.layoutOptions.titleText" size="small" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="页面布局">
          <el-select v-model="printOption.layout" size="small">
            <el-option
              v-for="item in layouts"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >{{item.text}}</el-option>
          </el-select>
        </el-form-item>
        <el-row v-if="printOption.layout=='map-only'">
          <el-col :span="11">
            <el-form-item label="宽">
              <el-input v-model="printOption.exportOptions.width" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="高">
              <el-input v-model="printOption.exportOptions.height" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="文件格式">
          <el-select v-model="printOption.format" size="small">
            <el-option
              v-for="item in formats"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >{{item.text}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图层控制">
          <el-button
            type="ghost"
            icon="el-icon-refresh"
            size="mini"
            @click="makeVisibleLayer"
            circle
            style="float:right"
          ></el-button>
          <br />
          <el-checkbox-group v-model="checkedLayers" @change="ctrlVisible" style="max-width:200px">
            <el-checkbox v-for="l in visibleLayers" :label="l.id" :key="l.id">{{l.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button class="print-button" type="primary" @click="print" size="mini">打印</el-button>
        </el-form-item>
        <el-collapse v-if="false">
          <el-collapse-item title="高级选项">
            <el-form-item label="作者" v-if="printOption.layout!='map-only'">
              <el-input v-model="printOption.layoutOptions.authorText"></el-input>
            </el-form-item>
            <el-form-item label="版权所有" v-if="printOption.layout!='map-only'">
              <el-input v-model="printOption.layoutOptions.copyrightText"></el-input>
            </el-form-item>
            <el-form-item label="DPI" v-if="printOption.layout=='map-only'">
              <el-input v-model="printOption.exportOptions.dpi"></el-input>
            </el-form-item>
            <el-checkbox
              v-model="printOption.attributionVisible"
              v-if="printOption.layout=='map-only'"
            >包括属性</el-checkbox>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <hr />
      <div class="print-result">
        <p v-for="(item,index) in printResult" :key="index">
          <a :href="item.url" target="_blank">{{item.title}}</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { esri } from "../core";
export default {
  inject: ["esriMap"],
  props: {
    position: String,
    option: {
      type: Object,
      default: function() {
        return {
          tipInfo: "地图仅供内部使用，严禁外泄",
          copyrightInfo: "制图单位：安徽中瀚测绘科技有限公司",
          printUrl:
            "http://arcgis.ahygis.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        };
      }
    }
  },
  data() {
    return {
      printing: false,
      printResult: [],
      printOption: {
        layout: "a3-landscape",
        format: "pdf",
        attributionVisible: false,
        exportOptions: {
          width: 1600,
          height: 900
          // dpi: 96
        },
        layoutOptions: {
          titleText: "",
          authorText: this.option.tipInfo ? this.option.tipInfo : "",
          copyrightText: this.option.copyrightInfo
            ? this.option.copyrightInfo
            : ""
        }
      },
      visibleLayers: [],
      checkedLayers: []
    };
  },
  computed: {
    layouts() {
      return [
        {
          text: "只有地图",
          value: "map-only"
        },
        // {
        //     text: "水印",
        //     value: "shuiying"
        // },
        {
          text: "A3 横向",
          value: "a3-landscape"
        },
        {
          text: "A3 纵向",
          value: "a3-portrait"
        },
        {
          text: "A4 横向",
          value: "a4-landscape"
        },
        {
          text: "A4 纵向",
          value: "a4-portrait"
        }
        // {
        //     text: "Letter ANSI A Landscape",
        //     value: "letter-ansi-a-landscape"
        // },
        // {
        //     text: "Letter ANSI A Portrait",
        //     value: "letter-ansi-a-portrait"
        // },
        // {
        //     text: "Tabloid ANSI B Landscape",
        //     value: "tabloid-ansi-b-landscape"
        // },
        // {
        //     text: "Tabloid ANSI B Portrait",
        //     value: "tabloid-ansi-b-portrait"
        // }
      ];
    },
    formats() {
      return [
        {
          text: "pdf",
          value: "pdf"
        },
        {
          text: "png",
          value: "png32"
        },
        {
          text: "jpg",
          value: "jpg"
        }
      ];
    }
  },
  methods: {
    makeVisibleLayer() {
      this.visibleLayers = this.esriMap.view.map.layers.items.filter(
        item => item.label
      );
      this.checkedLayers = this.visibleLayers
        .filter(item => item.visible)
        .map(item => item.id);

      console.dir(this.visibleLayers);
    },
    ctrlVisible(updates) {
      this.visibleLayers
        .filter(item => updates.includes(item.id))
        .forEach(item => {
          if (!item.visible) item.visible = true;
        });

      this.visibleLayers
        .filter(item => !updates.includes(item.id))
        .forEach(item => {
          if (item.visible) item.visible = false;
        });
    },
    showWindow() {
      this.open = true;
      this.printOption.layoutOptions.titleText = "未命名";
    },
    async print() {
      if (this.printOption.layoutOptions.titleText == "未命名") {
        this.printOption.layoutOptions.titleText = "";
      }

      if (this.option.printUrl === "") {
        throw "未提供打印服务地址";
      }

      var printTask = new esri.tasks.PrintTask({
        url: this.option.printUrl
      });

      var template = new esri.tasks.support.PrintTemplate(this.printOption);

      var params = new esri.tasks.support.PrintParameters({
        view: this.esriMap.view,
        template: template
      });

      this.printing = true;
      let result = await printTask.execute(params);

      this.visibleLayers.forEach(item => {
        if (!item.visible) item.visible = true;
      });
      this.checkedLayers = this.visibleLayers
        .filter(item => item.visible)
        .map(item => item.id);

      result.url = result.url.replace(
        "192.168.10.60:6080",
        "arcgis.ahygis.com"
      );

      if (this.printOption.layoutOptions.titleText == "") {
        let length = result.url.length;
        let item = {
          title: result.url.substring(length - 10),
          url: result.url
        };

        this.printResult.push(item);
      } else {
        let item = {
          title: `${this.printOption.layoutOptions.titleText}.${this.printOption.format}`,
          url: result.url
        };

        this.printResult.push(item);
      }

      this.printing = false;
    }
  }
};
</script>
<style lang="less">
.sadie-print-panel {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>

<style lang="less" scoped>
.sadie-print-panel {
  overflow: hidden;
  position: relative;
  background-color: #fff;
  border-radius: 5px 5px 0 0;

  .panel-header {
    width: 100%;
    height: 40px;
    background-color: #409eff;
    border-radius: 5px 5px 0 0;

    .el-icon-close {
      cursor: pointer;
    }

    span {
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      font-size: 19px;
    }

    i {
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }

  .panel-main {
    margin: 20px;

    .print-button {
      margin-top: 10px;
    }
  }
}
</style>
