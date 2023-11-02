<template>
  <HasFixedBottomWrapper>
    <PageTitle>配置成熟度评价填报表</PageTitle>
    <DashBtn>
      <div>
        <a-button type="dashed" v-if="showSelectDeptBtn" @click="selectCorporation">选择部门</a-button>
        <a-button type="dashed" @click="selectIndex">选择指标</a-button>
      </div>
    </DashBtn>
    <PageTitle>
      部门：
      <template v-if="Array.isArray(selectDeptList) && selectDeptList.length">
        <span>{{selectDeptList.map(item=>item.deptName).join('、')}}</span>
      </template>
      <template v-else>
        <span class="font-14 color-999">请点击上方”选择组织“按钮选择组织</span>
      </template>
    </PageTitle>
    <!-- 启用分值档位 -->
    <div>
      <a-checkbox v-model="scorePositionStatus" @change="handleScoreChange">启用分值档位</a-checkbox>
      <div v-if="scorePositionStatus">
        <a-form-model ref="scoreForm" labelAlign="right" :model="scoreFormData" :rules="scoreFormDataRules" :colon="false">
          <a-row type="flex" justify="space-between">
            <a-col :span="6">
              <a-form-model-item label="A档分值" :rules="scoreFormDataRules.aScore[0]">
                <a-row type="flex" justify="space-between">
                  <a-col :span="11">
                    <a-form-model-item label prop="aOneScore" :rules="scoreFormDataRules.aScore[0]">
                      <a-input-number v-model="scoreFormData.aOneScore" placeholder="请输入分值" :max="100" :disabled="true"></a-input-number>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1">
                    <div style="text-align: center">-</div>
                  </a-col>
                  <a-col :span="11">
                    <a-form-model-item label prop="aTwoScore" :rules="scoreFormDataRules.aScore[1]">
                      <a-input-number v-model="scoreFormData.aTwoScore" @blur="handleValueChangeAtwo" :max="99" :min="4" placeholder="请输入分值"></a-input-number>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item label="B档分值" :rules="scoreFormDataRules.bScore[0]">
                <a-row type="flex" justify="space-between">
                  <a-col :span="11">
                    <a-form-model-item label prop="bOneScore" :rules="scoreFormDataRules.bScore[0]">
                      <a-input-number v-model="scoreFormData.bOneScore" placeholder="请输入分值" :disabled="true" :min="3"></a-input-number>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1">
                    <div style="text-align: center">-</div>
                  </a-col>
                  <a-col :span="11">
                    <a-form-model-item label prop="bTwoScore" :rules="scoreFormDataRules.bScore[1]">
                      <a-input-number v-model="scoreFormData.bTwoScore" :max="bTwoScoreMax" :min="2" @blur="handleValueChangeBtwo" placeholder="请输入分值"></a-input-number>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item label="C档分值" :rules="scoreFormDataRules.cScore[0]">
                <a-row type="flex" justify="space-between">
                  <a-col :span="11">
                    <a-form-model-item label prop="cOneScore" :rules="scoreFormDataRules.cScore[0]">
                      <a-input-number v-model="scoreFormData.cOneScore" :min="2" :disabled="true" placeholder="请输入分值"></a-input-number>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1">
                    <div style="text-align: center">-</div>
                  </a-col>
                  <a-col :span="11">
                    <a-form-model-item label prop="cTwoScore" :rules="scoreFormDataRules.cScore[1]">
                      <a-input-number v-model="scoreFormData.cTwoScore" placeholder="请输入分值" :disabled="true"></a-input-number>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </div>
    <!-- 指标选取 -->
    <div>
      <div class="index-item" v-for="(item,index) in bodyIndexData" :key="index">
        <PageTitle>{{ item.projectName }}</PageTitle>
        <a-table :columns="columns" :scroll="{ x: 800 }" :data-source="item.indexList" :rowKey="'maturityEvaluationIndexId'" :pagination="false" bordered>
          <div slot="calculationDetails" slot-scope="record" class="table-p-box">
            <p v-for="(i, index) in record" :key="index" :title="i">{{ i }}</p>
          </div>
          <div slot="indicatorUnit" slot-scope="record" class="table-p-box">
            <p v-for="(i, index) in record" :key="index" :title="i">{{ i }}</p>
          </div>
          <div slot="pointsDeductions" slot-scope="record" class="table-p-box">
            <p v-for="(i, index) in record" :key="index" :title="i">{{ i }}</p>
          </div>
          <div slot="action" slot-scope="record">
            <span class="color-red cursor-pointer" @click="configIndexDelete(record, item)">删除</span>
          </div>
        </a-table>
      </div>
    </div>
    <!-- 按钮 -->
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button @click="pageCancle">取消</a-button>
          <a-button type="primary" :loading="loading" @click="pageSubmit">保存</a-button>
        </div>
      </FixedBottom>
    </div>

    <!-- 选择指标 -->
    <CommonModal class="table-modal-large" title="选择指标" :visible="indexVisible" :cancelFn="indexCancle">
      <template slot="form">
        <a-form-model
          ref="indexForm"
          :model="indexForm"
          :rules="indexFormRules"
          :label-col="{ style: { width: '94px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 94px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="所属项目" prop="projectId">
            <a-select v-model="indexForm.projectId" placeholder="请选择所属项目">
              <a-select-option v-for="item in bodyIndexData" :key="item.key" :value="item.key">{{ item.projectName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" v-if="indexForm.projectId" label prop="indexList" :wrapper-col="{ style: { width: '100%' } }">
            <SelectIndex ref="selectIndex" :selectedRowOld="indexFormSelectedRowOld" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="indexCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="indexConfirm">确定</a-button>
      </template>
    </CommonModal>

    <!-- 选择部门 -->
    <CommonModal class="table-modal-large" title="选择部门" :visible="corporationVisible" :cancelFn="corporationCancle">
      <div>
        <SelectDept ref="selectDept" :selectedRowOld="selectDeptList || []" />
      </div>
      <template slot="btn">
        <a-button @click="corporationCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="deptConfirm">确定</a-button>
      </template>
    </CommonModal>
  </HasFixedBottomWrapper>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import SelectIndex from "./selectIndex.vue";
import SelectDept from "./selectDept.vue";
import { nanoid } from "nanoid";
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from "lodash";
import { addMaturityEvaluationQuotaReportConfig,getMaturityEvaluationQuotaReportConfigDetails } from "@/services/maturityEvaluation.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: { SelectIndex, SelectDept, FixedBottom, },
  data() {
    return {
      columns: [
        {
          title: "设立目的",
          dataIndex: "purposeOfEstablishment",
          width: 200,
        },
        {
          title: "项目",
          dataIndex: "project",
          width: 200,
        },
        {
          title: "定义",
          dataIndex: "definition",
          width: 200,
        },
        {
          title: "分值",
          dataIndex: "score",
          width: 100,
        },
        {
          title: "计算明细",
          scopedSlots: { customRender: "calculationDetails" },
          dataIndex: "calculationDetails",
          width: 400,
        },
        {
          title: "指标单位",
          scopedSlots: { customRender: "indicatorUnit" },
          dataIndex: "indicatorUnit",
          width: 100,
        },
        {
          title: "扣分分值",
          scopedSlots: { customRender: "pointsDeductions" },
          dataIndex: "pointsDeductions",
          width: 100,
        },
        {
          title: "备注",
          dataIndex: "remarks",
          width: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 80, // 宽度根据操作自定义设置
        }
      ],
      indexVisible: false,
      indexForm: {
        projectId: undefined,
      },
      indexFormRules: {
        projectId: [
          { required: true, message: "所属项目不可为空", trigger: "change" },
        ],
      },
      bodyIndexData: [
        {
          key: 'prior',
          projectName: "事前",
          indexList: [],
        },
        {
          key: 'inTheMatter',
          projectName: "事中",
          indexList: [],
        },
        {
          key: 'afterTeFact',
          projectName: "事后",
          indexList: [],
        },
      ],

      // 显示选择部门按钮
      showSelectDeptBtn: true,
      // 选择部门弹窗
      corporationVisible: false,
      selectDeptList: [],

      // 分值
      scorePositionStatus: false,
      // 精度
      precision: 0.01,
      scoreFormData: {
        aOneScore: 100,
        aTwoScore:null,
        bOneScore:null,
        bTwoScore:null,
        cOneScore:null,
        cTwoScore: 0,
      },
      scoreFormDataRules: {
        aScore: [
          { required: true, message: "不能为空", trigger: "change" },
          { required: true, message: "不能为空", trigger: "change" },
        ],
        bScore: [
          { required: true, message: "不能为空", trigger: "change" },
          { required: true, message: "不能为空", trigger: "change" },
        ],
        cScore: [
          { required: true, message: "不能为空", trigger: "change" },
          { required: true, message: "不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (
      this.$route.query &&
      this.$route.query.id &&
      this.$route.query.configStatus &&
      this.$route.query.deptId &&
      this.$route.query.deptName
    ) {
      // 已配置 获取详情
      this.selectDeptList = [
        {
          id: this.$route.query.id,
          deptId: this.$route.query.deptId,
          deptName: this.$route.query.deptName,
        },
      ];
      if (this.$route.query.configStatus == 2) {
        this.getDetail(this.$route.query.id);
      }
      this.showSelectDeptBtn = false;
    }
  },
  computed: {
    // 选择指标已经选择的项
    indexFormSelectedRowOld() {
      return this.bodyIndexData.find(item => item.key == this.indexForm.projectId)?.indexList || []
    },
    // B档分值最大分值
    bTwoScoreMax() {
      return this.scoreFormData.bOneScore ? this.scoreFormData.bOneScore - 1 : undefined
    },
  },
  methods: {
    // 获取详情
    getDetail(e) {
      getMaturityEvaluationQuotaReportConfigDetails({
        id: e,
      })
        .then((res) => {
          this.scorePositionStatus = res.data.scorePositionStatus == 2 ? true : false;
          this.bodyIndexData[0].indexList = this.dispose(
            res.data.safeIndexData
          );
          this.bodyIndexData[1].indexList = this.dispose(
            res.data.fireIndexData
          );
          this.bodyIndexData[2].indexList = this.dispose(
            res.data.environmentIndexData
          );
          this.bodyIndexData[3].indexList = this.dispose(
            res.data.healthIndexData
          );
          this.bodyIndexData[4].indexList = this.dispose(
            res.data.otherIndexData
          );
          this.scoreFormData = {
            aOneScore: res.data.aOneScore || 100,
            aTwoScore: res.data.aTwoScore,
            bOneScore: res.data.bOneScore,
            bTwoScore: res.data.bTwoScore,
            cOneScore: res.data.cOneScore,
            cTwoScore: res.data.cTwoScore || 0,
          };
        })
        .catch((err) => { });
    },
    //处理一下数据
    dispose(data) {
      let arr = data.map((i) => {
        i.calculationDetails = i.itemList.map(item => item.calculationDetails)
        i.indicatorUnit = i.itemList.map(item => item.indicatorUnit)
        i.pointsDeductions = i.itemList.map(item => item.pointsDeductions)
        return i;
      });
      return arr;
    },

    // 选部门
    selectCorporation() {
      this.corporationVisible = true;
    },
    // 选择部门
    deptConfirm: debounce(function () {
      const selectDeptList = this.$refs.selectDept.selectedRow.length ? this.$refs.selectDept.selectedRow : [];
      if (!selectDeptList.length) {
        this.$antMessage.warn('请选择指标')
        return
      }
      this.selectDeptList = selectDeptList
      this.corporationCancle();
    }, 250, { leading: true, trailing: false }),
    // 选择部门取消
    corporationCancle() {
      this.corporationVisible = false;
    },

    // 取消
    pageCancle() {
      this.$router.push({
        path: '/ehsGerneralManage/orgPerformanceManage/performanceBranchReport',
      })
    },
    // 保存api
    pageSubmit() {
      //验证部门
      if (!this.selectDeptList.length) {
        this.$antMessage.error("请选择部门！");
        return;
      }

      //验证分值分档
      if (this.scorePositionStatus) {
        if (!formValidator.formAll(this, "scoreForm")) {
          return;
        }
      }

      // 验证指标
      const hasEmptyBodyIndexData = this.bodyIndexData.some(item => item.indexList.length == 0);
      if (hasEmptyBodyIndexData) {
        this.$antMessage.error("请选择指标！");
        return false;
      }

      // let sum = this.bodyIndexData.reduce((sum, item) => {
      //   let c = 0;
      //   item.indexList.forEach((i) => {
      //     c += Number(i.riskScore);
      //   });
      //   return sum + c;
      // }, 0);
      // if (sum != 100) {
      //   this.$antMessage.error(
      //     "所有指标的风险分值合计为100分，不符合是提示“当前所有指标风险分值合计大于/小于100分，请重新配置!"
      //   );
      //   return false;
      // }

      // 部门数据
      const maturityEvaluationReportIdList = this.selectDeptList.map(item=>item.maturityEvaluationReportId)

      // 分值分档数据
      let scoreObj = {
        scorePositionStatus:this.scorePositionStatus
      }
      if(this.scorePositionStatus){
        scoreObj = {
          ...scoreObj,
        }
      }

      // 指标数据
      let bodyIndexObj = {}
      this.bodyIndexData.forEach(item=>{
        bodyIndexObj[item.key] = item.indexList.map(item=>item.maturityEvaluationIndexId)
      })

      let params = {
        maturityEvaluationReportIdList,
        ...scoreObj,
        ...bodyIndexObj,
      };
      this.handleLoading()
      addMaturityEvaluationQuotaReportConfig(params)
      .then((res) => {
        this.$antMessage.success("配置成功");
        this.$router.push({
          // path: "/ehsGerneralManage/maturityEvaluation/maturityEvaluationQuotaReport",
        });
      })
      .catch(err=>{})
      .finally(()=>{
        setTimeout(() => {
          this.cancelLoading()
        }, 300);
      })
    },

    // 选指标
    selectIndex() {
      this.indexVisible = true;
    },
    // 指标关闭
    indexCancle() {
      this.indexVisible = false;
      this.indexForm = {
        projectId: undefined,
      };
    },
    // 指标确定
    indexConfirm: debounce(function () {
      if (!formValidator.formAll(this, "indexForm")) {
        return;
      }

      const indexList = this.$refs?.selectIndex?.selectedRow?.length ? this.$refs.selectIndex.selectedRow : [];
      if (!indexList.length) {
        this.$antMessage.warn('请选择指标')
        return
      }
      this.bodyIndexData.some(item => {
        if (item.key == this.indexForm.projectId) {
          item.indexList = this.dispose(indexList);
          return true
        }
      })

      this.indexCancle();
    }, 250, { leading: true, trailing: false }),
    // 删除选择的指标
    configIndexDelete(record, dataItem) {
      const { key } = dataItem
      const { maturityEvaluationIndexId } = record

      this.bodyIndexData = this.bodyIndexData.filter(item => {
        if (item.key == key) {
          item.indexList = item.indexList.filter(indexListItem => indexListItem.maturityEvaluationIndexId != maturityEvaluationIndexId)
        }
        return item
      })
    },

    //选择启用分值
    handleScoreChange(e) {
      console.log(`checked = ${e.target.checked}`);
      this.scorePositionStatus = e.target.checked;
    },
    // 分值A 2
    handleValueChangeAtwo() {
      const aTwoScore = this.scoreFormData.aTwoScore
      console.log('分值A 2',aTwoScore);
      this.scoreFormData.bOneScore = aTwoScore - 1;

      if(this.scoreFormData.bTwoScore >= this.scoreFormData.bOneScore){
        this.scoreFormData.bTwoScore = null;
      }
    },
    // 分值B 2
    handleValueChangeBtwo() {
      console.log('bTwoScoreMax',this.bTwoScoreMax);
      const bTwoScore = this.scoreFormData.bTwoScore
      this.scoreFormData.cOneScore = bTwoScore - 1;
    },
  },
};
</script>

<style scoped lang="less">
.table-p-box {
  & > p {
    margin-bottom: 1em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }
}
/deep/ .ant-input-number {
  width: 100%;
}
</style>
