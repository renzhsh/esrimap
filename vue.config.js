// vue.config.js
module.exports = {
    chainWebpack: config => {
    //   if (process.env.NODE_ENV === "production") {
    //     config.externals({
    //       axios: "axios",
    //       jquery: "$",
    //       leaflet: "L",
    //       proj4: "proj4",
    //       vue: "Vue"
    //     });
    //   }
  
      config.resolve.alias.set("esri", "@/esri")
    }
  };
  