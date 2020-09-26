import Spring from "rzs-spring";

/**********************第三方插件*************************/
// element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";

// Spring.use(ElementUI);

import animate from "animate.css";
import "font-awesome/css/font-awesome.css";
// Spring.use(animate);
/**********************自定义插件*************************/

/**********************功能模块配置**********************/

// 拦截器
// import { routerAuth, axiosReq, axiosResp } from "./config/interceptors/";

// 用户数据
import userDatas from "./config/userData";

import Esrimap from "./esri";

import System from "@/views/System";
import LandManage from "@/views/LandManage";
import SpotComparison from "@/views/SpotComparison";
import App from "./App";

const spring = new Spring();

spring
  .set("userData", userData => {
    userData.setLocalEntryArray(userDatas);
  })
  .use([Esrimap, ElementUI, animate])
  .use([System, LandManage, SpotComparison])
  .setup({
    el: "#app",
    render: h => h(App)
  });
