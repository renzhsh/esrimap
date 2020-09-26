export default {
  data() {
    return {
      graphicInUpdate: null,
      UpdateEnable: false
    };
  },
  created() {
    // ************************************************************************************
    // set up logic to handle geometry update and reflect the update on "tempGraphicsLayer"
    // ************************************************************************************
    let view = this.esriMap.view;
    view.on("click", evt => {
      this.UpdateEnable &&
        view.hitTest(evt).then(response => {
          var results = response.results;
          if (results.length == 0) return;
          // Found a valid graphic
          if (results.length && results[results.length - 1].graphic) {
            // Check if we're already editing a graphic
            if (!this.graphicInUpdate) {
              // Save a reference to the graphic we intend to update
              this.graphicInUpdate = results[results.length - 1].graphic;
              // Remove the graphic from the GraphicsLayer
              // Sketch will handle displaying the graphic while being updated
              // this.tempGraphicsLayer.remove(this.graphicInUpdate);
              this.sketchViewModel.update(this.graphicInUpdate.geometry);
            }
          }
        });
    });
  },
  methods: {
    updateGraphic(evt) {
      if (!this.graphicInUpdate) return;
      const graphic = this.createGeoGraphic(evt.geometry, {
        objectId: this.graphicInUpdate.attributes.OBJECTID
      });

      this.featureLayer
        .applyEdits({
          updateFeatures: [graphic]
        })
        .then(res => {
          //   this.sketchViewModel.complete();
          this.graphicInUpdate = null;
          this.featureLayer.refresh();
        });
    },
    editAttributes() {
      this.$notify.info({
        title: "提醒",
        message: "敬请期待"
      });
      return;
      if (this.graphicInUpdate) {
        let geometry = this.graphicInUpdate.geometry;
        let attributes = this.graphicInUpdate.attributes;
        if (
          ["polygon", "rectangle", "circle", "ellipse"].indexOf(geometry.type) >
          -1
        ) {
          this.chooseType = {
            show: true,
            attributes: attributes
          };
        }
        this.sketchViewModel.complete();
      } else {
        this.$notify.info({
          title: "提醒",
          message: "请先选择要编辑的图形"
        });
      }
    },
    deleteGraphic() {
      if (this.graphicInUpdate) {
        this.featureLayer
          .applyEdits({
            deleteFeatures: [
              {
                objectId: this.graphicInUpdate.attributes.OBJECTID
              }
            ]
          })
          .then(res => {
            this.sketchViewModel.reset();
            this.graphicInUpdate = null;
            this.featureLayer.refresh();
          });
      } else {
        this.$notify.info({
          title: "提醒",
          message: "请先选择要删除的图形"
        });
      }
    }
  },
  watch: {
    UpdateEnable() {
      if (this.UpdateEnable && this.drawing) {
        this.cancelDraw();
      }

      // 开启 编辑
      if (this.UpdateEnable) {
        if (!this.featureLayer && !this.getFeatureLayer()) {
          this.UpdateEnable = false;
          return;
        }
      }

      // 关闭 编辑
      if (!this.UpdateEnable) {
        this.sketchViewModel.reset();
        this.graphicInUpdate = null;
      }
    }
  }
};
