<template>
  <div class="flue-gas-monitoring clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>安全月报管理汇总</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="日期方式选择">
          <a-select placeholder="请选择" :default-value="'1'" v-model="currentDateType" @change="changeDataType">
            <a-select-option v-for="item in dateType" :key="item.key" :value="item.key" :title="item.name">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="日期选择" v-if="currentDateType == '1' || currentDateType == '4'">
          <a-month-picker @change="changeMonth" valueFormat="YYYY-MM" format="YYYY-MM" v-model="reportDate" v-if="currentDateType == '1'">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-month-picker>
          <a-date-picker v-else mode="year" valueFormat="YYYY" format="YYYY" v-model="yearMode" :open="yearShowOne" @openChange="openChangeOne" @panelChange="panelChangeOne" />
        </a-form-model-item>
        <a-form-model-item label="日期选择" v-if="currentDateType == '2'">
          <a-date-picker mode="year" valueFormat="YYYY" format="YYYY" v-model="yearMode" :open="yearShowOne" @openChange="openChangeOne" @panelChange="panelChangeOne" />
        </a-form-model-item>
        <a-form-model-item label="季度" v-if="currentDateType == '2'">
          <a-select placeholder="请选择" :default-value="'1'" v-model="currentSeasonType" @change="changeSeasonType">
            <a-select-option v-for="item in dateTypeNextFst" :key="item.key" :value="item.key" :title="item.name">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="日期选择" v-if="currentDateType == '3'">
          <a-date-picker mode="year" valueFormat="YYYY" format="YYYY" v-model="yearMode" :open="yearShowOne" @openChange="openChangeOne" @panelChange="panelChangeOne" />
        </a-form-model-item>
        <a-form-model-item label="半年度" v-if="currentDateType == '3'">
          <a-select placeholder="请选择" :default-value="'1'" v-model="currentHalfType" @change="changeHalfType">
            <a-select-option v-for="item in dateTypeNextSnd" :key="item.key" :value="item.key" :title="item.name">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <!-- <a-button type="primary" :loading="loading" @click="iPreview">预览</a-button>
          <a-button type="primary" :loading="loading" @click="iEditRecord">修改记录</a-button> -->
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div>
      <a-tabs :default-active-key="activeKey" @change="changeTabs" :forceRender="true" :tabBarGutter="1">
        <a-tab-pane key="0" tab="事故事件">
          <fstPage ref="fstPage" :searchData="searchData" v-if="activeKey == 0" />
        </a-tab-pane>
        <a-tab-pane key="1" tab="隐患总结分析">
          <sndPage ref="sndPage" :searchData="searchData" v-if="activeKey == 1" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="报警数据分析">
          <trdPage ref="trdPage" :searchData="searchData" v-if="activeKey == 2" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="特种设备检测分析">
          <forPage ref="forPage" :searchData="searchData" v-if="activeKey == 3" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="应急演练分析">
          <fivPage ref="fivPage" :searchData="searchData" v-if="activeKey == 4" />
        </a-tab-pane>
        <a-tab-pane key="5" tab="设备安全连锁抽查">
          <sixPage ref="sixPage" :searchData="searchData" v-if="activeKey == 5" />
        </a-tab-pane>
        <a-tab-pane key="6" tab="外协厂商培训">
          <svnPage ref="svnPage" :searchData="searchData" v-if="activeKey == 6" />
        </a-tab-pane>
        <a-tab-pane key="7" tab="EHS培训报告">
          <ehtPage ref="ehtPage" :searchData="searchData" v-if="activeKey == 7" />
        </a-tab-pane>
        <a-tab-pane key="8" tab="应知应会抽查">
          <ninPage ref="ninPage" :searchData="searchData" v-if="activeKey == 8" />
        </a-tab-pane>
        <a-tab-pane key="9" tab="危险作业分析">
          <tenPage ref="tenPage" :searchData="searchData" v-if="activeKey == 9" />
        </a-tab-pane>
        <a-tab-pane key="10" tab="设备安全认证">
          <elePage ref="elePage" :searchData="searchData" v-if="activeKey == 10" />
        </a-tab-pane>
        <a-tab-pane key="11" tab="职业健康体检">
          <twvPage ref="twvPage" :searchData="searchData" v-if="activeKey == 11" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <CommonModal class="preview-modal" :title="'预览'" :visible="previewVisible" :cancelFn="editCancle">
      <template slot="form">
        <safePreview :searchData="searchData" :importType="'main'" />
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
      </template>
    </CommonModal>
    <CommonModal :title="'修改记录'" :visible="changeVisible" :cancelFn="changeCancle">
      <a-table bordered :columns="columnsDetails" :scroll="{ y: 240 }" :data-source="accidentEventDetailVo" rowKey="id" :pagination="false">
        <!-- <template slot="title">修改记录</template> -->
        <!-- <span slot="showSite" slot-scope="text, record">{{corporationList.find(item=>{ return record.corporationId == item.corporationId }).orgAbbrName || record.corporationId}}</span>
        <span slot="eventType" slot-scope="text, record">{{eventTypeOptions.find(item=>{ return record.eventType == item.dictValue }).dictLabel || record.eventType}}</span>-->
      </a-table>
    </CommonModal>
  </div>
</template>

