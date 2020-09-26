<template>
  <div
    class="module-chart"
    :id="id"
  ></div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    title: String
  },
  data() {
    return {
      id: "chart_" + Math.round(Math.random() * 1000000)
    };
  },
  mounted() {
    const { id } = this;
    // 基于准备好的dom，初始化echarts实例
    this.chartIns = echarts.init(document.getElementById(id));
  },
  watch: {
    data(newVal) {
      this.renderChart(newVal);
    }
  },
  methods: {
    renderChart(data, unit) {
      const self = this;
      let option = {
        // backgroundColor: '#183558',
        title: {
          left: "left",
          top: 0,
          text: self.title,
          textStyle: {
            fontSize: 16
            // color: '#eee'
          }
        },
        grid: { bottom: 50, right: 30, top: 40, left: 60 },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          left: "right",
          orient: "vertical"
        },
        dataset: {
          source: data
        }
      };
      option = Object.assign(option, self.option);
      // 绘制图表
      this.chartIns.setOption(option, true);
    }
  }
};
</script>

<style scoped lang="less">
.module-chart,
.module-empty {
  width: 100%;
  height: 100%;
}
</style>
