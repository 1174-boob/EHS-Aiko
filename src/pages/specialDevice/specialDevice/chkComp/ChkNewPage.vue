<template>
  <HasSpinAndBtnBox :spinning="false">
    <div class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="4">设备名称：叉车</a-col>
          <a-col :span="4">牌照编号：xxx</a-col>
        </a-row>
        <a-row type="flex" justify="space-around" class="bottom">
          <a-col :span="4">设备代码：xxx</a-col>
          <a-col :span="4">所在位置：xxx</a-col>
        </a-row>
        <a-row type="flex" justify="space-around" class="bottom">
          <a-col :span="4">检查者：xxx</a-col>
          <a-col :span="4">安全管理人员：xxx</a-col>
          <a-col :span="4">检查时间：xxx</a-col>
        </a-row>
      </div>
    </div>



    <a-table :columns="columns" :data-source="data" :pagination="false" bordered>
      <template slot="name" slot-scope="text">
        <a>{{ text }}</a>
      </template>
    </a-table>

    <div class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="24">注：每天操作前进行检查并将检查情况填入单元格内（√表示正常；×表示异常）。发现异常马上报告负责人并经负责人确认后及时处理，处理后在下表中做好记录。</a-col>
        </a-row>
      </div>
    </div>

    <template title="异常问题处理记录">
      <div>
        <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
          <PageTitle class="ttile-text">异常问题处理记录</PageTitle>
          <DashBtn class="ttile-bbtn" v-if="!isShowPage">
            <div>
              <a-button type="dashed" @click="openFireModel">
                <a-icon type="plus" />添加
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
            <vxe-column field="fireRoom" title="序号">
              <template #default="{ row }">
                <span>{{ row.fireRoom ? (row.fireRoom == '1' ? '一期' : '二期') : '--' }}</span>
              </template>
            </vxe-column>
            <vxe-column field="normal" title="异常问题描述">
              <template #default="{ row }">
                <span>{{ row.normal == '1' ? '是' : '否' }}</span>
              </template>
            </vxe-column>
            <vxe-column field="failure" title="问题处理情况">
              <template #default="{ row }">
                <span>{{ row.failure == '1' ? '是' : '否' }}</span>
              </template>
            </vxe-column>
            <vxe-column field="failure" title="处理人 / 日期">
              <template #default="{ row }">
                <span>{{ row.failure == '1' ? '是' : '否' }}</span>
              </template>
            </vxe-column>
            <vxe-column field="faultAlarm" title="备注">
              <template #default="{ row }">
                <span>{{ row.faultAlarm == '1' ? '是' : '否' }}</span>
              </template>
            </vxe-column>
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

    <!-- 新增面板弹窗 -->
    <NewDataModel
      v-model="inspectionRecordModelShowFire"
      :formModelOldData="formModelFireData"
      :dutyId="dutyId"
      :fireType="fireType"
      @addModuleList="openInspectionRecordModelFire"
      @changeModuleList="editInspectionRecordItemFire"
    />

    <FixedBottom slot="fixedBottom">
      <a-button @click="goBack">返回</a-button>
    </FixedBottom>
  </HasSpinAndBtnBox>
</template>

