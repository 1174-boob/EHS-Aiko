const monthlyData = [
    {
        "nicheItemsCode": 1001,
        "projectName": "生产量",
        "nicheItems": "Array玻璃基板投入(片)",
        "dataItem": null
    },
    {
        "nicheItemsCode": 1002,
        "projectName": "投入面积",
        "nicheItems": "Array玻璃基板投入面积(㎡)",
        "dataItem": 1,
        "carBonName": "Array-in(㎡)",
        "carBonName1": "Array-in(㎡)"
    },
    {
        "nicheItemsCode": 1003,
        "projectName": "产值",
        "nicheItems": "月度(万元)",
        "dataItem": 2
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>能耗(仅生产，不包含食堂、厂中厂等其他单位)</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1004,
        "projectName": "电",
        "nicheItems": "电用量(kWh)",
        "dataItem": 4,
        "elecName": "总用电量(亿kwh)",
        "elecName1": "电量(百万kwh)"
    },
    {
        "nicheItemsCode": 1005,
        "projectName": "天然气",
        "nicheItems": "天然气用量(㎡)",
        "dataItem": 5,
        "carBonName": "天然气用量（万m3）"
    },
    {
        "nicheItemsCode": 1006,
        "projectName": "蒸汽",
        "nicheItems": " 蒸汽用量(t)",
        "dataItem": 6
    },
    {
        "nicheItemsCode": 1007,
        "projectName": "柴油",
        "nicheItems": "柴油用量(t)",
        "dataItem": 7
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>水(仅生产，不包含卫生间等)</b>",
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
        "nicheItemsCode": 1010,
        "projectName": "回收水",
        "nicheItems": " 回收水系统产水量(t)",
        "dataItem": 11
    },
    {
        "nicheItemsCode": 1011,
        "projectName": "UPW",
        "nicheItems": "UPW总用水量(t,不含回收系统浓水、反洗水等)",
        "dataItem": 12
    },
    {
        "nicheItemsCode": 1012,
        "projectName": "生产废水",
        "nicheItems": "生产废水排放量(t)",
        "dataItem": 13
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>大宗气体</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1013,
        "projectName": "氮气",
        "nicheItems": "氮气用量(m³)",
        "dataItem": 15
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>温室气体</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1014,
        "projectName": "SF6",
        "nicheItems": "用量(kg)",
        "dataItem": 17
    },
    {
        "nicheItemsCode": 1015,
        "projectName": "NF3(CVD)",
        "nicheItems": "用量(kg)",
        "dataItem": 18
    },
    {
        "nicheItemsCode": 1123,
        "projectName": "NF3(Etch)",
        "nicheItems": "用量(kg)",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1016,
        "projectName": "N₂0",
        "nicheItems": "用量(kg)",
        "dataItem": 19
    },
    {
        "nicheItemsCode": 1017,
        "projectName": "CF4",
        "nicheItems": "用量(kg)",
        "dataItem": 20
    },
    {
        "nicheItemsCode": 1018,
        "projectName": "CHF₃",
        "nicheItems": "用量(kg)",
        "dataItem": 21
    },
    {
        "nicheItemsCode": 1019,
        "projectName": "C2HF5",
        "nicheItems": "用量(kg)",
        "dataItem": 22
    },
    {
        "nicheItemsCode": 1020,
        "projectName": "CO2",
        "nicheItems": "用量(kg)",
        "dataItem": 23
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>危废</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1021,
        "projectName": "废酸",
        "nicheItems": "产生量 (kg)",
        "dataItem": 25,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 2, colspan: 1 }
    },
    {
        "nicheItemsCode": 1022,
        "projectName": "废酸",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 26
    },
    {
        "nicheItemsCode": 1023,
        "projectName": "废有机溶剂",
        "nicheItems": "产生量(kg)",
        "dataItem": 27
    },
    {
        "nicheItemsCode": 1024,
        "projectName": "废有机溶剂",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 28
    },
    {
        "nicheItemsCode": 1025,
        "projectName": "化学品垃圾",
        "nicheItems": "产生量(kg)",
        "dataItem": 29
    },
    {
        "nicheItemsCode": 1026,
        "projectName": "化学品垃圾",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 30
    },
    {
        "nicheItemsCode": 1027,
        "projectName": "其他危废",
        "nicheItems": "产生量 (kg)",
        "dataItem": 31
    },
    {
        "nicheItemsCode": 1028,
        "projectName": "其他危废",
        "nicheItems": "不含税处理费用(元)",
        "dataItem": 32
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>污泥</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1029,
        "projectName": "有机污泥",
        "nicheItems": "产生量 (kg)",
        "dataItem": 34
    },
    {
        "nicheItemsCode": 1030,
        "projectName": "有机污泥",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 35
    },
    {
        "nicheItemsCode": 1031,
        "projectName": "含氟污泥",
        "nicheItems": "产生量(kg)",
        "dataItem": 36
    },
    {
        "nicheItemsCode": 1032,
        "projectName": "含氟污泥",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 37
    },
    {
        "nicheItemsCode": 1033,
        "projectName": "含磷污泥",
        "nicheItems": "产生量(kg)",
        "dataItem": 38
    },
    {
        "nicheItemsCode": 1034,
        "projectName": "含磷污泥",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 39
    },
    {
        "nicheItemsCode": 1035,
        "projectName": "含铜污泥",
        "nicheItems": "产生量 (kg)",
        "dataItem": 40
    },
    {
        "nicheItemsCode": 1036,
        "projectName": "含铜污泥",
        "nicheItems": "不含税处理费用(元)",
        "dataItem": 41
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>废玻璃</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1037,
        "projectName": "废panel",
        "nicheItems": "产生量 (kg)",
        "dataItem": 43
    },
    {
        "nicheItemsCode": 1038,
        "projectName": "废panel",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 44
    },
    {
        "nicheItemsCode": 1039,
        "projectName": "废玻璃",
        "nicheItems": "产生量(kg)",
        "dataItem": 45
    },
    {
        "nicheItemsCode": 1040,
        "projectName": "废玻璃",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 46
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>电子废弃物(无价值)</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1041,
        "projectName": "偏光片",
        "nicheItems": "产生量 (kg)",
        "dataItem": 48
    },
    {
        "nicheItemsCode": 1042,
        "projectName": "偏光片",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 49
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>固废处置费用</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1043,
        "projectName": "固废处置费用合计",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 50,
        "rubbishName": "废弃物处置费用(百万元)"
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>电子废弃物(有价值)</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1044,
        "projectName": "PCB(A)/FPC(A)",
        "nicheItems": "产生量 (kg)",
        "dataItem": 52
    },
    {
        "nicheItemsCode": 1045,
        "projectName": "PCB(A)/FPC(A)",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 53
    },
    {
        "nicheItemsCode": 1046,
        "projectName": "其他电子废弃物",
        "nicheItems": "产生量 (kg)",
        "dataItem": 54
    },
    {
        "nicheItemsCode": 1047,
        "projectName": "其他电子废弃物",
        "nicheItems": "不含税处理费用 (元)",
        "dataItem": 55
    },
    {
        "nicheItemsCode": 1123,
        "projectName": "平均mask",
        "nicheItems": "平均mask",
        "dataItem": 56,
        "carBonName1": "平均mask",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 2 }
    },
    {
        "nicheItemsCode": 999,
        "dataItem": 99,
        "projectName": "<b>废水废气污染物排放</b>",
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 1, colspan: 3 }
    },
    {
        "nicheItemsCode": 1048,
        "projectName": "1#VOC(以NMHC计)",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 58,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1049,
        "projectName": "1#VOC(以NMHC计)",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 59,
    },
    {
        "nicheItemsCode": 1050,
        "projectName": "1#VOC(以NMHC计)",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 60,
    },
    {
        "nicheItemsCode": 1051,
        "projectName": "1#VOC(以NMHC计)",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 61
    },
    {
        "nicheItemsCode": 1052,
        "projectName": "2#VOC(以NMHC计)",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 62,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1053,
        "projectName": "2#VOC(以NMHC计)",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 63
    },
    {
        "nicheItemsCode": 1054,
        "projectName": "2#VOC(以NMHC计)",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 64
    },
    {
        "nicheItemsCode": 1055,
        "projectName": "2#VOC(以NMHC计)",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 65
    },
    {
        "nicheItemsCode": 1056,
        "projectName": "1#酸排NOx",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 66,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1057,
        "projectName": "1#酸排NOx",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 67
    },
    {
        "nicheItemsCode": 1058,
        "projectName": "1#酸排NOx",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 68
    },
    {
        "nicheItemsCode": 1059,
        "projectName": "1#酸排NOx",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 69
    },
    {
        "nicheItemsCode": 1060,
        "projectName": "1#工艺排NOx",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 70,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1061,
        "projectName": "1#工艺排NOx",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 71
    },
    {
        "nicheItemsCode": 1062,
        "projectName": "1#工艺排NOx",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 72
    },
    {
        "nicheItemsCode": 1063,
        "projectName": "1#工艺排NOx",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 73
    },
    {
        "nicheItemsCode": 1064,
        "projectName": "2#酸排NOx",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 74,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 4, colspan: 1 }
    },
    {
        "nicheItemsCode": 1065,
        "projectName": "2#酸排NOx",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 75
    },
    {
        "nicheItemsCode": 1066,
        "projectName": "2#酸排NOx",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 76
    },
    {
        "nicheItemsCode": 1067,
        "projectName": "2#酸排NOx",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 77
    },
    {
        "nicheItemsCode": 1068,
        "projectName": "COD",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 78,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1069,
        "projectName": "COD",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 79
    },
    {
        "nicheItemsCode": 1070,
        "projectName": "COD",
        "nicheItems": "第三方监测浓度(mg/m3)",
        "dataItem": 80
    },
    {
        "nicheItemsCode": 1072,
        "projectName": "NH₃-N",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 81,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1073,
        "projectName": "NH₃-N",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 82
    },
    {
        "nicheItemsCode": 1074,
        "projectName": "NH₃-N",
        "nicheItems": "第三方监测浓度(mg/l)",
        "dataItem": 83
    },
    {
        "nicheItemsCode": 1076,
        "projectName": "TP",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 84,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1077,
        "projectName": "TP",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 85
    },
    {
        "nicheItemsCode": 1078,
        "projectName": "TP",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 86
    },
    {
        "nicheItemsCode": 1080,
        "projectName": "F",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 87,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1081,
        "projectName": "F",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 88
    },
    {
        "nicheItemsCode": 1082,
        "projectName": "F",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 89
    },
    {
        "nicheItemsCode": 1084,
        "projectName": "Cu",
        "nicheItems": "最大排放浓度(mg/m3)",
        "dataItem": 90,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 3, colspan: 1 }
    },
    {
        "nicheItemsCode": 1085,
        "projectName": "Cu",
        "nicheItems": "均排放浓度(mg/m3)",
        "dataItem": 91
    },
    {
        "nicheItemsCode": 1086,
        "projectName": "Cu",
        "nicheItems": "第三方检测风量(㎡/h)",
        "dataItem": 92
    },
    {
        "nicheItemsCode": 1088,
        "projectName": "总耗",
        "nicheItems": "总能耗1(吨标煤)=电(kwh)*0.1229/1000+蒸汽(吨)*2.512*0.03412+天然气(立方米)*1.33/1000+柴油(吨)*1.4571",
        "dataItem": 0,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 15, colspan: 1 }
    },
    {
        "nicheItemsCode": 1089,
        "projectName": "总耗",
        "nicheItems": "总能耗2(吨标煤，含耗能工质)=电(kwh)*0.1229/1000+蒸汽(吨)*2.512*0.03412+天然气(立方米)*1.33/1000+柴油(吨)*1.4571+自来水(t)*0.0857/1000+氮气(m3)*0.6714/1000+氧气(m3)*0.4/1000",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1090,
        "projectName": "总耗",
        "nicheItems": "总能耗(兆瓦时)=总能耗1(吨标煤)/0.1229",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1091,
        "projectName": "总耗",
        "nicheItems": "总水耗(吨)=自来水(吨)+再生水(吨)",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1092,
        "projectName": "总耗",
        "nicheItems": "总废弃物(千克)=废酸+废有机溶剂+化学品垃圾+其他危废+有机污泥+含氟污泥+含磷污泥+含铜污泥+废panel+废玻璃+偏光片+PCB+其他电子废弃物",
        "dataItem": 0,
        "rubbishName": "废弃物处置量(万t)"
    },
    {
        "nicheItemsCode": 1093,
        "projectName": "总耗",
        "nicheItems": "总危废(千克)=废酸+废有机溶剂+化学品垃圾+其他危废+PCB/FPC",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1094,
        "projectName": "总耗",
        "nicheItems": "总污泥(千克)=有机污泥+含氟污泥+含磷污泥+含铜污泥",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1095,
        "projectName": "总耗",
        "nicheItems": "碳排放量(scope2)-外购电力(吨)=电网排放因子(吨CO2/兆瓦时)*总电耗(兆瓦时)说明:电网排放因子:B1/B4/B6/BMDT:0.8843；B2/B7/B8/B11/B17/B19:0.5257；B3/B5/B9/B10/B18:0.7035；BMOT:0.5271)",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1096,
        "projectName": "总耗",
        "nicheItems": "碳排放量(scope2)-外购热力(吨)=蒸汽(吨)*2.51(GJ/吨)*0.11",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1097,
        "projectName": "总耗",
        "nicheItems": "碳排放量(scope2)(吨)=电力+蒸汽",
        "dataItem": 0,
        "carBonName": "scope2(万tCO₂e)",
        "carBonName1": "scope2(tCO₂e)"
    },
    {
        "nicheItemsCode": 1098,
        "projectName": "总耗",
        "nicheItems": "碳排放量(scope1)-燃料燃烧(吨)=天然气(万立方米)*21.62+柴油(吨)*3.10",
        "dataItem": 0,
        "carBonName": "scope1-Natural gas、diesel",
        "carBonName1": "scope1-Natural gas、diesel"
    },
    {
        "nicheItemsCode": 1099,
        "projectName": "总耗",
        "nicheItems": "能源折合碳排放量(吨)",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1101,
        "projectName": "总耗",
        "nicheItems": "碳排放量（scope1)-F-GHG（吨）=SF6*0.3*(1-0.95)*23500/1000+NF3(CVD)*0.03*(1-0.95)*16100/1000+NF3(Etch)*0.11*(1-0.95)*16100/1000+CF4*0.6*(1-0.89)*6630/1000+CHF3*0.2*(1-0.98)*12400/1000+N2O*0.63*(1-0.6)*265/1000+CHF3*0.07*(1-0.89)*6630/1000+CHF3*0.05*(1-0.95)*11100/1000【2019 年 IPCC 国家温室气体清单指南】",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1102,
        "projectName": "总耗",
        "nicheItems": "碳排放量（scope1)-F-GHG（吨）=SF6*（1-0.1）*（1-0.8）*（1-0.9*0.9）*22800/1000+NF3*（1-0.1）*（1-0.8）*（1-0.9*0.95）*17200/1000+CF4*(1-0.1)*(1-0.1)*(1-0.9*0.9)*7390/1000+CHF3*（1-0.1）*(1-0.6)*(1-0.9*0.9)*12400/1000+NF3*(1-0.1)*0.09*(1-0.9*0.9)*7390/1000+CHF3*(1-0.1)*0.07*(1-0.9*0.9)*7390/1000【中国电子设备制造企业温室气体核算方法与报告指南】",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1103,
        "projectName": "总耗",
        "nicheItems": "碳排放总量（吨）=能源折算+F-GHG折算（IPCC导则）",
        "dataItem": 0,
        "carBonName": "碳排放总量（吨）=能源折算+F-GHG折算（IPCC导则）",
        "carBonName1": "碳排放总量（吨）=能源折算+F-GHG折算（IPCC导则）"
    },
    {
        "nicheItemsCode": 1105,
        "projectName": "单耗",
        "nicheItems": "万元产值能耗1（吨标煤/万元产值）=总能耗1（吨标煤）/产值（万元）",
        "dataItem": 0,
        needMerge: true,
        mergeCellsObj: { col: 0, rowspan: 18, colspan: 1 }
    },
    {
        "nicheItemsCode": 1106,
        "projectName": "单耗",
        "nicheItems": "万元产值水耗（吨/万元产值）=总水耗（万吨）*10000/产值（万元）",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1107,
        "projectName": "单耗",
        "nicheItems": "万元产值废弃物（千克/万元产值）=总废弃物（吨）*1000/产值（万元）",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1108,
        "projectName": "单耗",
        "nicheItems": "单位面积能耗1（kg标煤/单位平米基板）=总能耗1（吨标煤）*1000/投入面积（m2）",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1109,
        "projectName": "单耗",
        "nicheItems": "单位面积能耗1（千瓦时/单位平米基板）=总能耗1（兆瓦时）*1000/投入面积（m2）",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1110,
        "projectName": "单耗",
        "nicheItems": "单位面积电耗（千瓦时/单位平米基板）=用电量（kwh)/投入面积（m2）",
        "dataItem": 0,
        "carBonName": "电耗(kWh/m2)",
        "elecName": "单位面积用电量(kwh/㎡)",
        "elecName1": "电耗(kwh/㎡)",
        "pieceName": "Energy(kwh/㎡)"
    },
    {
        "nicheItemsCode": 1111,
        "projectName": "单耗",
        "nicheItems": "单位面积天然气（m3/m2）=天然气/投入面积",
        "dataItem": 0,
        "carBonName": "单位面积天然气（m3/m2）=天然气/投入面积"
    },
    {
        "nicheItemsCode": 1112,
        "projectName": "单耗",
        "nicheItems": "单位面积水耗（吨/单位平米基板）=总新鲜水量（吨）/投入面积（m2）",
        "dataItem": 0,
        "waterName": "单耗(t/m²)",
        "carBonName": "水耗(t/m2)",
        "carBonName1": "单位面积排水量(m3/m2)",
        "pieceName": "Water(t/㎡)"
    },
    {
        "nicheItemsCode": 1113,
        "projectName": "单耗",
        "nicheItems": "单位面积废弃物（千克/单位平米基板）=总废弃物（千克）/投入面积（m2）",
        "dataItem": 0,
        "carBonName": "废弃物单耗(kg/m2)",
        "pieceName": "Waste(kg/㎡）",
        "rubbishName": "废弃物单耗(kg/m2)"
    },
    {
        "nicheItemsCode": 1114,
        "projectName": "单耗",
        "nicheItems": "单位面积二氧化碳排放量（kgCO2/m2）=总碳排放量（t）*1000/投入面积（m2）",
        "dataItem": 0,
        "carBonName": "碳排放强度(kgCO2/m2)"
    },
    {
        "nicheItemsCode": 1115,
        "projectName": "单耗",
        "nicheItems": "单位产品基准排水量（m3/m2）",
        "dataItem": 0,
        "carBonName1": "单位产品基准排水量(m3/m2)"
    },
    {
        "nicheItemsCode": 1116,
        "projectName": "单耗",
        "nicheItems": "单位面积污泥（千克/单位平米基板）=总污泥（千克）/投入面积（m2）",
        "dataItem": 0
    },
    // {
    //     "nicheItemsCode": 1117,
    //     "projectName": "单耗",
    //     "nicheItems": "单位面积含氟气体折合二氧化碳排放量（kgCO2/m2）=碳排放量（kg）/投入面积（m2）（PFC按照IPCC排放因子核算）",
    //     "dataItem": 0
    // },
    {
        "nicheItemsCode": 1118,
        "projectName": "单耗",
        "nicheItems": "单位面积含氟气体折合二氧化碳排放量（kgCO2/m2）=碳排放量(kg)/投入面积（m2）（PFC按照发改委-电子行业核算方法）",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1119,
        "projectName": "单耗",
        "nicheItems": "废弃物平均处置单价（元/kg）",
        "dataItem": 0,
        "carBonName": "废弃物单价(元/t)",
        "rubbishName": "平均处置单价(元/kg)"
    },
    {
        "nicheItemsCode": 1120,
        "projectName": "单耗",
        "nicheItems": "万元产值二氧化碳排放量（kgCO2/万元）",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1121,
        "projectName": "单耗",
        "nicheItems": "单位面积含氟气体折合二氧化碳排放量（kgCO2/m2）=碳排放量（kg）/投入面积（m2）(2019 IPCC)",
        "dataItem": 0
    },
    {
        "nicheItemsCode": 1122,
        "projectName": "单耗",
        "nicheItems": "单位面积二氧化碳排放量（kgCO2/m2）=碳排放量（kg）/投入面积（m2）(2019 IPCC+能源)",
        "dataItem": 0,
        "carBonName": "排放强度(kgCO₂e/m²)",
        "carBonName1": "排放强度(kgCO₂e/m²)",
        "pieceName": "GHG(kgCO2e/㎡)"
    },
    {
        "nicheItemsCode": 9999,
        "carBonName": "scope1(万tCO₂e)",
        "carBonName1": "scope1(tCO₂e)",
        "waterName": "新鲜水量(万t)",
        "rubbishName": "废弃物单价(元/t)"
    }
]
export default monthlyData