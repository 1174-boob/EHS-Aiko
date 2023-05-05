
/**
 * @author: 成礼雄
 * @description 化学品字典
 */
const chemicalDict = {
    data() {
        return {

        }
    },
    computed: {
        //从字典组里获取化学品名称数据
        dictAllList() {
            return this.$store.state.setting.dictTypeData;
        },
        // 所属组织-字典
        corporationList() {
            let organizeList = this.$store.state.setting.corporationList || []
            return organizeList
        }
    },
    methods: {
        // 获取化学品相关字典list
        getChemicalDictList(dictType) {
            let dictTargetObj = this.dictAllList.find(item => {
                return item.dictType == dictType;
            });
            // 字典项
            let dictTargetList = dictTargetObj ? dictTargetObj.dictItem : []
            return dictTargetList;
        },
        // 获取化学品相关字典值
        getChemicalDictText(dictType, dictValue) {
            let dictObj = this.getChemicalDictList(dictType).find(item => {
                return item.dictValue == dictValue;
            })
            // 字典值
            let dictTargetText = dictObj ? dictObj.dictLabel : ''
            return dictTargetText;
        },
        // 获取化学品相关字典key-value
        getChemicalDictValue(dictType, dictLabel) {
            let dictObj = this.getChemicalDictList(dictType).find(item => {
                return item.dictLabel == dictLabel;
            })
            // 字典key-value
            let dictTargetValue = dictObj ? dictObj.dictValue : ''
            return dictTargetValue;
        },
        // 获取所属组织-字典值
        getCorporationDictText(corporationId) {
            let dictObj = this.corporationList.find(item => {
                return item.corporationId == corporationId;
            })
            // 字典值
            let dictTargetText = dictObj ? dictObj.orgAbbrName : ''
            return dictTargetText;
        }
    },
};
export default chemicalDict;