<template>
  <HasFixedBottomWrapper>
    <PageTitle>配置绩效填报表</PageTitle>
    <DashBtn>
      <div>
        <a-button type="dashed" v-if="showSelectDept" @click="selectCorporation"
          >选择部门</a-button
        >
        <a-button type="dashed" @click="selectIndex">选择指标</a-button>
      </div>
    </DashBtn>
    <PageTitle>
      部门：
      <template v-if="selectDeptList.length">
        <span v-for="(i, index) in selectDeptList" :key="index"
          >{{ i.deptName }},</span
        >
      </template>
      <template v-else
        ><span class="font-14 color-999"
          >请点击上方”选择组织“按钮选择组织</span
        ></template
      >
    </PageTitle>
    <!-- 启用分值档位 -->
    <div>
      <a-checkbox v-model="startStatus" @change="handleScoreChange">
        启用分值档位
      </a-checkbox>
      <div v-if="startStatus">
        <a-form-model
          ref="scoreForm"
          labelAlign="right"
          :model="scoreFormData"
          :rules="scoreFormDataRules"
          :colon="false"
        >
          <a-row type="flex" justify="space-between">
            <a-col :span="6">
              <a-form-model-item
                label="A档分值"
                :rules="scoreFormDataRules.aScore[0]"
              >
                <a-row type="flex" justify="space-between">
                  <a-col :span="11">
                    <a-form-model-item
                      label=""
                      prop="levelAOneScore"
                      :rules="scoreFormDataRules.aScore[0]"
                    >
                      <a-input-number
                        v-model="scoreFormData.levelAOneScore"
                        placeholder="请输入分值"
                        :max="100"
                        :disabled="true"
                      ></a-input-number>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1">
                    <div style="text-align: center">-</div>
                  </a-col>
                  <a-col :span="11">
                    <a-form-model-item
                      label=""
                      prop="levelATwoScore"
                      :rules="scoreFormDataRules.aScore[1]"
                    >
                      <a-input-number
                        v-model="scoreFormData.levelATwoScore"
                        @change="handleValueChangeAtwo"
                        :max="99"
                        :min="4"
                        placeholder="请输入分值"
                      ></a-input-number>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="B档分值"
                :rules="scoreFormDataRules.bScore[0]"
              >
                <a-row type="flex" justify="space-between">
                  <a-col :span="11">
                    <a-form-model-item
                      label=""
                      prop="levelBOneScore"
                      :rules="scoreFormDataRules.bScore[0]"
                    >
                      <a-input-number
                        v-model="scoreFormData.levelBOneScore"
                        placeholder="请输入分值"
                        @change="handleValueChangeBone"
                        :max="levelBOneScoreMax"
                        :disabled="true"
                        :min="3"
                      ></a-input-number>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1">
                    <div style="text-align: center">-</div>
                  </a-col>
                  <a-col :span="11">
                    <a-form-model-item
                      label=""
                      prop="levelBTwoScore"
                      :rules="scoreFormDataRules.bScore[1]"
                    >
                      <a-input-number
                        v-model="scoreFormData.levelBTwoScore"
                        :max="levelBTwoScoreMax"
                        :min="2"
                        @change="handleValueChangeBtwo"
                        placeholder="请输入分值"
                      ></a-input-number>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="C档分值"
                :rules="scoreFormDataRules.cScore[0]"
              >
                <a-row type="flex" justify="space-between">
                  <a-col :span="11">
                    <a-form-model-item
                      label=""
                      prop="levelCOneScore"
                      :rules="scoreFormDataRules.cScore[0]"
                    >
                      <a-input-number
                        v-model="scoreFormData.levelCOneScore"
                        :max="levelCOneScoreMax"
                        :min="2"
                        :disabled="true"
                        placeholder="请输入分值"
                      ></a-input-number>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1">
                    <div style="text-align: center">-</div>
                  </a-col>
                  <a-col :span="11">
                    <a-form-model-item
                      label=""
                      prop="levelCTwoScore"
                      :rules="scoreFormDataRules.cScore[1]"
                    >
                      <a-input-number
                        v-model="scoreFormData.levelCTwoScore"
                        placeholder="请输入分值"
                        :disabled="true"
                      ></a-input-number>
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
      <div class="index-item" v-for="item in bodyIndexData">
        <PageTitle>{{ item.projectName }}</PageTitle>
        <a-table
          :columns="columns"
          :scroll="{ x: 800 }"
          :data-source="item.indexList"
          :pagination="false"
          bordered
        >
          <div slot="deductPoints" slot-scope="record">
            <p v-for="(i, index) in record" :key="index">{{ i }}</p>
          </div>
          <div slot="unit" slot-scope="record">
            <p v-for="(i, index) in record" :key="index">{{ i }}</p>
          </div>
          <div slot="deductScore" slot-scope="record">
            <p v-for="(i, index) in record" :key="index">{{ i }}</p>
          </div>
          <div slot="action" slot-scope="record">
            <span
              class="color-red cursor-pointer"
              @click="configIndexDelete(record, item)"
              >删除</span
            >
          </div>
        </a-table>
      </div>
    </div>
    <!-- 按钮 -->
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button @click="pageCancle">取消</a-button>
          <a-button type="primary" :loading="btnLoading" @click="pageSubmit"
            >保存</a-button
          >
        </div>
      </FixedBottom>
    </div>
    <!-- 选择指标 -->
    <CommonModal
      class="table-modal-large"
      title="选择指标"
      :visible="indexVisible"
      :cancelFn="indexCancle"
    >
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
          <!-- 固定指标 -->
          <a-form-model-item class="flex" label="所属项目" prop="projectId">
            <a-select
              v-model="indexForm.projectId"
              @change="handleSelectItem"
              placeholder="请选择所属项目"
            >
              <a-select-option
                v-for="item in projectList"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            class="flex"
            v-if="indexForm.projectId || indexForm.projectId == 0"
            label=""
            prop="indexList"
            :wrapper-col="{ style: { width: '100%' } }"
          >
            <selectIndex
              ref="selectIndex"
              :selectedRowOld="indexForm.itemCommandList || []"
            ></selectIndex>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="indexCancle">取消</a-button>
        <a-button
          type="primary"
          class="m-l-15"
          :loading="indexLoading"
          @click="indexConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
    <!-- 选择部门 -->
    <CommonModal
      class="table-modal-large"
      title="选择组织"
      :visible="corporationVisible"
      :cancelFn="corporationCancle"
    >
      <div>
        <selectDept
          ref="selectDept"
          :selectedRowOld="selectDeptList || []"
        ></selectDept>
      </div>
      <template slot="btn">
        <a-button @click="corporationCancle">取消</a-button>
        <a-button
          type="primary"
          class="m-l-15"
          :loading="indexLoading"
          @click="deptConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </HasFixedBottomWrapper>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";

