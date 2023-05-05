<template>
    <HasFixedBottomWrapper>
        <SearchTerm v-if="!(isView || isEdit)">
            <a-form-model layout="inline"
                          ref="formInline"
                          :model="formInline"
                          :rules="rules"
                          :colon="false">
                <a-form-model-item label="所属组织"
                                   prop='corporationId'>
                    <a-select v-model="formInline.corporationId"
                              placeholder="请选择所属组织"
                              @change="corporationChange">
                        <a-select-option v-for="item in getCommonAddOrgnizeListAll"
                                         :key="item.id"
                                         :value="item.id">{{item.orgAbbrName}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="部门"
                                   prop='deptId'>
                    <a-select v-model="formInline.deptId"
                              :disabled='!formInline.corporationId'
                              placeholder="请选择"
                              @change="handleDeptChange">
                        <a-select-option v-for='(i,index) in deptOption'
                                         :key="index"
                                         :value="i.deptId">{{i.deptName}}</a-select-option>
                    </a-select>
                </a-form-model-item>

                <a-form-model-item label="年份"
                                   prop='year'>
                    <el-date-picker v-model="formInline.year"
                                    type="year"
                                    value-format="yyyy"
                                    placeholder="选择年"
                                    :clearable='false'>
                    </el-date-picker>
                </a-form-model-item>
                <a-form-model-item label="填报维度"
                                   prop='fillDimension'>
                    <a-select v-model="formInline.fillDimension"
                              placeholder="请选择"
                              @change="handleWChange">
                        <a-select-option :value="1">季度</a-select-option>
                        <a-select-option :value="2">月度</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="季度"
                                   prop='fillDate'>
                    <a-select v-model="formInline.fillDate"
                              placeholder="请选择">
                        <a-select-option v-for='(i,index) in option'
                                         :key="index"
                                         :value="i.value">{{i.name}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item class="float-right">

                </a-form-model-item>
            </a-form-model>
        </SearchTerm>
        <div class="color-666 font-16 text-center"
             v-if="(!formInline.deptId) && !(isView || isEdit)">请先选择部门，再进行填报{{formInline.deptId}}{{isView}}{{isEdit}}</div>
        <div v-else>
            <div class="color-666 font-16"
                 v-if="reportData && reportData.length">
                <!-- 查看 -->
                <ReportDataTableVue v-if="isView"
                                    ref="reportDataTableVue"
                                    :reportData="reportData"
                                    :startStatus='startStatus'
                                    :subFileValue='subFileValue'
                                    :corporationMsg="corporationMsg.deptId ? corporationMsg : undefined"
                                    type="view"></ReportDataTableVue>
                <!-- 编辑 -->
                <ReportDataTableVue v-else-if="isEdit"
                                    ref="reportDataTableVue"
                                    :reportData="reportData"
                                    :startStatus='startStatus'
                                    :subFileValue='subFileValue'
                                    :corporationMsg="corporationMsg.deptId ? corporationMsg : undefined"
                                    type="edit"
                                    :hideDownLoad="true"></ReportDataTableVue>

                <!--  新增-填报绩效报表 -->
                <ReportDataTableVue v-else
                                    ref="reportDataTableVue"
                                    :startStatus='startStatus'
                                    :subFileValue='subFileValue'
                                    :reportData="reportData"></ReportDataTableVue>
            </div>
            <div class="color-666 font-16 text-center"
                 v-else>
                该组织还没配置报表
            </div>
        </div>
        <div slot="fixedBottom">
            <FixedBottom>
                <div>
                    <a-button @click="pageCancle">返回</a-button>
                    <a-button type="primary"
                              v-if="!isView"
                              :loading="btnLoading"
                              @click="pageSubmit">保存</a-button>
                </div>
            </FixedBottom>
        </div>
    </HasFixedBottomWrapper>
</template>
<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import ReportDataTableVue from "../../tpl/reportDataTableBranch.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { nanoid } from 'nanoid'
import { getQueryVariable } from "@/utils/util.js"
import dayJs from "dayjs";
import { organizationSelectDetail, orgDataSelectDetailBySummary, orgDataSave, orgDataselectDetail, orgDataUpdate } from "@/services/performanceManagement.js";
import { selectDeptK, queryAchDeptConfig, fillInAchDeptData, viewAchDeptData, editAchDeptData } from "@/services/performanceManagementBranch.js";
import { cloneDeep, result } from "lodash";

export default {
    components: {
        FixedBottom,
        ReportDataTableVue
    },
    data () {
        return {
            formInline: {
                fillDimension: 1,
                fillDate: this.isQuarter(),
                year: dayJs(new Date()).format("YYYY"),
                deptId: undefined,
                corporationId: undefined,
                deptName: undefined
            },
            rules: {
                corporationId: [
                    { required: true, message: "所属组织不能为空", trigger: "change" },
                ],
                year: [
                    { required: true, message: "年份不能为空", trigger: "change" },
                ],
                fillDimension: [
                    { required: true, message: "不能为空", trigger: "change" },
                ],
                fillDate: [
                    { required: true, message: "不能为空", trigger: "change" },
                ],
            },
            deptOption: [],
            btnLoading: false,
            projectList: [
                {
                    key: "1",
                    value: "否决性指标"
                },
                {
                    key: "2",
                    value: "安全"
                },
                {
                    key: "3",
                    value: "消防"
                },
                {
                    key: "4",
                    value: "环境"
                },
                {
                    key: "5",
                    value: "职业健康"
                },
                {
                    key: "6",
                    value: "其他管理事项"
                },
            ],
            quarterList: [
                {
                    key: "1",
                    value: "第一季度"
                },
                {
                    key: "2",
                    value: "第二季度"
                },
                {
                    key: "3",
                    value: "第三季度"
                },
                {
                    key: "4",
                    value: "第四季度"
                },
            ],
            bodyIndexData: {
                "1": {
                    projectName: "否决性指标",
                    indexList: [],
                },
                "2": {
                    projectName: "安全",
                    indexList: [],
                },
                "3": {
                    projectName: "消防",
                    indexList: [],
                },
                "4": {
                    projectName: "环境",
                    indexList: [],
                },
                "5": {
                    projectName: "职业健康",
                    indexList: [],
                },
                "6": {
                    projectName: "其他管理事项",
                    indexList: [],
                }
            },
            iForm: {},

            reportData: [],
            corporationMsg: {},
            option: [],
            quarterOption: [
                { name: '第一季度', value: 1 },
                { name: '第二季度', value: 2 },
                { name: '第三季度', value: 3 },
                { name: '第四季度', value: 4 },
            ],
            monthOption: [
                { name: '1月', value: 1 },
                { name: '2月', value: 2 },
                { name: '3月', value: 3 },
                { name: '4月', value: 4 },
                { name: '5月', value: 5 },
                { name: '6月', value: 6 },
                { name: '7月', value: 7 },
                { name: '8月', value: 8 },
                { name: '9月', value: 9 },
                { name: '10月', value: 10 },
                { name: '11月', value: 11 },
                { name: '12月', value: 12 },
            ],
            startStatus: '1',
            subFileValue: {},
        }
    },
    computed: {
        isView () {
            return this.$route.meta && this.$route.meta.isView
        },
        isEdit () {
            return this.$route.meta && this.$route.meta.isEdit
        },
    },
    created () {
        this.option = this.quarterOption
        if (this.isView || this.isEdit) {
            this.orgDataselectDetail(this.$route.query.id);
        }
    },
    methods: {
        // 组织改变时
        corporationChange (corId) {
            console.log(corId)
            selectDeptK({ corporationId: corId }).then(res => {
                console.log(res)
                // this.$set(this.formInline, 'deptId', undefined)
                this.formInline.deptId = undefined
                this.deptOption = res.data
            })
        },
        //部门选择
        handleDeptChange (e) {
            console.log(e)
            this.formInline.deptName = this.deptOption.filter(i => i.deptId == e)[0].deptName
            this.reportData = []
            queryAchDeptConfig({ deptId: e }).then(res => {
                let result = res.data || {};
                let arr = result.achievementRelationDTOS || [];
                let dispose = item => {
                    let obj = []
                    item.indexItems.forEach(i => {
                        //（安全：safe 消防：fire_control 环境：environment 职业健康：occupational_health 其他管理事项：other_management）
                        let info = {}
                        if (projectId == 1) {
                            info.moduleKey = 'safe'
                            info.module = '安全'
                        } else if (projectId == 2) {
                            info.moduleKey = 'fire_control'
                            info.module = '消防'
                        } else if (projectId == 3) {
                            info.moduleKey = 'environment'
                            info.module = '环境'
                        } else if (projectId == 4) {
                            info.moduleKey = 'occupational_health'
                            info.module = '职业健康'
                        } else {
                            info.moduleKey = 'other_management'
                            info.module = '其他管理事项'
                        }
                        obj.push({ ...item, ...i, projectId: projectId, sitesNum: 0, ...info, sort: sort, projectScore: item.riskScore })
                    })
                    sort++
                    return obj
                }
                let sort = 1;
                let projectId = 1;
                let safeIndexData = result.safeIndexData.map(dispose).flat(1)
                projectId = 2;
                let fireIndexData = result.fireIndexData.map(dispose).flat(1)
                projectId = 3
                let environmentIndexData = result.environmentIndexData.map(dispose).flat(1)
                projectId = 4
                let healthIndexData = result.healthIndexData.map(dispose).flat(1)
                projectId = 5
                let otherIndexData = result.otherIndexData.map(dispose).flat(1)
                let brr = [...safeIndexData, ...fireIndexData, ...environmentIndexData, ...healthIndexData, ...otherIndexData];
                // console.log(safeIndexData.flat(2))
                this.startStatus = result.startStatus.toString()
                if (result.startStatus == '2') {
                    this.subFileValue = {
                        A: [result.levelAOneScore, result.levelATwoScore],
                        B: [result.levelBOneScore, result.levelBTwoScore],
                        C: [result.levelCOneScore, result.levelCTwoScore]
                    }
                }
                this.reportData = brr;
                // console.log(JSON.stringify(this.reportData[0]))
                if (this.reportData.length) {
                    this.$nextTick(() => {
                        this.$refs.reportDataTableVue.updateFooterEvent();
                    })
                }

                // let a = ''

            })
        },
        // 查看|编辑 填报数据详情
        orgDataselectDetail (id) {
            // orgDataselectDetail({
            // id: this.$route.query.id
            viewAchDeptData({ id: id }).then(res => {
                let result = res.data || {};
                this.formInline.deptId = res.data.deptId
                this.corporationMsg = {
                    id: res.data.id,
                    deptId: res.data.deptId,
                    deptName: res.data.deptName,
                    year: res.data.year,
                    fillDimension: res.data.fillDimension,
                    fillDate: res.data.fillDate,
                }
                console.log(...result.safeAchData)
                this.reportData = [...result.safeAchData, ...result.fireAchData, ...result.environmentAchData, ...result.healthAchData, ...result.otherAchData].map(i => {
                    i.sitesNum = Number(i.scene)
                    if (i.moduleKey == 'safe') {
                        i.projectId = 1
                    } else if (i.moduleKey == 'fire_control') {
                        i.projectId = 2
                    } else if (i.moduleKey == 'environment') {
                        i.projectId = 3
                    } else if (i.moduleKey == 'occupational_health') {
                        i.projectId = 4
                    } else {
                        i.projectId = 5
                    }
                    return i
                })
                if (result.remark) {
                    this.startStatus = '2'
                    this.subFileValue = JSON.parse(result.remark)
                }
                console.log(JSON.stringify(this.reportData[0]))
                let t = {
                    "id": "1599614759569473536",//---
                    "dataId": "1599614758767120385",
                    "moduleKey": "safe",//---
                    "module": "安全",//---
                    "indexInfo": "测试指标00005",//---
                    "riskScore": "10",//---
                    "deductPoints": "小螃蟹",//---
                    "scene": "1",
                    "unit": "只",//---
                    "deductScore": "1",//---
                    "projectScore": "9",//++++
                    "remake": "鱼类",//---
                    "sort": 1,//---
                    "sitesNum": 1,//---
                    "projectId": 1//---
                }

                let t2 = {
                    "dataId": "1599614758767120385",

                    "scene": "1",
                    "projectScore": "9",//++++     
                }
                let t3 = [{
                    "indexId": "1598996837698879490",
                }]
                // this.reportData = [{
                //     // "id": "1598996837711462402",//---
                //     // "indexType": "2",
                //     "indexInfo": "测试指标00005",//---
                //     "riskScore": "10",//---
                //     "remake": "鱼类",//---
                //     // "indexId": "1598996837698879490",
                //     "deductPoints": "小螃蟹",//---
                //     "unit": "只",//---
                //     "deductScore": "1",//---
                //     "projectId": 1,//---
                //     "sitesNum": 2,//---
                //     "moduleKey": "safe",//---
                //     "module": "安全",//---
                //     "sort": 1,//---
                // }]

                if (this.reportData.length) {
                    this.$nextTick(() => {
                        this.$refs.reportDataTableVue.updateFooterEvent(true);
                    })
                }
            }).catch(err => console.log(err))
        },
        pageCancle () {
            this.setKeepalive(true)
            this.$router.push("/ehsGerneralManage/orgPerformanceManage/performanceBranchData");
        },
        pageSubmit () {
            let params = {
                level: this.$refs.reportDataTableVue.level,
                score: Number(this.$refs.reportDataTableVue.score),
            }
            if (!this.isEdit) {
                if (!formValidator.formAll(this, 'formInline')) {
                    return;
                }
                Object.assign(params, this.formInline);
            } else {
                Object.assign(params, this.corporationMsg);
                params.achDataDetailList = cloneDeep(this.reportData).map(i => {
                    i.scene = i.sitesNum
                    i.projectScore = Number(i.projectScore) < 0 ? 0 : Number(i.projectScore)
                    return i

                })
                if (this.startStatus == 2) {
                    params.remark = JSON.stringify(this.subFileValue)
                }
                //负值不让提交
                let b = params.achDataDetailList.some(i => {
                    if (i.projectScore < 0) {
                        return true
                    } else {
                        return false
                    }

                })
                if (b) {
                    this.$antMessage.error("每项指标的扣分分值不得超过风险分值");
                    return false
                }

                editAchDeptData(params).then(res => {
                    this.$antMessage.success("修改成功");
                    this.$router.push({
                        path: "/ehsGerneralManage/orgPerformanceManage/performanceBranchData"
                    })
                })
                return false
            }
            // achDataDetailList
            params.achDataDetailList = cloneDeep(this.reportData).map(i => {
                i.scene = i.sitesNum
                delete i.id //= ''
                delete i.indexItems
                i.projectScore = Number(i.projectScore) < 0 ? 0 : Number(i.projectScore)
                // i.sumDeductScore = Number(i.sumDeductScore)
                return i
            })
            if (this.startStatus == 2) {
                params.remark = JSON.stringify(this.subFileValue)
            }
            //负值不让提交
            let b = params.achDataDetailList.some(i => {
                if (i.projectScore < 0) {
                    return true
                } else {
                    return false
                }

            })
            if (b) {
                this.$antMessage.error("每项指标的扣分分值不得超过风险分值");
                return false
            }
            fillInAchDeptData(params).then(res => {
                this.$antMessage.success("填报成功");
                this.$router.push({
                    path: "/ehsGerneralManage/orgPerformanceManage/performanceBranchData"
                })
            })
        },
        //筛选维度变化
        handleWChange (e) {
            if (e == 1) {
                this.formInline.fillDate = this.isQuarter()
                this.option = this.quarterOption
            } else {
                this.formInline.fillDate = Number(new Date().getMonth()) + 1
                this.option = this.monthOption
            }
        },
        // 查询季度
        isQuarter () {
            let Month = Number(new Date().getMonth()) + 1
            if (Month > 9) {
                return 4
            } else if (Month > 6) {
                return 3
            } else if (Month > 3) {
                return 2
            } else {
                return 1
            }

        },
    }
}
</script>
<style lang='less' scoped>
/deep/ .ant-calendar-picker {
    width: 100%;
}
</style>