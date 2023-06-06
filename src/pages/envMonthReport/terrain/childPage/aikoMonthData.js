const monthlyData = [
    {
        "nicheItemsCode": 1001,
        "projectName": "产能",
        "nicheItems": "电池片产能(MW)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1002,
        "projectName": "产值",
        "nicheItems": "月度(万元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>能耗</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "电",
        "nicheItems": "电用量(kWh)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>水</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1008,
        "projectName": "新鲜水",
        "nicheItems": "自来水用量(t)",
        "dataItem": 9,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 2, colspan: 1 }
    },
    {
        "nicheItemsCode": 1009,
        "projectName": "新鲜水",
        "nicheItems": "再生水用量(t)",
        "dataItem": 10
    },
    {
        "nicheItemsCode": 1009,
        "projectName": "回用水",
        "nicheItems": "回用水用量(t)",
        "dataItem": 10
    },
    {
        "nicheItemsCode": 1009,
        "projectName": "生产废水",
        "nicheItems": "生产废水排放量(t)",
        "dataItem": 10
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>大宗气体</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "氮气",
        "nicheItems": "氮气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "氧气",
        "nicheItems": "氧气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "氢气",
        "nicheItems": "氢气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "氩气",
        "nicheItems": "氩气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>室温气体</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "N₂0",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>特气</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "三氯氧磷",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "硅烷",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "TMA",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "氨气",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>危废</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废活性炭",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废活性炭",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废有机溶剂",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废有机溶剂",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废矿物油",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废矿物油",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废滤芯",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废滤芯",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废填料",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废填料",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废抹布手套",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废抹布手套",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "酸性沉渣",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "酸性沉渣",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "含铜、锡污泥",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "含铜、锡污泥",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废化学品包装物",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "废化学品包装物",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>污泥</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "污泥",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "污泥",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>其他废气物</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "银浆布",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "银浆布",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "银浆罐",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "银浆罐",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "铝浆布",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "铝浆布",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "铝浆罐",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "铝浆罐",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>固废处置费用</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "固废处置费用合计",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>污染物数据</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "最大排放速率(mg/m3)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期VOC(以NMHC计)",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期VOC(以NMHC计)",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期VOC(以NMHC计)",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "石墨舟、石英舟清洗氯化氢",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "石墨舟、石英舟清洗氯化氢",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "石墨舟、石英舟清洗氯化氢",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "石墨舟、石英舟清洗氟化物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "石墨舟、石英舟清洗氟化物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "石墨舟、石英舟清洗氟化物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "石墨舟、石英舟饱和硅烷排氨气",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "石墨舟、石英舟饱和硅烷排氨气",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "石墨舟、石英舟饱和硅烷排氨气",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "石墨舟、石英舟饱和硅烷排颗粒物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "石墨舟、石英舟饱和硅烷排颗粒物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "石墨舟、石英舟饱和硅烷排颗粒物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期SINx沉积硅烷排氨气",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期SINx沉积硅烷排氨气",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期SINx沉积硅烷排氨气",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期SINx沉积硅烷排颗粒物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期SINx沉积硅烷排颗粒物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期SINx沉积硅烷排颗粒物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期薄膜沉积硅烷排氨气",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期薄膜沉积硅烷排氨气",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期薄膜沉积硅烷排氨气",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期薄膜沉积硅烷排颗粒物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期薄膜沉积硅烷排颗粒物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期薄膜沉积硅烷排颗粒物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期NH3-N",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期NH3-N",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期NH3-N",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期TN",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期TN",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期TN",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期TP",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期TP",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期TP",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期COD",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期COD",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期COD",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期PH",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期PH",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期PH",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "一期F-",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "一期F-",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "一期F-",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "总耗",
        "nicheItems": "总能耗1(吨标煤)=电(kwh)*0.1229/1000",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 8, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "总耗",
        "nicheItems": "总能耗2(吨标煤,含耗能工质）=电(kwh)*0.1229/1000+自来水(t)*0.0857/1000+氮气(m3)*0.6714/1000+氧气(m3)*0.4/1000",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "总耗",
        "nicheItems": "总能耗(兆瓦时)=总能耗1(吨标煤)/0.1229",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "总耗",
        "nicheItems": "总水耗(吨)=自来水(吨)+江水(吨)+再生水(吨)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "总耗",
        "nicheItems": "总废弃物(千克)=废活性炭+废有机溶剂+废矿物油+废滤芯+废填料+废抹布手套+酸性沉渣+含铜、锡污泥+废化学品包装物+污泥+银浆布+银浆罐+铝浆布+铝浆罐",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "总耗",
        "nicheItems": "总危废(千克)=废活性炭+废有机溶剂+废矿物油+废滤芯+废填料+废抹布手套+酸性沉渣+含铜、锡污泥+废化学品包装物",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "总耗",
        "nicheItems": "总污泥(千克)=有机污泥+含氟污泥",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "总耗",
        "nicheItems": "碳排放量(scope2)-外购电力(吨)=电网排放因子(吨CO2/兆瓦时)*总电耗(兆瓦时)",
        "dataItem": 60,
    },
]
export default monthlyData