
/**
 * @author: 成礼雄
 * @description 环境月报填报公式
 */
import { BigNumber } from "bignumber.js";
const formulaMixin = {
    methods: {
        // 总能耗1(吨标煤)=电(kwh)*0.1229/1000
        v142Fn() {
            let val = BigNumber(this.getDataItem(3)).multipliedBy(0.1229).dividedBy(1000);
            return val
        },
        // 总能耗2(吨标煤,含耗能工质）=电(kwh)*0.1229/1000+自来水(t)*0.0857/1000+氮气(m3)*0.6714/1000+氧气(m3)*0.4/1000
        v143Fn() {
            let val = BigNumber(this.getDataItem(3)).multipliedBy(0.1229).dividedBy(1000).plus(BigNumber(this.getDataItem(4)).multipliedBy(0.0857).dividedBy(1000)).plus(BigNumber(this.getDataItem(8)).multipliedBy(0.6714).dividedBy(1000)).plus(BigNumber(this.getDataItem(9)).multipliedBy(0.4).dividedBy(1000));
            return val
        },
        // 总能耗(兆瓦时)=总能耗1(吨标煤)/0.1229
        v144Fn() {
            let val = BigNumber(this.getDataItem(3)).dividedBy(1000);
            return val
        },
        // 总水耗(吨)=自来水(吨)+江水(吨)+再生水(吨)
        v145Fn() {
            let val = BigNumber(this.getDataItem(4)).plus(BigNumber(this.getDataItem(5)));
            return val
        },
        // 总废弃物(千克)=废活性炭+废有机溶剂+废矿物油+废滤芯+废填料+废抹布手套+酸性沉渣+含铜、锡污泥+废化学品包装物+污泥+银浆布+银浆罐+铝浆布+铝浆罐
        v146Fn() {
            let val = BigNumber(this.getDataItem(17)).plus(BigNumber(this.getDataItem(19))).plus(BigNumber(this.getDataItem(21))).plus(BigNumber(this.getDataItem(23))).plus(BigNumber(this.getDataItem(25))).plus(BigNumber(this.getDataItem(27))).plus(BigNumber(this.getDataItem(29))).plus(BigNumber(this.getDataItem(31))).plus(BigNumber(this.getDataItem(33))).plus(BigNumber(this.getDataItem(35))).plus(BigNumber(this.getDataItem(37))).plus(BigNumber(this.getDataItem(39))).plus(BigNumber(this.getDataItem(41))).plus(BigNumber(this.getDataItem(43)))
            return val
        },
        // 总危废(千克)=废活性炭+废有机溶剂+废矿物油+废滤芯+废填料+废抹布手套+酸性沉渣+含铜、锡污泥+废化学品包装物
        v147Fn() {
            let val = BigNumber(this.getDataItem(17)).plus(BigNumber(this.getDataItem(19))).plus(BigNumber(this.getDataItem(21))).plus(BigNumber(this.getDataItem(23))).plus(BigNumber(this.getDataItem(25))).plus(BigNumber(this.getDataItem(27))).plus(BigNumber(this.getDataItem(29))).plus(BigNumber(this.getDataItem(31))).plus(BigNumber(this.getDataItem(33)))
            return val
        },
        // 总污泥(千克)=有机污泥+含氟污泥
        v148Fn() {
            let val = BigNumber(this.getDataItem(35))
            return val
        },
        // 碳排放量(scope2)-外购电力(吨)=电网排放因子(吨CO2/兆瓦时)*总电耗(兆瓦时)
        v149Fn() {
            let val = BigNumber(this.getDataItem(3)).multipliedBy(0.8843).dividedBy(1000);
            return val
        },
        // 万元产值能耗1(吨标煤/万元产值)=总能耗1(吨标煤）)/产值(万元)
        // 电耗 / c4
        v150Fn() {
            let val = BigNumber(this.v142Fn()).dividedBy(this.getDataItem(2))
            return val
        },
        // 万元产值水耗(吨/万元产值)=总水耗(万吨)*10000/产值(万元)
        v151Fn() {
            let val = BigNumber(this.v145Fn()).dividedBy(this.getDataItem(2))
            return val
        },
        // 万元产值废弃物(千克/万元产值)=总废弃物(吨)*1000/产值(万元)
        v152Fn() {
            let val = BigNumber(this.v146Fn()).multipliedBy(1000).dividedBy(this.getDataItem(2))
            return val
        },
    },
};

export default formulaMixin;