<script>
// 预览
import safePreview from '../safePreview'
import fstPage from './childPage/1fstPage'
import sndPage from './childPage/2sndPage'
import trdPage from './childPage/3trdPage'
import forPage from './childPage/4forPage'
import fivPage from './childPage/5fivPage'
import sixPage from './childPage/6sixPage'
import svnPage from './childPage/7svnPage'
import ehtPage from './childPage/8ehtPage'
import ninPage from './childPage/9ninPage'
import tenPage from './childPage/10tenPage'
import elePage from './childPage/11elePage'
import twvPage from './childPage/12twvPage'
import moment from 'moment'
import { headSelect } from '@/services/safeMonth'
// 预览
export default {
  components: {
    safePreview, fstPage, sndPage, trdPage, forPage, fivPage, sixPage, svnPage, ehtPage, ninPage, tenPage, elePage, twvPage
  },
  data() {
    return {
      dateType: [
        { name: '月度', key: '1' },
        { name: '季度', key: '2' },
        { name: '半年度', key: '3' },
        { name: '年度', key: '4' },
      ],
      dateTypeNextFst: [
        { name: '第一季度', key: '1' },
        { name: '第二季度', key: '2' },
        { name: '第三季度', key: '3' },
        { name: '第四季度', key: '4' },
      ],
      dateTypeNextSnd: [
        { name: '上半年', key: '1' },
        { name: '下半年', key: '2' },
      ],
      columnsDetails: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 80,
          align: 'center',
          customRender: (text, row, index) => {
            return index + 1
          },
        },
        {
          title: '所属组织',
          dataIndex: 'corporationId',
          width: 200,
          align: 'center'
        },
        {
          title: '操作人',
          dataIndex: 'createUserId',
          width: 150,
          align: 'center'
        },
        {
          title: '修改模块',
          dataIndex: 'model',
          width: 200,
          align: 'center'
        },
        {
          title: '修改内容',
          dataIndex: 'content',
          width: 200,
          align: 'center'
        },
        {
          title: '修改时间',
          dataIndex: 'createTime',
          width: 180,
          align: 'center'
        },
      ],
      accidentEventDetailVo: [],
      currentDateType: '1',
      currentSeasonType: '1',
      currentHalfType: '1',
      currentDate: {},
      formInline: {},
      loading: false,
      activeKey: '0',
      previewVisible: false,
      changeVisible: false,
      //年度计划的打开关闭状态，true为打开，false为关闭
      yearShowOne: false,
      //添加对话框的表单绑定
      yearMode: moment(new Date()).format('YYYY'),
      searchData: {
        dataType: '1',
        reportDate: moment(new Date()).format('YYYY-MM'),
      },
      reportDate: moment(new Date()).format('YYYY-MM'),
    }
  },
  created() {
    this.setRouterCode('safeBranchMain')
  },
  methods: {
    // 查询
    iSearch() {
      this.searchData.dataType = this.currentDateType;
      // 时间类型 1月度 2 季度 3半年度 4 年度	
      if (this.currentDateType == '1') {
        this.searchData.reportDate = this.reportDate;
      } else if (this.currentDateType == '2') {
        this.searchData.reportDate = this.currentSeasonType;
        this.searchData.year = this.yearMode;
      } else if (this.currentDateType == '3') {
        this.searchData.reportDate = this.currentHalfType;
        this.searchData.year = this.yearMode;
      } else if (this.currentDateType == '4') {
        this.searchData.reportDate = this.yearMode;
      }
      let tabList = ['fstPage', 'sndPage', 'trdPage', 'forPage', 'fivPage', 'sixPage', 'svnPage', 'ehtPage', 'ninPage', 'tenPage', 'elePage', 'twvPage'], chooseTab = '';
      chooseTab = tabList[this.activeKey - 0];
      this.$refs[chooseTab].searchTable();
    },
    // 预览
    iPreview() {
      this.previewVisible = true;
    },
    editCancle() {
      this.previewVisible = false;
    },
    // 修改记录
    async iEditRecord() {
      const { data } = await headSelect({});
      this.accidentEventDetailVo = data;
      this.changeVisible = true;
    },
    changeCancle() {
      this.changeVisible = false;
    },
    iRest() {
      this.currentDateType = '1';
      this.reportDate = moment(new Date()).format('YYYY-MM');
    },
    changeTabs(value) {
      this.activeKey = value
    },
    changeDataType(value, option) {
      this.currentDateType = value;
    },
    changeSeasonType(value, option) {
      console.log(value)
      this.currentSeasonType = value;
    },
    changeHalfType(value, option) {
      this.currentHalfType = value;
    },
    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      this.yearShowOne = !this.yearShowOne
    },
    changeMonth(value) {
      this.reportDate = value;
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.yearMode = moment(value).format('YYYY');
      this.yearShowOne = !this.yearShowOne
    },
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1366px) and (max-width: 1439px) {
  /deep/ .ant-modal {
    width: 1300px !important;
  }
}
@media screen and (min-width: 1440px) and (max-width: 1919px) {
  /deep/ .ant-modal {
    width: 1400px !important;
  }
}
@media screen and (min-width: 1920px) {
  /deep/ .ant-modal {
    width: 1800px !important;
  }
}
/deep/ .model-content-form {
  padding: 0 30px 0 30px !important;
}
</style>