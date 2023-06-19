
import { cloneDeep, reject } from "lodash";
import { mapActions } from 'vuex'
import chemicalDict from "@/mixin/chemicalDict.js";
const getPollutantListMixin = {
    mixins: [chemicalDict],
    data() {
        return {
            // 废气污染物--1
            pollutantGasList: [],
            // 废水污染物--2
            pollutantWaterList: [],
        }
    },
    computed: {
        // 污染物-全部
        pollutantAll() {
            let pollutantOptions = this.$store.state.setting.pollutantOptions || []
            console.log('污染物-全部', pollutantOptions);
            pollutantOptions.forEach(item => {
                let location = item.location ? this.getChemicalDictText('point_location', item.location) : ''
                let pollutantName = item.pollutantName || ''
                item.locationPollutantName = location + pollutantName
            })
            return pollutantOptions
        },
        // 废气污染物--gas
        pollutantGas() {
            return this.pollutantAll.filter(item => item.numberPickInstrumentType == 'gas')
        },
        // 废水污染物--water
        pollutantWater() {
            return this.pollutantAll.filter(item => item.numberPickInstrumentType == 'water')
        },
        // 获取单位
        pollutantUnitText() {
            let unitText = ''
            if (this.formInline.instrumentPollutantRelId) {
                let matchPollutantInfo = this.matchPollutant(this.formInline.instrumentPollutantRelId, true)
                unitText = matchPollutantInfo ? matchPollutantInfo.pollutantUnit : ''
                unitText = unitText ? unitText : ''
            }
            return unitText
        },
    },
    methods: {
        ...mapActions("setting", ["getPollutantOptions"]),
        // 获取污染物
        getPollutantListFn() {
            return new Promise((resolve, reject) => {
                this.getPollutantOptions()
                    .then(res => {
                        // console.log('全部污染物', this.pollutantAll);
                        resolve()
                    })
                    .catch(err => {
                        reject()
                    })
                // if (Array.isArray(this.pollutantAll) && this.pollutantAll.length) {
                //     resolve()
                // } else {

                // }
            })
        },
        // 匹配污染物中文
        matchPollutant(instrumentPollutantRelId, needObj = false) {
            const pollutantObj = this.pollutantAll.find(item => item.instrumentPollutantRelId == instrumentPollutantRelId)
            let targetInfo = needObj ? pollutantObj : (pollutantObj ? pollutantObj.pollutantName : '')
            return targetInfo
        },
    },
    watch: {
        'formInline.corporationId'(newVal, oldVal) {
            setTimeout(()=> {
                if (newVal) {
                    this.pollutantGasList = this.pollutantGas.filter(item => item.corporationId == newVal)
                    this.pollutantWaterList = this.pollutantWater.filter(item => item.corporationId == newVal)
                    // console.log(newVal, this.pollutantAll, this.pollutantGasList, this.pollutantWaterList);
                } else {
                    this.pollutantGasList = []
                    this.pollutantWaterList = []
                }
            }, 500)
        }
    }
};

export default getPollutantListMixin;