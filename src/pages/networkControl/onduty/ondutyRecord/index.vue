<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <a-form-model id="pdfDom" ref="ruleForm" :model="iFrom" :colon="false" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!-- 开发完成后打开 -->
            <template title="值班基本信息">
              <div>
                <div class="m-t-20 border-b-e7 has-right-btn">
                  <PageTitle>值班基本信息</PageTitle>
                  <template v-if="isShowPage">
                    <a-button type="primary" v-show="showPrintPdfBtn" @click="reactPrint">导出PDF</a-button>
                  </template>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-row>
                <a-col :span="spanCol">
                  <CommonDept
                    ref="corporationId"
                    disabled
                    :CommonFormInline="iFrom"
                    :notTablePage="true"
                    :hasDepartment="true"
                    @corporationDeptChange="corporationDeptChange"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  ></CommonDept>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="deptId" label="部门" prop="deptId">
                    <DeptTree disabled :placeholder="iFrom.corporationId ? '':'请先选择所属组织'" v-model="iFrom.deptId" :deptData="deptData" @change="(val,lab)=> departOrPerpleChange(lab,'applyDepartName')"></DeptTree>
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="planName" label="值班名称" prop="planName">
                    <a-input v-model="iFrom.planName" disabled />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="classesName" label="值班班次" prop="classesName">
                    <a-input v-model="iFrom.classesName" disabled />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="dutyDate" label="值班日期" prop="dutyDate">
                    <a-input v-model="iFrom.dutyDate" disabled />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="dutyTime" label="值班时段" prop="dutyTime">
                    <a-input v-model="iFrom.dutyTime" disabled />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="dutyUserNameList" label="值班员" prop="dutyUserNameList">
                    <a-input v-model="iFrom.dutyUserNameList" disabled />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
            <template title="火灾报警控制运行情况">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">火灾报警控制运行情况</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openFireModel">
                        <a-icon type="plus" />新增
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable>
                  <vxe-table
                    class="vxe-scrollbar beauty-scroll-fireBox"
                    border
                    :show-header-overflow="!isShowPage"
                    :show-overflow="!isShowPage"
                    align="center"
                    :row-config="{isHover: true}"
                    :data="iFrom.fireAlarmList"
                  >
                    <vxe-column field="normal" title="正常">
                      <template #default="{ row }">
                        <span>{{ row.normal == '1' ? '是' : '否' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-column field="failure" title="故障">
                      <template #default="{ row }">
                        <span>{{ row.failure == '1' ? '是' : '否' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-colgroup title="火警">
                      <vxe-column field="fireAlarm" title="火警">
                        <template #default="{ row }">
                          <span>{{ row.fireAlarm == '1' ? '√' : '×' }}</span>
                        </template>
                      </vxe-column>
                      <vxe-column field="fireAlarm" title="误报">
                        <template #default="{ row }">
                          <span>{{ row.fireAlarm == '0' ? '√' : '×' }}</span>
                        </template>
                      </vxe-column>
                    </vxe-colgroup>
                    <vxe-column field="faultAlarm" title="故障报警">
                      <template #default="{ row }">
                        <span>{{ row.faultAlarm == '1' ? '是' : '否' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-column field="supervisionAlarm" title="监管报警">
                      <template #default="{ row }">
                        <span>{{ row.supervisionAlarm == '1' ? '是' : '否' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-column field="omissionOfReport" title="漏报">
                      <template #default="{ row }">
                        <span>{{ row.omissionOfReport == '1' ? '是' : '否' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-column field="handlingSituation" width="260" title="报警、故障部位、原因及处理情况"></vxe-column>
                    <vxe-colgroup title="值班时段">
                      <vxe-column field="startTime" title="开始时间"></vxe-column>
                      <vxe-column field="endTime" title="结束时间"></vxe-column>
                    </vxe-colgroup>
                    <vxe-column field="dutyUserNameList" title="值班员"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="100" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openFireModel(row)">编辑</span>
                          <span class="color-ff4d4f cursor-pointer" @click="rmFireRecordItem(row)">删除</span>
                        </div>
                      </template>
                    </vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
              </a-form-model-item>
            </template>
            <template title="控制室内其他消防系统运行情况">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">控制室内其他消防系统运行情况</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openRoomModel">
                        <a-icon type="plus" />新增
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable>
                  <vxe-table
                    class="vxe-scrollbar beauty-scroll-fireBox"
                    border
                    :show-header-overflow="!isShowPage"
                    :show-overflow="!isShowPage"
                    align="center"
                    :row-config="{isHover: true}"
                    :data="iFrom.roomFireFightingList"
                  >
                    <vxe-column field="deviceName" width="200" title="消防系统及相关设备名称"></vxe-column>
                    <vxe-column field="controlState" title="控制状态">
                      <template #default="{ row }">
                        <span>{{ row.controlState == '1' ? '自动' : '手动' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-column field="runningState" title="运行状态">
                      <template #default="{ row }">
                        <span>{{ row.runningState == '1' ? '故障' : '正常' }}</span>
                      </template>
                    </vxe-column>
                    <vxe-column field="handlingSituation" width="260" title="报警、故障部位、原因及处理情况"></vxe-column>
                    <vxe-colgroup title="值班时段">
                      <vxe-column field="startTime" title="开始时间"></vxe-column>
                      <vxe-column field="endTime" title="结束时间"></vxe-column>
                    </vxe-colgroup>
                    <vxe-column field="dutyUserNameList" title="值班员"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="100" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openRoomModel(row)">编辑</span>
                          <span class="color-ff4d4f cursor-pointer" @click="rmRoomRecordItem(row)">删除</span>
                        </div>
                      </template>
                    </vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
              </a-form-model-item>
            </template>
            <template title="消防主机日检查情况记录">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">消防主机日检查情况记录</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openEngineModel">
                        <a-icon type="plus" />新增
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable>
                  <vxe-table
                    class="vxe-scrollbar beauty-scroll-fireBox"
                    border
                    :show-header-overflow="!isShowPage"
                    :show-overflow="!isShowPage"
                    align="center"
                    :row-config="{isHover: true}"
                    :data="iFrom.fireEngineCheckList"
                  >
                    <vxe-colgroup title="消防主机型号">
                      <vxe-column field="fireEngineOne" title=" "></vxe-column>
                      <vxe-column field="fireEngineTwo" title=" "></vxe-column>
                    </vxe-colgroup>
                    <vxe-colgroup title="检查内容">
                      <vxe-column field="selfTest" title="自检">
                        <template #default="{ row }">
                          <span>{{ row.selfTest == '1' ? '异常' : '正常' }}</span>
                        </template>
                      </vxe-column>
                      <vxe-column field="silencing" title="消音">
                        <template #default="{ row }">
                          <span>{{ row.silencing == '1' ? '异常' : '正常' }}</span>
                        </template>
                      </vxe-column>
                      <vxe-column field="reset" title="复位">
                        <template #default="{ row }">
                          <span>{{ row.reset == '1' ? '异常' : '正常' }}</span>
                        </template>
                      </vxe-column>
                      <vxe-column field="mainPower" title="主电源">
                        <template #default="{ row }">
                          <span>{{ row.mainPower == '1' ? '异常' : '正常' }}</span>
                        </template>
                      </vxe-column>
                      <vxe-column field="standbyPower" title="备用电源">
                        <template #default="{ row }">
                          <span>{{ row.standbyPower == '1' ? '异常' : '正常' }}</span>
                        </template>
                      </vxe-column>
                    </vxe-colgroup>
                    <vxe-column field="checkTime" title="检查时间"></vxe-column>
                    <vxe-column field="dutyUserNameList" title="检查人"></vxe-column>
                    <vxe-column field="handlingSituation" title="故障及处理情况"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="100" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openEngineModel(row)">编辑</span>
                          <span class="color-ff4d4f cursor-pointer" @click="rmEngineRecordItem(row)">删除</span>
                        </div>
                      </template>
                    </vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
              </a-form-model-item>
            </template>
          </a-form-model>

          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
                <a-button type="primary" v-if="!isShowPage" class="m-r-15" :loading="loading" @click="iSubmit">提交</a-button>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <!-- 新增面板弹窗 -->
    <FireDataModel
      v-model="inspectionRecordModelShowFire"
      :formModelOldData="formModelFireData"
      :dutyId="dutyId"
      :fireType="fireType"
      @addModuleList="openInspectionRecordModelFire"
      @changeModuleList="editInspectionRecordItemFire"
    />
    <RoomDataModel
      v-model="inspectionRecordModelShowRoom"
      :formModelOldData="formModelRoomData"
      :dutyId="dutyId"
      :roomType="roomType"
      @addModuleList="openInspectionRecordModelRoom"
      @changeModuleList="editInspectionRecordItemRoom"
    />
    <EngineDataModel
      v-model="inspectionRecordModelShowEngine"
      :formModelOldData="formModelEngineData"
      :dutyId="dutyId"
      :engineType="engineType"
      @addModuleList="openInspectionRecordModelEngine"
      @changeModuleList="editInspectionRecordItemEngine"
    />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { getOndutyRecordDetailApi, editOndutyRecordApi, ondutyTableUpdateApi, getInspectionRecordListApi, rmInspectionRecordApi, getOndutyAlarmRecordApi, getOndutyTroubleShootingApi, getOndutyTestRecordApi, rmFirePhoneRecordItemApi, getFirePhoneRecordListApi, } from '@/services/networkControl/onduty.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import deptAndUser from '@/pages/dangerWorkStatic/mixin/deptAndUser.js'
import CustomTable from '../comp/customTable.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import FireDataModel from './comp/fireDataModel.vue'
import EngineDataModel from './comp/engineDataModel.vue'
import RoomDataModel from './comp/roomDataModel.vue'
import { getDictConfigData } from "@/utils/dictionary.js";
import dictionary from "@/utils/dictionary.js";
import dayJs from "dayjs";
import ondutyMixin from '@/pages/networkControl/onduty/mixin/ondutyMixin.js'
export default {
  components: { FixedBottom, CustomTable, FireDataModel, EngineDataModel, RoomDataModel },
  mixins: [chemicalDict, cancelLoading, deptAndUser, ondutyMixin],
  data() {
    return {
      // 配置弹窗
      addCasNoModelShow: false,
      configTableRowKey: undefined,
      configItemKey: undefined,
      apiName: undefined,
      selectedRowOld: [],
      systemList: [],
      itemsList: [],
      otherList: [],
      spanCol: 12,
      spinning: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
      iFrom: {
        dutyId: '',
        fireAlarmList: [],
        roomFireFightingList: [],
        fireEngineCheckList: [],
      },
      iRules: {
        systemList: [{ required: true, validator: this.customTableValidator, trigger: "change", targetName: 'systemList', text: '系统数据' },],
        fireFightingSystemTableList: [{ required: true, validator: this.customTableValidator, trigger: "change", targetName: 'fireFightingSystemTableList', text: '消防系统CRT每日检测', targetAttr: 'fire', },],
        otherList: [{ required: true, validator: this.customTableValidator, trigger: "change", targetName: 'otherList', text: '其他交接' },],
      },
      showPrintPdfBtn: true,
      // 主键
      dutyId: undefined,
      formModelFireData: {},
      formModelRoomData: {},
      formModelEngineData: {},
      handSealList: [],
      fireType: '',
      roomType: '',
      engineType: '',
      inspectionRecordModelShowFire: false,
      inspectionRecordModelShowRoom: false,
      inspectionRecordModelShowEngine: false,
    }
  },
  created() {
    this.dutyId = this.$route.query.dutyId
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为查看
    isShowPage() {
      return Boolean(this.$route.meta.isShowPage)
    },
  },
  methods: {
    // 页面初始化
    initPage() {
      // 获取页面详情
      Promise.all([
        this.getPageDetail(),
      ])
      .then(resArr => { })
      .finally(() => {
        this.spinning = false
      })
    },
    // 获取页面详情
    getPageDetail() {
      let apiData = { dutyId: this.dutyId }
      return getOndutyRecordDetailApi(apiData)
        .then(res => {
          // console.log('页面详情', res.data);
          if (res.data) {
            // 值班基本信息
            let iFrom = res.data
            iFrom.dutyUserNameList = iFrom.dutyUserNameList.length > 0 ? iFrom.dutyUserNameList.join(',') : '';
            // 部门回显
            this.$refs.corporationId.corporationChange(iFrom.corporationId, iFrom.deptId)
            // 值班时段
            iFrom.dutyTime = (iFrom.dutyStartTime && iFrom.dutyEndTime) ? iFrom.dutyStartTime + ' ~ ' + iFrom.dutyEndTime : ''
            // 交班时间
            iFrom.handPickClassTime = iFrom.handPickClassTime ? dayJs(iFrom.handPickClassTime).format("YYYY-MM-DD hh:mm:ss") : ''
            this.iFrom = cloneDeep(iFrom)

            // 已交接，展示手签章
            if (iFrom.handPickStatus) {
              this.handSealList = iFrom.handSealFileList || []
            }

            // 消防系统CRT每日检测
            let crtList = iFrom.crtList || []
            crtList.forEach(item => {
              item.guid = this.guid()
            })
            this.fireFightingSystem.tableAllList = cloneDeep(crtList)
            console.log(this.iFrom)
            console.log(iFrom)
            return iFrom
          } else {
            console.log('详情数据返回异常');
            return Promise.reject()
          }
        })
        .then(detailRes => {
          return Promise.all([
            this.getTroubleShooting(detailRes),
            this.getTestRecord(detailRes),
          ])
        })
        .catch(err => {
          return Promise.reject()
        })
    },
    // 过滤内容
    filterValue(tarInfo) {
      if (tarInfo) {
        let str = Array.isArray(tarInfo) ? tarInfo.toString() : tarInfo
        return str
      } else {
        return ''
      }
    },
    openFireModel(row) {
      console.log(row, '?')
      this.fireType = row.fireTimeStamp ? '编辑' : '新增';
      this.formModelFireData = row.fireTimeStamp ? row : {};
      this.inspectionRecordModelShowFire = true;
    },
    openRoomModel(row) {
      this.roomType = row.roomTimeStamp ? '编辑' : '新增';
      this.formModelRoomData = row.roomTimeStamp ? row : {};
      this.inspectionRecordModelShowRoom = true;
    },
    openEngineModel(row) {
      this.engineType = row.engineTimeStamp ? '编辑' : '新增';
      this.formModelEngineData = row.engineTimeStamp ? row : {};
      this.inspectionRecordModelShowEngine = true;
    },
    openInspectionRecordModelFire(row) {
      this.iFrom.fireAlarmList.push(row)
    },
    openInspectionRecordModelRoom(row) {
      this.iFrom.roomFireFightingList.push(row)
    },
    openInspectionRecordModelEngine(row) {
      this.iFrom.fireEngineCheckList.push(row)
    },
    editInspectionRecordItemFire(row) {
      let currentIndex;
      this.iFrom.fireAlarmList.forEach((item, index)=>{
        row.fireTimeStamp == item.fireTimeStamp && (currentIndex = index);
      })
      Object.assign(this.iFrom.fireAlarmList[currentIndex], row)
    },
    editInspectionRecordItemRoom(row) {
      let currentIndex;
      this.iFrom.roomFireFightingList.forEach((item, index)=>{
        row.roomTimeStamp == item.roomTimeStamp && (currentIndex = index);
      })
      Object.assign(this.iFrom.roomFireFightingList[currentIndex], row)
    },
    editInspectionRecordItemEngine(row) {
      let currentIndex;
      this.iFrom.engineAlarmList.forEach((item, index)=>{
        row.engineTimeStamp == item.engineTimeStamp && (currentIndex = index);
      })
      Object.assign(this.iFrom.engineAlarmList[currentIndex], row)
    },
    rmFireRecordItem(row) {
      let currentIndex;
      this.iFrom.fireAlarmList.forEach((item, index)=>{
        row.fireTimeStamp == item.fireTimeStamp && (currentIndex = index);
      })
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.fireAlarmList.splice(currentIndex, 1)
        },
      });
    },
    rmRoomRecordItem(row) {
      let currentIndex;
      this.iFrom.roomFireFightingList.forEach((item, index)=>{
        row.roomTimeStamp == item.roomTimeStamp && (currentIndex = index);
      })
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.roomFireFightingList.splice(currentIndex, 1)
        },
      });
    },
    rmEngineRecordItem(row) {
      let currentIndex;
      this.iFrom.fireEngineCheckList.forEach((item, index)=>{
        row.engineTimeStamp == item.engineTimeStamp && (currentIndex = index);
      })
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.fireEngineCheckList.splice(currentIndex, 1)
        },
      });
    },
    // 系统数据、其他交接--表单校验
    customTableValidator(rule, value, callback) {
      let { required, targetName, targetAttr, text } = rule
      targetAttr = targetAttr ? targetAttr : 'value'
      let hasFalse = this[targetName].some(item => !item[targetAttr])
      if (hasFalse) {
        required ? callback(new Error(`请全部填写${text}项`)) : callback();
      } else {
        callback();
      }
    },
    // pdf导出
    reactPrint() {
      const elLoading = this.$loading({
        lock: true,
        text: '导出中...',
      });
      this.showPrintPdfBtn = false
      setTimeout(() => {
        this.$nextTick(() => {
          const element = document.getElementById('pdfDom');  // 这个dom元素是要导出的pdf的div容器
          const w = element.offsetWidth;  // 获得该容器的宽
          const h = element.offsetHeight;  // 获得该容器的高
          const offsetTop = element.offsetTop; // 获得该容器到文档顶部的距离
          const offsetLeft = element.offsetLeft; // 获得该容器到文档最左的距离
          const canvas = document.createElement('canvas');
          let abs = 0;
          const winI = document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
          const winO = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
          if (winO > winI) {
            abs = (winO - winI) / 2; // 获得滚动条宽度的一半
          }
          canvas.width = w * 2; // 将画布宽&&高放大两倍
          canvas.height = h * 2;
          const context = canvas.getContext('2d');
          context.scale(2, 2);
          context.translate(-offsetLeft - abs, -offsetTop);
          // 这里默认横向没有滚动条的情况，因为offset.left()，有无滚动条的时候存在差值，因此translate的时候，要把这个差值去掉
          html2canvas(element, {
            allowTaint: true,
            scale: 2, // 提升画面质量，但是会增加文件大小
            useCORS: true
          })
            .then((res) => {
              const contentWidth = res.width;
              const contentHeight = res.height;
              // 一页pdf显示html页面生成的canvas高度
              const pageHeight = contentWidth / 592.28 * 841.89;
              // 未生成pdf的html页面高度
              let leftHeight = contentHeight;
              // 页面偏移
              let position = 0;
              // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
              const imgWidth = 595.28;
              const imgHeight = 592.28 / contentWidth * contentHeight;
              const pageDate = res.toDataURL('image/jpeg', 1.0);
              // @ts-ignore
              // eslint-disable-next-line new-cap
              const pdf = new jsPDF('', 'pt', 'a4');
              // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面的高度（841.89）
              // 当内容未超过pdf一页显示的范围，无需分页
              if (leftHeight < pageHeight) {
                pdf.addImage(pageDate, 'JPEG', 0, position, imgWidth, imgHeight);
              } else { // 分页
                while (leftHeight > 0) {
                  pdf.addImage(pageDate, 'JPEG', 0, position, imgWidth, imgHeight)
                  leftHeight -= pageHeight;
                  position -= 841.89;
                  // 避免添加空白页
                  if (leftHeight > 0) {
                    pdf.addPage()
                  }
                }
              }
              pdf.save(`值班记录.pdf`)
            })
            .finally(() => {
              this.showPrintPdfBtn = true
              elLoading.close();
            })
        })
      }, 200);
    },
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i];
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== "[object Object]") {
          dom = dom[0];
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: "center",
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: "smooth",
        });
        break; // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 表单校验
    formValidate() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = false
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        } else {
          formAll = true
        }
      });
      return formAll
    },
    // 提交api
    iSubmit() {
      console.log(this.iFrom)
      // if (!this.formValidate()) {
      //   return
      // }
      // ondutyTableUpdateApi
      // iFrom.fireAlarmList = this.dutyData.fireAlarmList;
      // iFrom.roomFireFightingList = this.dutyData.roomFireFightingList;
      // iFrom.fireEngineCheckList = this.dutyData.fireEngineCheckList;
      let apiData = {
        ...this.iFrom
      }
      this.handleLoading();
      Promise.all([ondutyTableUpdateApi(apiData)])
        .then(res => {
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/emergencyManagement/networkControl/dutyManagement' })
        })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
.searchtable-wrapper {
  display: flex;
  .left-box {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
    .ttile {
      display: flex;
      align-items: center;
      margin-bottom: -3px;
      border-bottom: 1px solid transparent;
      .ttile-text {
        margin-bottom: 10px;
        margin-right: 12px;
      }
      .ttile-bbtn {
        margin-bottom: 0px;
      }
    }
    .ttile-add-btn {
      border-bottom: 1px solid #e7e7e7;
      padding-bottom: 18px;
    }
    ::v-deep .fixed-bottom {
      bottom: 0px;
    }
  }
  .right-box {
    flex: none;
    display: flex;
  }
}

.title-tips {
  font-size: 14px;
}
.checkbox-item {
  margin-left: 0px;
  margin-right: 10px;
  margin-bottom: 8px;
}
.other-explain {
  display: flex;
  align-items: top;
  .other-explain-lable {
    flex: none;
    margin-right: 14px;
  }
}
.responsibility {
  margin: 30px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .responsibility-radio {
    display: inline-flex;
    align-items: center;
  }
}
.has-right-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
textarea {
  resize: none;
}
.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0067cc;
  line-height: 1;
  cursor: pointer;
  .more-btn-up {
    transform: rotate(90deg);
  }
  .more-btn-down {
    transform: rotate(-90deg);
    margin-right: 4px;
  }
}
.text-required {
  &::before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: "*";
  }
}
.required-center {
  display: flex;
  align-items: center;
}
.main-header-top-right-img {
  width: 120px;
  margin: 0px 8px 8px 0;
  cursor: pointer;
}

// 禁用样式 start-----
::v-deep .ant-checkbox-disabled .ant-checkbox-inner {
  background-color: #fff !important;
  border: 1px solid #d9d9d9 !important;
}
::v-deep .ant-checkbox-disabled + span {
  color: rgba(0, 0, 0, 0.65) !important;
}
// ::v-deep .ant-radio-disabled .ant-radio-inner {
//   border-color: #d9d9d9 !important;
//   background-color: #fff !important;
// }
::v-deep .ant-radio-disabled + span {
  color: rgba(0, 0, 0, 0.65) !important;
}
// 禁用样式 end-----
::v-deep .fixed-bottom {
  width: 100%;
  bottom: 30px;
  left: 0px;
  z-index: 999;
}
::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>