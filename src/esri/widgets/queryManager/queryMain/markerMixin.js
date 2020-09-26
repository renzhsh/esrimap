import { markerUrl } from "./markerUrl";
import { esri } from "../../../core";
import axios from "axios";
export default {
    data() {
        return {
            markerSymbol: {
                type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                url: markerUrl,
                width: "40px",
                height: "40px"
            }
        };
    },
    mounted() {
        let view = this.esriMap.view;

        view.on("click", event => {
            let screenPoint = {
                x: event.x,
                y: event.y
            };

            view.hitTest(screenPoint).then(resp => {
                if (resp.results == 0) return;

                this.showPopup(resp.results[0]);
            });
        });
    },
    methods: {
        showPopup({ graphic, mapPoint } = marker) {
            let attributes = graphic.attributes;

            let meta = graphic.info;

            let title = attributes[meta.titleField];

            let template = meta.popupTemplate;

            let hasProps =
                template && template.fields && template.fields.length;

            let hasRemoteFn = template.remoteUrl && meta.idField;

            if (!hasProps && !hasRemoteFn) {
                setTimeout(() => {
                    this.esriMap.popup.open(mapPoint, {
                        mode: "title",
                        title: title
                    });
                }, 300);
                return;
            }

            let props = [];
            let propFields = meta.alias.filter(
                f => template.fields.indexOf(f.field) > -1
            );

            propFields.forEach(f => {
                props.push({
                    label: f.label,
                    text: attributes[f.field]
                });
            });

            if (hasRemoteFn) {
                var url = template.remoteUrl;

                url = url.replace(/:id/g, attributes[meta.idField]);

                axios
                    .get(url)
                    .then(resp => {
                        if (resp.data.Success) {
                            let opt = Object.assign({
                                    title: title,
                                    property: props,
                                    actions: template.actions
                                },
                                resp.data.Data
                            );

                            this.esriMap.popup.open(mapPoint, opt);
                        }
                    })
                    .catch(er => er);
            } else {
                setTimeout(() => {
                    this.esriMap.popup.open(mapPoint, {
                        title: title,
                        property: props,
                        actions: template.actions
                    });
                }, 300);
            }
        },
        showMarkers(features) {
            let markers = features
                .filter(f => f.info && f.attributes && f.geometry)
                .map(f => {
                    let geo = f.geometry;

                    if (geo.type == "polygon") geo = geo.centroid;

                    return esri.Graphic({
                        attributes: f.attributes,
                        geometry: geo,
                        info: f.info,
                        symbol: this.markerSymbol
                    });
                });

            this.queryResults = markers.map(m => {

                let attributes = m.attributes;

                let meta = m.info;

                return {
                    label: attributes[meta.titleField],
                    mapPoint: m.geometry,
                    graphic: m
                }
            });

            this.tempGraphicsLayer.addMany(markers);
        }
    }
};