<script>
import { debounce } from "lodash";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import NewDataModel from './NewDataModel.vue'
import reLogin from "@/utils/reLogin";
import { getMenuAuthList, updateDataAuth } from "@/services/api.js";
export default {
  name: "ClkchkSearch",
  components: {
    FixedBottom, NewDataModel
  },
  props: {
    chkType: {
      type: String,
      default: "day",
    },
  },
  data() {
    return {
      dayFormInline: {
        checkDate: [],
        nextCheckDate: [],
      },
      dayColumns: [
        {
          title: "序号",
          dataIndex: "responsibilityName",
          key: "responsibilityName",
          align: "center",
        },
        {
          title: "检查日期",
          dataIndex: "thisCertificationDate",
          key: "thisCertificationDate",
          align: "center",
        },
        {
          title: "检查者12",
          dataIndex: "thisCertificationValid12",
          key: "thisCertificationValid12",
          align: "center",
          customRender: (v) => {
            return v ? v + "年" : "--";
          },
        },
        {
          title: "安全管理人员3",
          dataIndex: "thisCertificationValid3",
          key: "thisCertificationValid3",
          align: "center",
          customRender: (v) => {
            return v ? v + "年" : "--";
          },
        },
        {
          title: "状态123",
          dataIndex: "thisCertificationConclusion123",
          key: "thisCertificationConclusion123",
          align: "center",
        },
        {
          title: "自检报告4",
          dataIndex: "thisCertificationConclusion4",
          key: "thisCertificationConclusion4",
          align: "center",
        },
        {
          title: "点检表123",
          scopedSlots: { customRender: "report" },
          key: "report123",
          align: "center123",
          width: 200, // 宽度根据操作自定义设置
        },
        {
          title: "创建时间",
          dataIndex: "unqualifiedReason",
          key: "unqualifiedReason",
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 150, // 宽度根据操作自定义设置
        },
      ],
      dayTableDataList: [],
      loading: false,


      data: [
        {
          parentTitle: '使用资料检查',
          title: '（1）上一周期的定期检验报告，使用登记证',
          key: 1,
          dataResult: true
        },
        {
          parentTitle: '使用资料检查',
          title: '（2）最近一次的自行检查记录或者报告',
          key: 2,
          dataResult: false
        },
        {
          parentTitle: '使用资料检查',
          title: '（3）场车使用记录、维护保养记录、运行故障和事故记录',
          key: 3,
          dataResult: true
        },
        {
          parentTitle: '使用资料检查',
          title: '（4）本周期内修理的自检报告、相关技术资料、修理单位的生产许可证（如涉及）',
          key: 4,
          dataResult: false
        },
        {
          parentTitle: '结构形式检查',
          title: '检查车辆的主参数、主要结构型式与相关技术资料的描述是否一致',
          key: 5,
          dataResult: true
        },
        {
          parentTitle: '整车外观检查',
          title: '（1）车架易见部位应当有清晰的永久编号，且与有关资料一致',
          key: 6,
          dataResult: true
        },
        {
          parentTitle: '整车外观检查',
          title: '（2）防爆功能的叉车应当在明显部位设置和车辆体积相适合的永久性“Ex”标志和使用说明牌。',
          key: 7,
          dataResult: true
        },
        {
          parentTitle: '整车外观检查',
          title: '（3）仪表或者指示器应当指（显）示清晰醒目、灵敏有效',
          key: 8,
          dataResult: true
        },
        {
          parentTitle: '整车外观检查',
          title: '（4）车身应当周正，各部件齐全、完整，连接紧固，无缺损',
          key: 9,
          dataResult: true
        },
        {
          parentTitle: '整车外观检查',
          title: '（5）应当将车牌固定在车辆明显部位，车牌编号与使用登记信息一致',
          key: 10,
          dataResult: true
        },
        {
          parentTitle: '主要受力结构件检查',
          title: '（1）主要受力结构件（车架、门架、货叉架、货叉）的焊缝外部宏观检查，不得有可见的漏焊、裂纹、烧穿、严重咬边等缺陷。',
          key: 11,
          dataResult: true
        },
        {
          parentTitle: '主要受力结构件检查',
          title: '（2）主要受力结构件应当无明显变形、裂纹和锈蚀，螺栓等连接件不应当缺少和松动。货叉无严重磨损，货叉水平段和垂直段的磨损厚度不应超原值的10%',
          key: 12,
          dataResult: true
        },
        {
          parentTitle: '铭牌和安全警示标志检查',
          title: '（1）铭牌、载荷曲线、安全标志应当符合要求',
          key: 13,
          dataResult: true
        },
        {
          parentTitle: '铭牌和安全警示标志检查',
          title: '（2）铭牌、载荷曲线、安全标志应当置于叉车的显著位置，并且保持清晰',
          key: 14,
          dataResult: true
        },
        {
          parentTitle: '动力系统检查',
          title: '（1）动力源为蓄电池的叉车，蓄电池金属盖或者非金属盖的金属部件与蓄电池带电部分之间应当有30mm以上的间隙；若盖板和带电部分被有效绝缘，则其间隙至少有10mm',
          key: 15,
          dataResult: true
        },
        {
          parentTitle: '动力系统检查',
          title: '（2）由于意外的关闭会造成伤害的，应当在罩壳处（如牵引蓄电池或者发动机罩）设置防止意外关闭的装置，并且永久地固定在车辆上或者安装在车辆的安全处',
          key: 16,
          dataResult: true
        },
        {
          parentTitle: '动力系统检查',
          title: '（3）发动机（行走电机）应当运转平稳，无异响，能正常启动、熄火（关闭）',
          key: 17,
          dataResult: true
        },
        {
          parentTitle: '动力系统检查',
          title: '（4）动力系统线路应当无漏电现象，管路应当无漏水、漏油现象',
          key: 18,
          dataResult: true
        },
        {
          parentTitle: '动力系统检查',
          title: '（5）发动机（行走电机）的安装应当牢固可靠，连接部分无松动、脱落、损坏',
          key: 19,
          dataResult: true
        },
        {
          parentTitle: '动力系统检查',
          title: '（6）车辆配置车用气瓶时，气瓶应当在检验有效期内',
          key: 20,
          dataResult: true
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
        },
        {
          title: '检查项目',
          dataIndex: 'parentTitle',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            if (index === 0) {
              obj.attrs.rowSpan = 4;
            } else if (index === 4) {
              obj.attrs.rowSpan = 1;
            } else if (index === 5) {
              obj.attrs.rowSpan = 5;
            } else if (index === 10) {
              obj.attrs.rowSpan = 2;
            } else if (index === 12) {
              obj.attrs.rowSpan = 2;
            } else if (index === 14) {
              obj.attrs.rowSpan = 6;
            } else {
              obj.attrs.rowSpan = 0;
            }
            return obj;
          },
        },
        {
          title: '检查内容及要求',
          dataIndex: 'title',
        },
        {
          title: '检查结果',
          dataIndex: '检查结果',
        },
      ],
      iFrom: {
        dutyId: '',
        fireAlarmList: [],
        roomFireFightingList: [],
        fireEngineCheckList: [],
      },
      dutyId: undefined,
      formModelFireData: {},
      fireType: '',
      inspectionRecordModelShowFire: false,
    };
  },
  computed: {
    // 当前页面是否为查看
    isShowPage() {
      return Boolean(this.$route.meta.isShowPage)
    },
  },
  methods: {
    // 查询
    daySearch() {},
    // 重置
    dayRest: debounce(function () {}, 250, { leading: true, trailing: false }),
    dayNew() {},
    handleDayPdf() {},
    handleCheckDay() {},
    goBack() {
      this.$router.go(-1);
    },


    onChange(e, path) {
      let _this = this;
      updateDataAuth({
        resourceCode: path,
        authType: e.target.value
      }).then(res => {
        this.$antMessage.success("修改成功");
        this.$antConfirm({
          title: '重新登录后生效，是否重新登录?',
          onOk() {
            reLogin(() => {
              _this.$router.push("/login");
            });
          }
        });
      }).catch(err => {
        for (let i = 0; i < this.menuList.length; i++) {
          if (this.menuList[i].path == path) {
            this.menuList[i].checkedValues = this.menuList[i].checkedValues == 0 ? 1 : 0;
          }
        }
      }) 
    },
    openFireModel(row) {
      console.log(row, '?')
      this.fireType = row.fireTimeStamp ? '编辑' : '新增';
      this.formModelFireData = row.fireTimeStamp ? row : {};
      this.inspectionRecordModelShowFire = true;
    },
    openInspectionRecordModelFire(row) {
      this.iFrom.fireAlarmList.push(row)
    },
    editInspectionRecordItemFire(row) {
      let currentIndex;
      this.iFrom.fireAlarmList.forEach((item, index)=>{
        row.fireTimeStamp == item.fireTimeStamp && (currentIndex = index);
      })
      Object.assign(this.iFrom.fireAlarmList[currentIndex], row)
    },
    submitConfirm() {
      console.log(this.menuList);
    },
  },
};
</script>

<style lang="less" scoped>
.download {
  padding: 20px 0;
}
.baseInfo {
  padding: 30px 0;
  .bottom {
    margin-top: 30px;
  }
}
</style>