
/**
 * @author: 成礼雄
 * @description 环境月报填报公式
 */
import { BigNumber } from "bignumber.js";
const formulaMixin = {
    methods: {
        v1088Fn() {

            let val = BigNumber(this.getDataItem(1004)).multipliedBy(0.1229).dividedBy(1000)
                .plus(BigNumber(this.getDataItem(1006)).multipliedBy(2.512).multipliedBy(0.03412))
                .plus(BigNumber(this.getDataItem(1005)).multipliedBy(this.v1088NaturalGasBase).dividedBy(1000))
                .plus(BigNumber(this.getDataItem(1007)).multipliedBy(1.4571))

            return val
        },
        //总能耗2(吨标煤，含耗能工质
        v1089Fn() {
            // C5*0.1229/1000+
            // C7*2.512*0.03412+
            // C6*1.33/1000+
            // C8*1.4571+
            // (C10+C11)*0.0857/1000+
            // C16*0.6714/1000

            let c10c11 = BigNumber(this.getDataItem(1008)).plus(BigNumber(this.getDataItem(1009)))

            // C5*0.1229/1000+
            let val = BigNumber(this.getDataItem(1004)).multipliedBy(0.1229).dividedBy(1000)
                // C7*2.512*0.03412+
                .plus(BigNumber(this.getDataItem(1006)).multipliedBy(2.512).multipliedBy(0.03412))
                // C6*1.33/1000+
                .plus(BigNumber(this.getDataItem(1005)).multipliedBy(1.33).dividedBy(1000))
                // C8*1.4571+
                .plus(BigNumber(this.getDataItem(1007)).multipliedBy(1.4571))
                // (C10+C11)*0.0857/1000+
                .plus(BigNumber(c10c11).multipliedBy(0.0857).dividedBy(1000))
                // C16*0.6714/1000
                .plus(BigNumber(this.getDataItem(1013)).multipliedBy(0.6714).dividedBy(1000))

            // let val = (
            //     (Number(this.getDataItem(1004)) * 0.1229) / 1000 +
            //     Number(this.getDataItem(1006)) * 2.512 * 0.03412 +
            //     (Number(this.getDataItem(1005)) * 1.33) / 1000 +
            //     Number(this.getDataItem(1007)) * 1.4571 +
            //     (Number(this.getDataItem(1008)) * 0.1229 * 0.0857) /
            //     1000 +
            //     (Number(this.getDataItem(1013)) * 0.6714) / 1000
            // )
            return val
        },
        //总能耗(兆瓦时)
        v1090Fn() {
            // C96/0.1229
            let val = BigNumber(this.v1088Fn()).dividedBy(0.1229)
            //总能耗(兆瓦时)=总能耗1(吨标煤)/0.1229
            // let val = (Number(this.getDataItem(1088)) / 0.1229)
            return val
        },
        //总水耗(吨)
        v1091Fn() {
            // =(C10+C11)
            let val = BigNumber(this.getDataItem(1008))
                .plus(BigNumber(this.getDataItem(1009)))

            // let val = (Number(this.getDataItem(1008)) + Number(this.getDataItem(1009)))
            return val
        },
        //总废弃物(千克)
        v1092Fn() {
            let val = BigNumber(this.getDataItem(1021))
                .plus(BigNumber(this.getDataItem(1023)))
                .plus(BigNumber(this.getDataItem(1025)))
                .plus(BigNumber(this.getDataItem(1027)))
                .plus(BigNumber(this.getDataItem(1029)))
                .plus(BigNumber(this.getDataItem(1033)))
                .plus(BigNumber(this.getDataItem(1035)))
                .plus(BigNumber(this.getDataItem(1031)))
                .plus(BigNumber(this.getDataItem(1037)))
                .plus(BigNumber(this.getDataItem(1039)))
                .plus(BigNumber(this.getDataItem(1041)))
                .plus(BigNumber(this.getDataItem(1044)))
                .plus(BigNumber(this.getDataItem(1046)))
            return val
        },
        //总危废(千克)
        v1093Fn() {
            let val = BigNumber(this.getDataItem(1021))
                .plus(BigNumber(this.getDataItem(1023)))
                .plus(BigNumber(this.getDataItem(1025)))
                .plus(BigNumber(this.getDataItem(1027)))
                .plus(BigNumber(this.getDataItem(1044)))

            //总危废(千克)=废酸+废有机溶剂+化学品垃圾+其他危废+PCB/FPC
            // let val = (
            //     Number(this.getDataItem(1021)) +
            //     Number(this.getDataItem(1023)) +
            //     Number(this.getDataItem(1025)) +
            //     Number(this.getDataItem(1027)) +
            //     Number(this.getDataItem(1044))
            // )
            return val
        },
        //总污泥(千克)
        v1094Fn() {
            let val = BigNumber(this.getDataItem(1029))
                .plus(BigNumber(this.getDataItem(1031)))
                .plus(BigNumber(this.getDataItem(1033)))
                .plus(BigNumber(this.getDataItem(1035)))

            //总污泥(千克)=有机污泥+含氟污泥+含磷污泥+含铜污泥
            // let val = (
            //     Number(this.getDataItem(1029)) +
            //     Number(this.getDataItem(1031)) +
            //     Number(this.getDataItem(1033)) +
            //     Number(this.getDataItem(1035))
            // )
            return val
        },
        //碳排放量(scope2)-外购电力(吨)
        v1095Fn() {
            let val = BigNumber(this.electricCharge).multipliedBy(this.getDataItem(1004)).dividedBy(1000)
            // let val = (this.electricCharge * Number(this.getDataItem(1004)) / 1000)
            return val
        },
        //碳排放量(scope2)-外购热力(吨)
        v1096Fn() {
            //碳排放量(scope2)-外购热力(吨)=蒸汽(吨)*2.51(GJ/吨)*0.11
            let val = BigNumber(this.getDataItem(1006)).multipliedBy(2.51).multipliedBy(0.11)
            // let val = (
            //     Number(this.getDataItem(1006)) * 2.51 * 0.11
            // )
            return val
        },
        //碳排放量(scope2)(吨)
        v1097Fn() {
            //C103+C104
            let val = BigNumber(this.v1095Fn()).plus(BigNumber(this.v1096Fn()))
            return val
        },
        //碳排放量(scope1)-燃料燃烧(吨)
        v1098Fn() {
            // C6/10000*21.62+C8*3.1
            let val = BigNumber(this.getDataItem(1005)).dividedBy(10000).multipliedBy(21.62)
                .plus(BigNumber(this.getDataItem(1007)).multipliedBy(3.1))

            return val
        },
        //能源折合碳排放量(吨)
        v1099Fn() {
            let val = (BigNumber(this.electricCharge).multipliedBy(this.getDataItem(1004)).dividedBy(1000))
                .plus(BigNumber(this.getDataItem(1005)).multipliedBy(21.62).dividedBy(10000))
                .plus(BigNumber(this.getDataItem(1007)).multipliedBy(3.1))
                .plus(BigNumber(this.getDataItem(1006)).multipliedBy(2.51).multipliedBy(0.11))

            return val
        },
        //碳排放量(scope1)-F-GHG(吨)【2019 年 IPCC】
        v1101Fn() {
            // C18*0.3*0.05*23500/1000+
            let val = (BigNumber(this.getDataItem(1014)).multipliedBy(0.3).multipliedBy(0.05).multipliedBy(23500).dividedBy(1000))
                // C19*0.03*0.05*16100/1000+
                .plus(BigNumber(this.getDataItem(1015)).multipliedBy(0.03).multipliedBy(0.05).multipliedBy(16100).dividedBy(1000))
                // C20*0.11*0.05*16100/1000+
                .plus(BigNumber(this.getDataItem(1123)).multipliedBy(0.11).multipliedBy(0.05).multipliedBy(16100).dividedBy(1000))
                // C22*0.6*0.11*6630/1000+
                .plus(BigNumber(this.getDataItem(1017)).multipliedBy(0.6).multipliedBy(0.11).multipliedBy(6630).dividedBy(1000))
                // C23*0.2*0.02*12400/1000+
                .plus(BigNumber(this.getDataItem(1018)).multipliedBy(0.2).multipliedBy(0.02).multipliedBy(12400).dividedBy(1000))
                // C21*0.63*0.4*265/1000+
                .plus(BigNumber(this.getDataItem(1016)).multipliedBy(0.63).multipliedBy(0.4).multipliedBy(265).dividedBy(1000))
                // C23*0.07*0.11*6630/1000+
                .plus(BigNumber(this.getDataItem(1018)).multipliedBy(0.07).multipliedBy(0.11).multipliedBy(6630).dividedBy(1000))
                // C23*0.05*0.05*11100/1000
                .plus(BigNumber(this.getDataItem(1018)).multipliedBy(0.05).multipliedBy(0.05).multipliedBy(11100).dividedBy(1000))

            return val
        },
        //碳排放量（scope1)-F-GHG（吨）【中国电子设备制造企业温室气体核算方法与报告指南】
        v1102Fn() {
            let c19c20 = BigNumber(this.getDataItem(1015)).plus(this.getDataItem(1123))

            // C18*0.9*0.2*0.19*22800/1000+
            let val = (BigNumber(this.getDataItem(1014)).multipliedBy(0.9).multipliedBy(0.2).multipliedBy(0.19).multipliedBy(22800).dividedBy(1000))
                //(C19+C20)*0.9*0.2*0.145*17200/1000+
                .plus(BigNumber(c19c20).multipliedBy(0.9).multipliedBy(0.2).multipliedBy(0.145).multipliedBy(17200).dividedBy(1000))
                // C22*0.9*0.9*0.19*7390/1000+
                .plus(BigNumber(this.getDataItem(1017)).multipliedBy(0.9).multipliedBy(0.9).multipliedBy(0.19).multipliedBy(7390).dividedBy(1000))
                // C23*0.9*0.4*0.19*12400/1000+
                .plus(BigNumber(this.getDataItem(1018)).multipliedBy(0.9).multipliedBy(0.4).multipliedBy(0.19).multipliedBy(12400).dividedBy(1000))
                // (C19+C20)*0.9*0.09*0.19*7390/1000+
                .plus(BigNumber(c19c20).multipliedBy(0.9).multipliedBy(0.09).multipliedBy(0.19).multipliedBy(7390).dividedBy(1000))
                // C23*0.9*0.07*0.19*7390/1000
                .plus(BigNumber(this.getDataItem(1018)).multipliedBy(0.9).multipliedBy(0.07).multipliedBy(0.19).multipliedBy(7390).dividedBy(1000))

            return val
        },
        //碳排放总量（吨）
        v1103Fn() {
            // C107+C108
            let val = BigNumber(this.v1099Fn()).plus(BigNumber(this.v1101Fn()))
            return val;
        },
        //单耗开始------------
        //万元产值能耗1（吨标煤/万元产值
        v1105Fn() {
            //总能耗1（吨标煤）/产值（万元）
            // C96/C3
            let val = BigNumber(this.v1088Fn()).dividedBy(this.getDataItem(1003))
            return val;
        },
        //万元产值水耗（吨/万元产值）
        v1106Fn() {
            //=C99/C3
            let val = BigNumber(this.v1091Fn()).dividedBy(this.getDataItem(1003))
            return val;
        },
        //万元产值废弃物（千克/万元产值）
        v1107Fn() {
            //C100*1000/C3
            let val = BigNumber(this.v1092Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1003))
            // let val = (this.getDataItem(1092) * 1000 / this.getDataItem(1003))
            return val;
        },
        //单位面积能耗1（kg标煤/单位平米基板）
        v1108Fn() {
            //C96*1000/C2
            let val = BigNumber(this.v1088Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1088) * 1000 / this.getDataItem(1002))
            return val;
        },
        //单位面积能耗1（千瓦时/单位平米基板）
        v1109Fn() {
            //C98*1000/C2
            let val = BigNumber(this.v1090Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1090) * 1000 / this.getDataItem(1002))
            return val;
        },
        //单位面积电耗（千瓦时/单位平米基板）
        v1110Fn() {
            //单位面积电耗（千瓦时/单位平米基板）=用电量（kwh)/投入面积（m2）
            let val = BigNumber(this.getDataItem(1004)).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1004) / this.getDataItem(1002))
            return val;
        },
        //单位面积天然气（m3/m2）
        v1111Fn() {
            //单位面积天然气（m3/m2）=天然气/投入面积
            let val = BigNumber(this.getDataItem(1005)).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1005) / this.getDataItem(1002))
            return val;
        },
        //单位面积水耗（吨/单位平米基板）
        v1112Fn() {
            //C99/C2
            let val = BigNumber(this.v1091Fn()).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1091) / this.getDataItem(1002))
            return val;
        },
        //单位面积废弃物（千克/单位平米基板）
        v1113Fn() {
            //C100/C2
            let val = BigNumber(this.v1092Fn()).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1092) / this.getDataItem(1002))
            return val;
        },
        //单位面积二氧化碳排放量（kgCO2/m2）
        v1114Fn() {
            //C107*1000/C2
            let val = BigNumber(this.v1099Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1002))
            return val;
        },
        //单位产品基准排水量（m³/㎡）
        v1115Fn() {
            //单位产品基准排水量（m³/㎡）=生产废水/ 投入面积
            let val = BigNumber(this.getDataItem(1012)).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1012) / this.getDataItem(1002))
            return val;
        },
        //单位面积污泥（千克/单位平米基板）
        v1116Fn() {
            //C102/C2
            let val = BigNumber(this.v1094Fn()).dividedBy(this.getDataItem(1002))
            // let val = (this.getDataItem(1094) / this.getDataItem(1002))
            return val;
        },
        //单位面积含氟气体折合二氧化碳排放量（kgCO2/m2）（PFC按照2006IPCC排放因子核算）
        v1117Fn() {
            //C112/C2*1000
            let val = BigNumber(this.v1106Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1002))
            return val;
        },
        //单位面积含氟气体折合二氧化碳排放量（kgCO2/m2）（PFC按照发改委-电子行业核算方法）
        v1118Fn() {
            //C109*1000/C2
            let val = BigNumber(this.v1102Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1002))
            return val;
        },
        //废弃物平均处置单价(元/kg)  
        v1119Fn() {
            //C53/(C100-C55-C57)
            let c100c55c57 = BigNumber(this.v1092Fn()).minus(this.getDataItem(1044)).minus(BigNumber(this.getDataItem(1046)))
            let val = BigNumber(this.getDataItem(1043)).dividedBy(c100c55c57)
            return val;
        },
        //万元产值二氧化碳排放量(kgCO2/万元)
        v1120Fn() {
            //C110*1000/C3
            let val = BigNumber(this.v1103Fn()).multipliedBy(1000).dividedBy(this.getDataItem(1003))
            return val;
        },
        //单位面积含氟气体折合二氧化碳排放量（kgCO2/m2）
        v1121Fn() {
            //C108/C2*1000
            let val = BigNumber(this.v1101Fn()).dividedBy(this.getDataItem(1002)).multipliedBy(1000)
            return val;
        },
        //单位面积二氧化碳排放量（kgCO2/m2）=碳排放量（kg）/投入面积（m2）(2019 IPCC+能源)
        v1122Fn() {
            //(C107+C108)*1000/C2
            let c107c108 = BigNumber(this.v1099Fn()).plus(BigNumber(this.v1101Fn()))
            let val = BigNumber(c107c108).multipliedBy(1000).dividedBy(this.getDataItem(1002))
            return val;
        },
    },
};

export default formulaMixin;