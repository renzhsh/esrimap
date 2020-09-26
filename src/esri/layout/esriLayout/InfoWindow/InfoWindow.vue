<template>
  <div
    class="sadie-info-window"
    :class="mode+'-mode'"
    :style="style"
  >
    <div
      class="title"
      v-if="mode=='title'"
    >
      <h2>{{info.title}}</h2>
    </div>
    <template v-else>
      <div
        class="info-image"
        v-if="info.image"
      >
        <img :src="info.image">
      </div>
      <div class="header">
        <h3>{{info.title}}</h3>
      </div>
      <div
        class="info-property"
        v-if="info.property"
      >
        <div
          class="item"
          v-for="(item,index) in info.property"
          :key="index"
        >
          {{item.label}}：{{item.text}}
        </div>
      </div>
      <div
        class="info-text"
        v-if="info.summary"
      >
        <p>{{info.summary}}</p>
      </div>
      <div
        class="info-tools"
        v-if="info.actions"
      >
        <li
          class="tool-item"
          v-for="(item,index) in info.actions"
          :key="index"
          @click="trigger(item.event)"
        >
          <i :class="item.icon"></i>
          <span class="item-text">{{item.label}}</span>
        </li>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  inject: ["esriMap"],
  data() {
    return {
      mode: "text", // title(标题)、text(图文)
      style: "",
      info: {
        title: "",
        // image: "",
        // summary: "",
        // property: [
        //     {
        //         label: "用户名",
        //         text: "admin"
        //     },
        //     {
        //         label: "用户名",
        //         text: "admin"
        //     }
        // ],
        actions: [
          // {
          //     label: "Zoom out",
          //     event: "zoom-out",
          //     icon: "esri-icon-zoom-out-magnifying-glass"
          // }
        ],
        location: null,
        content: null
      }
    };
  },
  methods: {
    close() {
      this.esriMap.view.popup.close();
    },
    open(location, option) {
      let view = this.esriMap.view;
      this.info = option;

      this.mode = option.mode || "text";

      this.style =
        (option.width ? `width:${option.width};` : "") +
        (option.height ? `height:${option.height};` : "");

      let el = option.content ? option.content : this.$el;

      view.popup.open({
        location: location,
        content: el
      });
    },
    trigger(event) {
      this.esriMap.$emit(
        "infoWindow:action",
        Object.assign(this.info, { event: event })
      );
    }
  }
};
</script>
<style lang="less">
@import "./styles.less";
.sadie-info-window {
  position: relative;
  // user-select: none;

  &.title-mode {
    .title {
      text-align: center;
      h2 {
        font-size: 14px;
        padding: 12px 15px;
        margin: 0 auto 0 0;
        display: block;
        flex: 1;
        word-break: break-word;
        word-wrap: break-word;
        display: inline-block;
      }
    }
  }

  &.text-mode {
    color: #464542;
    width: 300px;
    .info-image {
      img {
        width: 100%;
      }
    }

    .header {
      background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.97) 0%,
        rgba(255, 255, 255, 1) 25%,
        rgba(255, 255, 255, 1) 100%
      );

      h3 {
        margin: 0px;
        font-family: "Microsoft Yahei";
        padding: 6px 0;
        text-indent: 10px;
        color: #333;
        font-size: 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .info-property {
      margin: 0px;
      padding: 5px 15px;
      white-space: nowrap;
      border-bottom: 1px solid #ebeef5;

      .item {
        margin-bottom: 6px;
      }
    }

    .info-text {
      p {
        margin-bottom: 10px;
        padding: 5px 15px;
        text-indent: 2em;
        text-align: justify;
        line-height: 22px;
        font-size: 14x;
        letter-spacing: 0.5px;
      }
    }

    .info-tools {
      position: relative;
      height: 34px;
      background-color: #fff;
      border-radius: 3px;
      user-select: none;
      border-top: 1px solid #ebeef5;
      display: flex;

      li,
      span {
        margin: 0px;
        padding: 0px;
      }

      li {
        list-style: none;
      }

      .tool-item {
        display: inline-block;
        border: 1px solid #fff;
        padding: 5px;
        cursor: pointer;
        color: #0e89f5;
        transition: opacity 0.15s ease;
        flex-shrink: 0;

        &:hover {
          color: #009cf9;
          opacity: 0.8;
        }

        .item-text {
          height: 20px;
          font-size: 10px;
          line-height: 20px;
          padding-right: 5px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>