<template>
  <!-- 邀请列表 -->
  <HasSpinAndBtnBox :spinning="spinning">
    <div class="content-box clx-flex-1">
      <div class="content-box-l" :class="{'content-box-l2':this.status!= '01'}">
        <SearchTerm>
          <a-form-model layout="inline" :model="searchFormData" :colon="false">
            <CommonSearchItem ref="commonSearchItem" :disabled="type>1" @corporationChange="corporationChange" :CommonFormInline="searchFormData"></CommonSearchItem>
            <a-form-model-item label="填报月份">
              <el-date-picker style="width: 200px" v-model="searchFormData.monthlyDate" value-format="yyyy-MM" type="month" placeholder="选择月" :disabled="type>1" :clearable="false"></el-date-picker>
            </a-form-model-item>

            <a-form-model-item class="float-right"></a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <!-- 列表 -->
        <vxe-table
          ref="xTable"
          keep-source
          :merge-cells="mergeCells"
          :data="tableData"
          border
          :scroll-y="{enabled: false}"
          :edit-config="{trigger: 'click',mode: 'cell',showStatus: true,}"
          :edit-rules="validRules"
        >
          <vxe-column field="projectName" title="项目" type="html" width="200"></vxe-column>
          <vxe-column field="nicheItems" title="数据"></vxe-column>
          <vxe-column v-if="type==1||type==3" field="dataItem" width="200" :title="searchFormData.monthlyDate" :edit-render="{placeholder: '请输入数值'}">
            <template #edit="scope">
              <vxe-input v-model.number="scope.row.dataItem" :disabled="!(scope.row.nicheItemsCode>=1 && scope.row.nicheItemsCode<=141)" type="number" transfer @change="dataItemChange(scope)"></vxe-input>
            </template>
          </vxe-column>
          <vxe-column v-else field="dataItem" :title="searchFormData.monthlyDate" :edit-render="{}">
            <template #edit="scope">
              <vxe-input v-model="scope.row.dataItem" :disabled="true" type="number" transfer @change="$refs.xTable.updateStatus(scope)"></vxe-input>
            </template>
          </vxe-column>
          <!-- <template>
            <vxe-column field="action" fixed="right" title="序号" width="60">
              <template #default="{ rowIndex }">
                <span>{{'C' + (rowIndex+1)}}</span>
              </template>
            </vxe-column>
            <vxe-column field="action1" fixed="right" title="nicheItemsCode" width="70">
              <template #default="{ row }">
                <span>{{row.nicheItemsCode}}</span>
              </template>
            </vxe-column>
          </template>-->

          <template #empty>
            <div style="padding:16px 0;">
              <a-empty />
            </div>
          </template>
        </vxe-table>
      </div>
      <div class="content-box-R" v-if="this.status!= '01'">
        <SetLog :flowLogList="flowLogList" />
      </div>
    </div>

    <FixedBottom slot="fixedBottom">
      <template v-if="!manage">
        <a-button @click="handleBack">取消</a-button>
        <a-button class="m-r-15" type="primary" v-if="this.status == '02'&&userId==createUserId" @click="handleWithdraw">撤回</a-button>
        <a-button class="m-r-15" type="primary" v-if="type!=2" @click="validEvent(1)">保存</a-button>
        <a-button class="m-r-15" type="primary" v-if="type!=2" @click="validEvent(2)">提交</a-button>
      </template>
      <template v-else>
        <a-button @click="handleBack">取消</a-button>
        <a-button class="m-r-15" type="primary" @click="handelManage(1)">驳回</a-button>
        <a-button class="m-r-15" type="primary" @click="handelManage(2)">通过</a-button>
      </template>
    </FixedBottom>

    <CommonModal :title="typeOfApproval==1?'驳回原因':'通过原因'" :visible="submitView" :cancelFn="handleCancel">
      <template slot="form">
        <a-form-model ref="addForm" :label-col="{ style: { width: '130px' } }" :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }" :colon="false" labelAlign="left">
          <a-form-model-item class="flex" :label="typeOfApproval==1?'驳回原因':'通过原因'">
            <a-textarea v-model="cause" placeholder="请输入" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item class="flex" label=" ">
            <a-button @click="handleCancel">取消</a-button>
            <span class="span-l"></span>
            <a-button type="primary" @click="handleConfirm">提交</a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
  </HasSpinAndBtnBox>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import tableDataJson from "./monthlyData.js";