import selectIndex from "./selectIndex.vue";
import selectDept from "./selectDept.vue";
import { nanoid } from "nanoid";
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from "lodash";
import {
  addAchDeptConfig,
  viewAchDeptConfig,
} from "@/services/performanceManagementBranch.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    selectIndex,
    selectDept,
    FixedBottom,
  },
  data() {
    return {
      hasSelectId: [], // 所选指标id组合
      hasSelectList: [],
      //显示选择部门
      showSelectDept: true,
      columns: [
        {
          title: "指标名称",
          dataIndex: "indexInfo",
          width: 200,
        },
        {
          title: "风险分值",
          dataIndex: "riskScore",
          width: 100,
        },
        {
          title: "扣分标准",
          scopedSlots: { customRender: "deductPoints" },
          dataIndex: "deductPoints",
          width: 200,
        },
        {
          title: "指标单位",
          scopedSlots: { customRender: "unit" },
          dataIndex: "unit",
          width: 100,
        },
        {
          title: "扣分分值",
          scopedSlots: { customRender: "deductScore" },
          dataIndex: "deductScore",
          width: 100,
        },
        {
          title: "备注",
          dataIndex: "remake",
          width: 200,
        },
        // {
        //     title: '修改人',
        //     dataIndex: 'updateUserName',
        //     width: 200,
        // },
      ],
      btnLoading: false,
      indexLoading: false,
      indexVisible: false,
      projectList: [
        {
          key: 0,
          value: "安全",
        },
        {
          key: 1,
          value: "消防",
        },
        {
          key: 2,
          value: "环境",
        },
        {
          key: 3,
          value: "职业健康",
        },
        {
          key: 4,
          value: "其他管理事项",
        },
      ],
      indexForm: {
        projectId: undefined,
      },
      indexFormRules: {
        projectId: [
          { required: true, message: "所属项目不可为空", trigger: "change" },
        ],
      },
      selectIndexList: [], // 当前指标选择的数组
      bodyIndexData: [
        {
          projectName: "安全",
          indexList: [],
        },
        {
          projectName: "消防",
          indexList: [],
        },
        {
          projectName: "环境",
          indexList: [],
        },
        {
          projectName: "职业健康",
          indexList: [],
        },
        {
          projectName: "其他管理事项",
          indexList: [],
        },
      ],
      //部门数据
      corporationVisible: false,
      selectDeptList: [],
      //分值
      startStatus: false,
      scoreFormData: {
        levelAOneScore: 100,
        levelCTwoScore: 0,
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
    this.columns.push({
      title: "操作",
      scopedSlots: { customRender: "action" },
      fixed: "right", // 固定操作列
      width: 200, // 宽度根据操作自定义设置
    });
    if (
      this.$route.query &&
      this.$route.query.id &&
      this.$route.query.configStatus &&
      this.$route.query.deptId &&
      this.$route.query.deptName
    ) {
      // 已配置 获取详情
      console.log();
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
      this.showSelectDept = false;
    }
  },
  computed: {
    levelBOneScoreMax() {
      return this.scoreFormData.levelATwoScore - 1;
    },
    levelBTwoScoreMax() {
      // this.scoreFormData.levelBTwoScore = this.scoreFormData.levelBOneScore - 1
      return this.scoreFormData.levelBOneScore - 1;
    },
    levelCOneScoreMax() {
      // this.scoreFormData.levelCOneScore = this.scoreFormData.levelBTwoScore - 1
      return this.scoreFormData.levelBTwoScore - 1;
    },
  },
  methods: {
    configIndexDelete(record, dataItem) {
      // 点击删除时，获取到当前点击的表格所有数据 + 当前要操作的数据
      // 把dataItem中的projectName拿到去this.bodyIndexData里面匹配
      // 匹配成功后直接遍历this.bodyIndexData中对应的indexList
      // record中的id和indexList中的id相匹配时，删掉匹配上的数据（在数组中删除对应值还要删掉下标）
      // 最终打印this.bodyIndexData
      // console.log(dataItem.indexList.id,'dataItemindexList');
      console.log(record,'record');
      console.log(dataItem,'dataItem');

      const seldctId = dataItem.indexList.map(i => i.id)
      this.bodyIndexData.forEach((item) => {
        if(item.projectName == dataItem.projectName){
          item.indexList.forEach((record,index) => {
            if(record.id == seldctId){
              item.indexList.splice(index, 1);
            }
          })
        }
      })
      console.log(this.bodyIndexData,'xind');
    },
    // 获取详情
    getDetail(e) {
      viewAchDeptConfig({
        id: e,
      })
        .then((res) => {
          this.startStatus = res.data.startStatus == 2 ? true : false;
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
            levelAOneScore: res.data.levelAOneScore || 100,
            levelATwoScore: res.data.levelATwoScore,
            levelBOneScore: res.data.levelBOneScore,
            levelBTwoScore: res.data.levelBTwoScore,
            levelCOneScore: res.data.levelCOneScore,
            levelCTwoScore: res.data.levelCTwoScore || 0,
          };

          //  startStatus: this.startStatus ? 2 : 1,
          // ...this.scoreFormData,
          // safeIndexIds: this.bodyIndexData[0].indexList.map(i => i.id),
          // fireIndexIds: this.bodyIndexData[1].indexList.map(i => i.id),
          // environmentIndexIds: this.bodyIndexData[2].indexList.map(i => i.id),
          // healthIndexIds: this.bodyIndexData[3].indexList.map(i => i.id),
          // otherIndexIds: this.bodyIndexData[4].indexList.map(i => i.id),
        })
        .catch((err) => console.log(err));
    },
    //处理一下数据
    dispose(data) {
      let arr = data.map((i) => {
        i.deductPoints = i.indexItems.map((item) => item.deductPoints);
        i.unit = i.indexItems.map((item) => item.unit);
        i.deductScore = i.indexItems.map((item) => item.deductScore);
        return i;
      });
      return arr;
    },
    // 指标取消
    indexCancle() {
      this.selectIndexList = [];
      this.indexVisible = false;
      this.indexLoading = false;
      this.indexForm = {
        projectId: undefined,
      };
    },
    // 选部门
    selectCorporation() {
      this.corporationVisible = true;
    },
    //选择部门
    deptConfirm() {
      this.selectDeptList = this.$refs.selectDept.selectedRow.length
        ? this.$refs.selectDept.selectedRow
        : null;
      this.corporationCancle();
    },
    // 选择部门取消
    corporationCancle() {
      this.corporationVisible = false;
    },
    pageCancle() {
      this.$router.push(
        "/ehsGerneralManage/orgPerformanceManage/performanceBranchReport"
      );
    },
    //提交指标
    pageSubmit: debounce(
      function (n) {
        //验证部门
        if (!this.selectDeptList.length) {
          this.$antMessage.error("请选择部门！");
          return;
        }
        //验证分值分档
        if (this.startStatus) {
          if (!formValidator.formAll(this, "scoreForm")) {
            return;
          }
        }

        let b = this.bodyIndexData.some((i) => {
          if (!i.indexList.length) {
            return true;
          } else {
            return false;
          }
        });
        if (b) {
          this.$antMessage.error("请选择指标！");
          return false;
        }

        let sum = this.bodyIndexData.reduce((sum, item) => {
          let c = 0;
          item.indexList.forEach((i) => {
            c += Number(i.riskScore);
          });
          return sum + c;
        }, 0);
        console.log("------------------sum---------------");
        console.log(sum);
        if (sum != 100) {
          this.$antMessage.error(
            "所有指标的风险分值合计为100分，不符合是提示“当前所有指标风险分值合计大于/小于100分，请重新配置!"
          );
          return false;
        }

        let params = {
          ids: this.selectDeptList.map((i) => i.id),
          startStatus: this.startStatus ? 2 : 1,
          ...this.scoreFormData,
          safeIndexIds: this.bodyIndexData[0].indexList.map((i) => i.id),
          fireIndexIds: this.bodyIndexData[1].indexList.map((i) => i.id),
          environmentIndexIds: this.bodyIndexData[2].indexList.map((i) => i.id),
          healthIndexIds: this.bodyIndexData[3].indexList.map((i) => i.id),
          otherIndexIds: this.bodyIndexData[4].indexList.map((i) => i.id),
        };

        addAchDeptConfig(params).then((res) => {
          this.$antMessage.success("成功");
          this.$router.push({
            path: "/ehsGerneralManage/orgPerformanceManage/performanceBranchReport",
          });
        });
      },
      2000,
      { leading: true, trailing: false }
    ),
    // 选指标
    selectIndex() {
      this.indexVisible = true;
    },
    //指标关闭
    indexCancle() {
      this.selectIndexList = [];
      this.indexVisible = false;
      this.indexLoading = false;
      this.indexForm = {
        projectId: undefined,
      };
    },
    //指标确定
    indexConfirm() {
      if (!formValidator.formAll(this, "indexForm")) {
        return;
      }

      this.indexLoading = true;
      this.bodyIndexData[this.indexForm.projectId].indexList = this.$refs
        .selectIndex.selectedRow.length
        ? this.$refs.selectIndex.selectedRow
        : null;
      this.bodyIndexData[this.indexForm.projectId].indexList = this.dispose(
        this.bodyIndexData[this.indexForm.projectId].indexList
      );

      this.indexCancle();
    },
    //选择改变项目改变
    handleSelectItem(e) {
      console.log(e);
      this.indexForm.itemCommandList = this.bodyIndexData[e].indexList;
    },
    //选择启用分值
    handleScoreChange(e) {
      console.log(`checked = ${e.target.checked}`);
      this.startStatus = e.target.checked;
    },
    //B档第一个
    handleValueChangeAtwo(e) {
      // if (typeof this.scoreFormData.levelBOneScore == 'number') {

      // }
      this.scoreFormData.levelBOneScore = e - 1;
    },
    //B档第二个
    handleValueChangeBone(e) {
      if (typeof this.scoreFormData.levelBTowScore == "number") {
        this.scoreFormData.levelBTowScore = e - 1;
      }
    },
    //c档第一个
    handleValueChangeBtwo(e) {
      console.log(e);
      this.scoreFormData.levelCOneScore = e - 1;
      // if (typeof this.scoreFormData.levelCOneScore == 'number') {
      //     this.scoreFormData.levelCOneScore = e - 1
      // }
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .ant-input-number {
  width: 100%;
}
</style>
