const aikoMonthData = [
    {
        "nicheItemsCode": 1,
        "projectName": "产能",
        "nicheItems": "电池片产能(MW)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 2,
        "projectName": "产值",
        "nicheItems": "月度(万元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>能源</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 3,
        "projectName": "电",
        "nicheItems": "电用量(kWh)",
        "elecName": "总用电量(亿kwh)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>水</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 4,
        "projectName": "新鲜水",
        "nicheItems": "自来水用量(t)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 2, colspan: 1 }
    },
    {
        "nicheItemsCode": 5,
        "projectName": "新鲜水",
        "nicheItems": "江水用量(t)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 6,
        "projectName": "回用水",
        "nicheItems": "回用水用量(t)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 7,
        "projectName": "生产废水",
        "nicheItems": "生产废水排放量(t)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>大宗气体</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 8,
        "projectName": "氮气",
        "nicheItems": "氮气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 9,
        "projectName": "氧气",
        "nicheItems": "氧气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 10,
        "projectName": "氢气",
        "nicheItems": "氢气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 11,
        "projectName": "氩气",
        "nicheItems": "氩气用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>室温气体</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 12,
        "projectName": "N₂0",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>特气</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 13,
        "projectName": "三氯氧磷",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 14,
        "projectName": "硅烷",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 15,
        "projectName": "TMA",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 16,
        "projectName": "氨气",
        "nicheItems": "用量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>危废</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 17,
        "projectName": "废活性炭",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 18,
        "projectName": "废活性炭",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 19,
        "projectName": "废有机溶剂",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 20,
        "projectName": "废有机溶剂",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 21,
        "projectName": "废矿物油",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 22,
        "projectName": "废矿物油",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 23,
        "projectName": "废滤芯",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 24,
        "projectName": "废滤芯",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 25,
        "projectName": "废填料",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 26,
        "projectName": "废填料",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 27,
        "projectName": "废抹布手套",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 28,
        "projectName": "废抹布手套",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 29,
        "projectName": "酸性沉渣",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 30,
        "projectName": "酸性沉渣",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 31,
        "projectName": "含铜、锡污泥",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 32,
        "projectName": "含铜、锡污泥",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 33,
        "projectName": "废化学品包装物",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 34,
        "projectName": "废化学品包装物",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>污泥</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 35,
        "projectName": "污泥",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 36,
        "projectName": "污泥",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>其他废气物</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 37,
        "projectName": "银浆布",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 38,
        "projectName": "银浆布",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 39,
        "projectName": "银浆罐",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 40,
        "projectName": "银浆罐",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 41,
        "projectName": "铝浆布",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 42,
        "projectName": "铝浆布",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 43,
        "projectName": "铝浆罐",
        "nicheItems": "产生量(kg)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 44,
        "projectName": "铝浆罐",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>固废处置费用</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 45,
        "projectName": "固废处置费用合计",
        "nicheItems": "不含税处置费用(元)",
        "dataItem": null,
        "rubbishName": "废弃物处置费用(百万元)"
    },
    {
        "nicheItemsCode": 999,
        "dataItem": null,
        "projectName": "<b>污染物数据</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 46,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 47,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 48,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 49,
        "projectName": "一期制绒清洗、磷扩散氯气",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 50,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 51,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 52,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 53,
        "projectName": "一期制绒清洗、磷扩散氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 54,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 55,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 56,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 57,
        "projectName": "一期制绒清洗、磷扩散氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 58,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 59,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "平均排放浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 60,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 61,
        "projectName": "一期制绒清洗-1、硼扩散氯气",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 62,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 63,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 64,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 65,
        "projectName": "一期制绒清洗-1、硼扩散氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 66,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 67,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 68,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 69,
        "projectName": "一期制绒清洗-1、硼扩散氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 70,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 71,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 72,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 73,
        "projectName": "一期刻蚀氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 74,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 75,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 76,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 77,
        "projectName": "一期刻蚀氮氧化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 78,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 79,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 80,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 81,
        "projectName": "一期刻蚀氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 82,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 83,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 84,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 85,
        "projectName": "一期清洗-2氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 86,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 87,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 88,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 89,
        "projectName": "一期清洗-2氟化物",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 90,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "最大排放速率(kg/h)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 91,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "平均排放浓度(kg/h)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 92,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 93,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 94,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 95,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 96,
        "projectName": "一期清洗-3氯化氢",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 97,
        "projectName": "一期VOC(以NMHC计)",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 98,
        "projectName": "一期VOC(以NMHC计)",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 99,
        "projectName": "一期VOC(以NMHC计)",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 100,
        "projectName": "石墨舟、石英舟清洗氯化氢",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 101,
        "projectName": "石墨舟、石英舟清洗氯化氢",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 102,
        "projectName": "石墨舟、石英舟清洗氯化氢",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 103,
        "projectName": "石墨舟、石英舟清洗氟化物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 104,
        "projectName": "石墨舟、石英舟清洗氟化物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 105,
        "projectName": "石墨舟、石英舟清洗氟化物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 106,
        "projectName": "石墨舟、石英舟饱和硅烷排氨气",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 107,
        "projectName": "石墨舟、石英舟饱和硅烷排氨气",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 108,
        "projectName": "石墨舟、石英舟饱和硅烷排氨气",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 109,
        "projectName": "石墨舟、石英舟饱和硅烷排颗粒物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 110,
        "projectName": "石墨舟、石英舟饱和硅烷排颗粒物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 111,
        "projectName": "石墨舟、石英舟饱和硅烷排颗粒物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 112,
        "projectName": "一期SINx沉积硅烷排氨气",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 113,
        "projectName": "一期SINx沉积硅烷排氨气",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 114,
        "projectName": "一期SINx沉积硅烷排氨气",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 115,
        "projectName": "一期SINx沉积硅烷排颗粒物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 116,
        "projectName": "一期SINx沉积硅烷排颗粒物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 117,
        "projectName": "一期SINx沉积硅烷排颗粒物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 118,
        "projectName": "一期薄膜沉积硅烷排氨气",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 119,
        "projectName": "一期薄膜沉积硅烷排氨气",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 120,
        "projectName": "一期薄膜沉积硅烷排氨气",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 121,
        "projectName": "一期薄膜沉积硅烷排颗粒物",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 122,
        "projectName": "一期薄膜沉积硅烷排颗粒物",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 123,
        "projectName": "一期薄膜沉积硅烷排颗粒物",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 124,
        "projectName": "一期NH3-N",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 125,
        "projectName": "一期NH3-N",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 126,
        "projectName": "一期NH3-N",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 127,
        "projectName": "一期TN",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 128,
        "projectName": "一期TN",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 129,
        "projectName": "一期TN",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 130,
        "projectName": "一期TP",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 131,
        "projectName": "一期TP",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 132,
        "projectName": "一期TP",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 133,
        "projectName": "一期COD",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 134,
        "projectName": "一期COD",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 135,
        "projectName": "一期COD",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 136,
        "projectName": "一期PH",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 137,
        "projectName": "一期PH",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 138,
        "projectName": "一期PH",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 139,
        "projectName": "一期F-",
        "nicheItems": "最大排放浓度(mg/l)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 140,
        "projectName": "一期F-",
        "nicheItems": "平均排放浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 141,
        "projectName": "一期F-",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 142,
        "projectName": "总耗",
        "nicheItems": "总能耗1(吨标煤)=电(kwh)*0.1229/1000",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 8, colspan: 1 }
    },
    {
        "nicheItemsCode": 143,
        "projectName": "总耗",
        "nicheItems": "总能耗2(吨标煤,含耗能工质）=电(kwh)*0.1229/1000+自来水(t)*0.0857/1000+氮气(m3)*0.6714/1000+氧气(m3)*0.4/1000",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 144,
        "projectName": "总耗",
        "nicheItems": "总能耗(兆瓦时)=总能耗1(吨标煤)/0.1229",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 145,
        "projectName": "总耗",
        "nicheItems": "总水耗(吨)=自来水(吨)+江水(吨)+再生水(吨)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 146,
        "projectName": "总耗",
        "nicheItems": "总废弃物(千克)=废活性炭+废有机溶剂+废矿物油+废滤芯+废填料+废抹布手套+酸性沉渣+含铜、锡污泥+废化学品包装物+污泥+银浆布+银浆罐+铝浆布+铝浆罐",
        "dataItem": null,
        "rubbishName": "废弃物处置量(万t)"
    },
    {
        "nicheItemsCode": 147,
        "projectName": "总耗",
        "nicheItems": "总危废(千克)=废活性炭+废有机溶剂+废矿物油+废滤芯+废填料+废抹布手套+酸性沉渣+含铜、锡污泥+废化学品包装物",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 148,
        "projectName": "总耗",
        "nicheItems": "总污泥(千克)=有机污泥+含氟污泥",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 149,
        "projectName": "总耗",
        "nicheItems": "碳排放量(scope2)-外购电力(吨)=电网排放因子(吨CO2/兆瓦时)*总电耗(兆瓦时)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 150,
        "projectName": "单耗",
        "nicheItems": "万元产值能耗1(吨标煤/万元产值)=总能耗1(吨标煤）)/产值(万元)",
        "dataItem": null,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 151,
        "projectName": "单耗",
        "nicheItems": "万元产值水耗(吨/万元产值)=总水耗(万吨)*10000/产值(万元)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 152,
        "projectName": "单耗",
        "nicheItems": "万元产值废弃物(千克/万元产值)=总废弃物(吨)*1000/产值(万元)",
        "dataItem": null,
    },
    {
        "nicheItemsCode": 9999,
        "carBonName": "scope1(万tCO₂e)",
        "carBonName1": "scope1(tCO₂e)",
        "waterName": "新鲜水量(万t)",
        "rubbishName": "废弃物单价(元/t)"
    }
]
export default aikoMonthData