import aikoMonthDataJson from "./aikoMonthData.js";
import { saveEnvMonth, detailsEnvMonth, checkOut, update, envMonthApproved, envMonthApprovalRejection, envMonthApprovalWithdraw, getLog } from "@/services/envMonth.js";
import dayJs from "dayjs";
import SetLog from './setLog.vue'
import formulaMixin from './formulaMixin.js'
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: { SetLog },
  mixins: [cancelLoading, formulaMixin],
  data() {
    return {
      spinning: true,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      searchFormData: {},
      tableData: [],
      validRules: {
        dataItem: [
          {
            required: true,
            message: "请输入数值",
          },
        ],
      },
      type: 1,
      monthlyId: undefined,
      manage: undefined,
      submitView: false,
      cause: null,
      typeOfApproval: null,
      status: '01',
      flowLogList: null,
      userId: null,
      createUserId: null,
      // 全国电网平均排放因子
      electricCharge: 0.5703,
      isChangeDataItem: false,
    };
  },
  created() {
    this.setRouterCode("terrain");
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo'))?.user?.userId
    this.type = this.$route.query.type || getQueryVariable('type')
    this.manage = this.$route.query.manage || getQueryVariable('manage')
    this.monthlyId = this.$route.query.monthlyId || getQueryVariable('monthlyId')

    if (this.type > 1) {   //编辑、查看、处理
      this.initData();
    } else {    //新增
      let tableData = aikoMonthDataJson.filter(i => i.nicheItemsCode != 1300);
      tableData.forEach(item => {
        if (item.nicheItemsCode == 999) {
          item.dataItem = 99;
        } else {
          item.dataItem = 0;
        }
      });
      this.tableData = cloneDeep(tableData)
      this.spinning = false
    }
  },
  computed: {
    // 合并单元格
    mergeCells() {
      //{row: 第几行, col: 第几列, rowspan: 竖向几个, colspan: 横向几个}
      //{ row: 3, col: 0, rowspan: 1, colspan: 3 }, 
      let mergeCellsData = aikoMonthDataJson.map((item, index) => {
        let obj = undefined
        if (item.needMerge) {
          obj = { row: index, ...item.mergeCellsObj }
        }
        return obj
      })
      mergeCellsData = mergeCellsData.filter(item => item)
      return mergeCellsData
    },
    v142() {
      return this.v142Fn()
    },
    v143() {
      return this.v143Fn()
    },
    v144() {
      return this.v144Fn()
    },
    v145() {
      return this.v145Fn()
    },
    v146() {
      return this.v146Fn()
    },
    v147() {
      return this.v147Fn()
    },
    v148() {
      return this.v148Fn()
    },
    v149() {
      return this.v149Fn()
    },
    v150() {
      return this.v150Fn()
    },
    v151() {
      return this.v151Fn()
    },
    v152() {
      return this.v152Fn()
    },
  },
  methods: {
    initData() {
      this.cancelLoading();
      let apiData = {
        monthlyId: this.monthlyId
      }
      detailsEnvMonth(apiData)
        .then((res) => {
          try {
            let environmentMonthlyItemList = res.data.environmentMonthlyItemList || []
            // 回显不需要输入的项
            aikoMonthDataJson.forEach((item, index) => {
              if (item.nicheItemsCode == 999) {
                environmentMonthlyItemList.splice(index, 0, item)
              }
            })
            this.searchFormData = {
              centerId: res.data.centerId,
              corporationId: res.data.corporationId,
              monthlyDate: res.data.monthlyDate
            }
            // this.$refs.commonSearchItem.centerIdChange(this.searchFormData.centerId)
            // 转数字
            environmentMonthlyItemList.forEach(item => {
              item.dataItem = item.dataItem ? item.dataItem - 0 : item.dataItem
            })
            this.tableData = cloneDeep(environmentMonthlyItemList);
            this.monthlyId = res.data.monthlyId
            this.createUserId = res.data.createUserId
            this.status = res.data.status
            if (res.data.status != '01') {
              getLog({ monthlyId: res.data.monthlyId })
                .then(res => {
                  this.flowLogList = res.data
                })
                .finally(() => {
                  this.spinning = false
                })
            } else {
              this.spinning = false
            }
          }
          catch (err) {
            this.spinning = false
          }
        })
        .catch(err => { })
    },
    dataItemChange(scope) {
      this.isChangeDataItem = true
      this.$refs.xTable.updateStatus(scope)
    },
    validEvent: debounce(function (n) {
      console.log('保存、提交', n);
      // console.log(this.tableData)
      // if (!this.searchFormData.centerId) {
      //   this.$antMessage.error("请选择所属中心！");
      //   return false
      // }
      if (!this.searchFormData.corporationId) {
        this.$antMessage.error("请选择组织！");
        return false
      }
      console.log(this.tableData, 'zzc')
      let isNoAll = this.tableData.some(item => typeof item.dataItem != 'number')
      if (isNoAll) {
        this.$antMessage.error("请正确填报！");
        return false
      }
      this.$refs.xTable.validate()
        .then((res) => {
          // console.log(res);
          if (!res) {
            if (this.type == 1) {
              checkOut({
                monthlyDate: this.searchFormData.monthlyDate,//填报月份
                centerId: this.searchFormData.centerId,//中心id
                corporationId: this.searchFormData.corporationId,//组织机构id
              })
                .then(res => {
                  this.submitData(n)
                })
            } else {
              this.editData(n)
            }
          }
        })
    }, 500,
      { leading: true, trailing: false }
    ),
    //submitData
    submitData(n) {
      let apiData = {
        monthlyDate: this.searchFormData.monthlyDate,//填报月份
        status: n == 1 ? '01' : '02',//审批状态
        centerId: this.searchFormData.centerId,//中心id
        corporationId: this.searchFormData.corporationId,//组织机构id
        environmentMonthlyItemList: this.tableData.filter(i => i.nicheItemsCode < 1000).map((i, index) => {
          i.index = index + 1;
          return i
        }),//环境月报数据集合
      }
      saveEnvMonth(apiData)
        .then(res => {
          this.$antMessage.success("填报成功！");
          this.$router.push({
            path: "/environmentManage/envMonthReport/terrain",
          });
        })
        .catch(err => { })
    },
    editData(n) {
      let apiData = {
        monthlyId: this.monthlyId,
        status: n == 1 ? '01' : '02',//审批状态
        environmentMonthlyItemList: this.tableData.filter(i => i.nicheItemsCode < 999).map((i, index) => {
          i.index = index;
          return i
        }),//环境月报数据集合
      }
      update(apiData)
        .then(res => {
          this.$antMessage.success("成功！");
          this.$router.push({
            path: "/environmentManage/envMonthReport/terrain",
          });
        })
        .catch(err => { })
    },
    handleBack() {
      this.setKeepalive(true)
      this.$router.push({
        path: "/environmentManage/envMonthReport/terrain",
      });
    },
    handelManage(n) {
      this.typeOfApproval = n;
      this.submitView = true
    },
    handleCancel() {
      this.submitView = false
    },
    handleConfirm: debounce(function () {
      if (this.typeOfApproval == 2) {
        envMonthApproved({ monthlyId: this.monthlyId, handlingOpinions: this.cause || '' }).then(res => {
          this.$antMessage.success("审批成功！");
          this.$router.push({
            path: "/environmentManage/envMonthReport/terrain",
          });
        })
      } else {
        envMonthApprovalRejection({ monthlyId: this.monthlyId, handlingOpinions: this.cause || '' }).then(res => {
          this.$antMessage.success("驳回成功！");
          this.$router.push({
            path: "/environmentManage/envMonthReport/terrain",
          });
        })
      }
    }, 300, { leading: true, trailing: false }),
    handleWithdraw() {
      let _this = this
      this.$antConfirm({
        title: '确定撤回填报信息吗?',
        onOk() {
          envMonthApprovalWithdraw({ monthlyId: _this.monthlyId }).then(res => {
            _this.$antMessage.success("撤回成功！");
            _this.$router.push({
              path: "/environmentManage/envMonthReport/terrain",
            });
          })
        },
        onCancel() {

        }
      });
    },
    corporationChange(e) {
      // console.log(e, findCorporationId(e))
      // let name = findCorporationId(e)
      // //电网排放因子：B1/B4/B6/BMDT：0.8843；B2/B7/B8/B11/B17/B19：0.5257；B3/B5/B9/B10/B18：0.7035；BMOT：0.5271）
      // if (name == 'B1' || name == 'B4' || name == 'B6' || name == 'BMDT') {
      //   this.electricCharge = 0.8843
      // } else if (name == 'B2' || name == 'B7' || name == 'B8' || name == 'B11' || name == 'B17' || name == 'B19') {
      //   this.electricCharge = 0.5257
      // } else if (name == 'B3' || name == 'B5' || name == 'B9' || name == 'B10' || name == 'B18') {
      //   this.electricCharge = 0.7035
      // } else if (name == 'BMOT') {
      //   this.electricCharge = 0.5271
      // } else {
      //   this.electricCharge = 0.5271
      // }
    },
    getDataItem(nicheItemsCode) {
      let dataItemObj = this.tableData.find(item => item.nicheItemsCode == nicheItemsCode)
      let dataItem = dataItemObj ? dataItemObj.dataItem : 0
      return dataItem
    },
    getDataItemIndex(nicheItemsCode) {
      let dataItemIndex = this.tableData.findIndex(item => item.nicheItemsCode == nicheItemsCode)
      return dataItemIndex
    },
    // 监听计算属性修改
    watchChangeDataItem(nicheItemsCode, newV, precision = 2) {
      if (this.isChangeDataItem) {
        newV = (isNaN(newV) || newV === Infinity) ? 0 : parseFloat(newV.toFixed(precision));
        this.tableData[this.getDataItemIndex(nicheItemsCode)].dataItem = newV;
      }
    },
  },
  watch: {
    v142(newV) {
      this.watchChangeDataItem(142, newV)
    },
    v143(newV) {
      this.watchChangeDataItem(143, newV)
    },
    v144(newV) {
      this.watchChangeDataItem(144, newV)
    },
    v145(newV) {
      this.watchChangeDataItem(145, newV)
    },
    v146(newV) {
      this.watchChangeDataItem(146, newV)
    },
    v147(newV) {
      this.watchChangeDataItem(147, newV)
    },
    v148(newV) {
      this.watchChangeDataItem(148, newV)
    },
    v149(newV) {
      this.watchChangeDataItem(149, newV)
    },
    v150(newV) {
      this.watchChangeDataItem(150, newV)
    },
    v151(newV) {
      this.watchChangeDataItem(151, newV)
    },
    v152(newV) {
      this.watchChangeDataItem(152, newV)
    },
  },
};
</script>

<style lang="less" scoped>
.shenglvhao {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.span-l {
  display: inline-block;
  width: 10px;
}
.content-box {
  display: flex;
  // align-items: flex-start;
  justify-content: center;
}
.content-box-l {
  height: 100%;
  width: 100%;
}
.content-box-l2 {
  // flex-grow: 0;
  // height: 100%;
  width: calc(100% - 426px);
}
.content-box-R {
  width: 426px;
}
@media screen and (max-width: 1366px) {
  .content-box-l2 {
    width: calc(100% - 270px);
  }
  .content-box-R {
    width: 270px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .content-box-l2 {
    width: calc(100% - 326px);
  }
  .content-box-R {
    width: 326px;
  }
}
</style>
