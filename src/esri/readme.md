# 约定

1.[未执行] 为避免消息名称的冲突，规定 ibus 的消息格式为 消息源-消息名。

## todo

    1. Identify 弹出信息窗后feature呈现选中状态

## 配置

1. 初始定位

## layers 配置

```json
{
    "label": "厂房、办公楼、企业范围",
    "ltype": "mapimage",
    "disableIdentify": false, // 禁止 Identify , 默认 false
    "popupEnabled": true, // 自动弹出popup, 默认 true
    "layerInfos": [
        {
            "id": 0,
            "title": "厂房", // layer title
            "idField": "CFBH", // 标识字段
            "titleField": "BELONGTO", // title字段
            "searchFields": [""], // 可查询字段
            "popupEnabled": true, // 自动弹出popup, 默认 true
            "popupTemplate": {
                "fields": ["BZ", "CFBH", "QYBH"],
                "actions": [
                    {
                        "label": "缩放",
                        "event": "zoom-out",
                        "icon": "esri-icon-zoom-out-magnifying-glass"
                    }
                ],
                "remoteUrl": "/api/cf/:id"
            },
            "alias": [
                {
                    "field": "BZ",
                    "label": "BZ11"
                },
                {
                    "field": "CFBH",
                    "label": "厂房编码"
                },
                {
                    "field": "QYBH",
                    "label": "园区编码"
                }
            ]
        }
    ],
    "url": "http://arcgis.mascj.com:81/arcgis/rest/services/DT_jkq/Factory/MapServer"
}
```
