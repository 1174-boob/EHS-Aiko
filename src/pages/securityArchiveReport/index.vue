<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div>
      <a-radio-group style="margin-bottom: 15px; margin-top: 15px;" @change="onChange" default-value="a" size="large" button-style="solid">
        <a-radio-button value="a">汇总</a-radio-button>
        <a-radio-button value="b">职业危害告知书</a-radio-button>
        <a-radio-button value="c">安全责任书</a-radio-button>
        <a-radio-button value="d">三级安全教育</a-radio-button>
        <a-radio-button value="e">培训数据</a-radio-button>
        <a-radio-button value="f">证书</a-radio-button>
      </a-radio-group>
    </div>

    <div v-show="tabValue == 'a'">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineA" :colon="false">
          <CommonSearchItem ref="commonSearchItemA" :CommonFormInline="formInlineA" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
          <a-form-model-item label="签署日期">
            <a-range-picker format="YYYY-MM-DD" v-model="formInlineA.validityPeriod" :placeholder="['开始日期','结束日期']"/>
          </a-form-model-item>
          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearchA">查询</a-button>
            <a-button @click="iRestA">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <h4 class="pe-data-title">{{peDateA}}签署结果</h4>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-overflow
        align="center"
        :data="dataSourceA"
        show-header-overflow
      >
        <vxe-column field="deptId" :min-width="120" title="类型">
          <template #default="{ row }">
            <span v-if="row.type == 'security_occupational_hazard_notification'">{{"职业危害告知书"}}</span>
            <span v-else-if="row.type == 'safety_responsibility_statement'">{{"安全责任书"}}</span>
            <span v-else-if="row.type == 'three_level_safety_education'">{{"三级安全教育"}}</span>
            <span v-else>{{"--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="total" title="应签署">
          <template #default="{ row }">
            <span>{{ row.total ? row.total : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signingComplete" title="签署完成">
          <template #default="{ row }">
            <span>{{ row.signingComplete ? row.signingComplete : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signed" title="签署进行中">
          <template #default="{ row }">
            <span>{{ row.signed ? row.signed : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="toBeSigned" title="未签署">
          <template #default="{ row }">
            <span>{{ row.toBeSigned ? row.toBeSigned : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signPrecent" title="签署完成率">
          <template #default="{ row }">
            <div>
              <span style="display:block;position:absolute;left:40%; z-index:99999;color: black;" v-if="!isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{parseFloat((row.signingComplete / row.total) * 100).toFixed(2)+'%'}}</span>
              <span style="display:block;position:absolute;left:40%; z-index:99999;color: black;" v-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{'0.00%'}}</span>
              <a-progress style="display:block;" v-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))==1" :percent="100"/>
              <a-progress style="display:block;" v-else-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))"  :show-info="false" :percent='0'/>
              <a-progress style="display:block;" v-else-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))!=1" :show-info="false" :percent="parseFloat(((row.signingComplete / row.total) * 100).toFixed(2))" /> 
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>
    <div v-show="tabValue == 'b'">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineB" :colon="false">
          <CommonSearchItem ref="commonSearchItemB" :CommonFormInline="formInlineB" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
          <a-form-model-item label="签署日期">
            <a-range-picker format="YYYY-MM-DD" v-model="formInlineB.validityPeriod" :placeholder="['开始日期','结束日期']"/>
          </a-form-model-item>
          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearchB">查询</a-button>
            <a-button @click="iRestB">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <h4 class="pe-data-title">{{peDateB}}签署结果</h4>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-overflow
        align="center"
        :data="dataSourceB"
        show-header-overflow
      >
        <vxe-column field="deptId" :min-width="120" title="组织/部门">
          <template #default="{ row }">
            <span v-if="row.corporationId != null">{{matchOrganizeName(row.corporationId)}}</span>
            <span v-else>{{row.deptId ? deptCache[row.deptId] : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="total" title="应签署" :title-help="{message: '应签署=未签署+签署进行中+签署完成', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.total ? row.total : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signingComplete" title="签署完成" :title-help="{message: '在查询时间范围内，已签署完成的数据，即状态为“签署完成”，且签署完成日期处于查询时间范围内的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.signingComplete ? row.signingComplete : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signed" title="签署进行中" :title-help="{message: '在查询时间范围内，已进入签署流程的数据，即状态为“已签署”，且签署记录中的签署时间处于查询时间范围内的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.signed ? row.signed : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="toBeSigned" title="未签署" :title-help="{message: '目前仍未进入签署流程的数据，即状态为“待推送”、“待签署”中的全部数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.toBeSigned ? row.toBeSigned : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signPrecent" title="签署完成率" :title-help="{message: '签署完成率 = 签署完成/应签署 * 100%', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <div>
              <span style="display:block;position:absolute;left:40%; z-index:99999;color: black;" v-if="!isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{parseFloat((row.signingComplete / row.total) * 100).toFixed(2)+'%'}}</span>
              <span style="display:block;position:absolute;left:40%; z-index:99999;color: black;" v-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{'0.00%'}}</span>
              <a-progress style="display:block;" v-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))==1" :percent="100"/>
              <a-progress style="display:block;" v-else-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))"  :show-info="false" :percent='0'/>
              <a-progress style="display:block;" v-else-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))!=1" :show-info="false" :percent="parseFloat(((row.signingComplete / row.total) * 100).toFixed(2))" /> 
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>
    <div v-show="tabValue == 'c'">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineC" :colon="false">
          <CommonSearchItem ref="commonSearchItemC" :CommonFormInline="formInlineC" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
          <a-form-model-item label="签署日期">
            <a-range-picker format="YYYY-MM-DD" v-model="formInlineC.validityPeriod" :placeholder="['开始日期','结束日期']"/>
          </a-form-model-item>
          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearchC">查询</a-button>
            <a-button @click="iRestC">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <h4 class="pe-data-title">{{peDateC}}签署结果</h4>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-overflow
        align="center"
        :data="dataSourceC"
        show-header-overflow
      >
        <vxe-column field="deptId" :min-width="120" title="组织/部门">
          <template #default="{ row }">
            <span v-if="row.corporationId != null">{{matchOrganizeName(row.corporationId)}}</span>
            <span v-else>{{row.deptId ? deptCache[row.deptId] : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="total" title="应签署" :title-help="{message: '应签署=未签署+签署进行中+签署完成', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.total ? row.total : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signingComplete" title="签署完成" :title-help="{message: '在查询时间范围内，已签署完成的数据，即状态为“签署完成”，且签署完成日期处于查询时间范围内的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.signingComplete ? row.signingComplete : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signed" title="签署进行中" :title-help="{message: '在查询时间范围内，已进入签署流程的数据，即状态为“签署中”，且签署记录中的签署时间处于查询时间范围内的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.signed ? row.signed : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="toBeSigned" title="未签署" :title-help="{message: '目前仍未进入签署流程的数据，即状态为“待推送”、“待签署”中的全部数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.toBeSigned ? row.toBeSigned : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signPrecent" title="签署完成率" :title-help="{message: '签署完成率 = 签署完成/应签署 * 100%', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <div>
              <span style="display:block;position:absolute;left:40%; z-index:99999; color: black;" v-if="!isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{parseFloat((row.signingComplete / row.total) * 100).toFixed(2)+'%'}}</span>
              <span style="display:block;position:absolute;left:40%; z-index:99999; color: black;" v-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{'0.00%'}}</span>
              <a-progress style="display:block;" v-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))==1" :percent="100"/>
              <a-progress style="display:block;" v-else-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))"  :show-info="false" :percent='0'/>
              <a-progress style="display:block;" v-else-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))!=1" :show-info="false" :percent="parseFloat(((row.signingComplete / row.total) * 100).toFixed(2))" /> 
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>
    <div v-show="tabValue == 'd'">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineD" :colon="false">
          <CommonSearchItem ref="commonSearchItemD" :CommonFormInline="formInlineD" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
          <a-form-model-item label="签署日期">
            <a-range-picker format="YYYY-MM-DD" v-model="formInlineD.validityPeriod" :placeholder="['开始日期','结束日期']"/>
          </a-form-model-item>
          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearchD">查询</a-button>
            <a-button @click="iRestD">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <h4 class="pe-data-title">{{peDateD}}签署结果</h4>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-overflow
        align="center"
        :data="dataSourceD"
        show-header-overflow
      >
        <vxe-column field="deptId" :min-width="120" title="组织/部门">
          <template #default="{ row }">
            <span v-if="row.corporationId != null">{{matchOrganizeName(row.corporationId)}}</span>
            <span v-else>{{row.deptId ? deptCache[row.deptId] : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column field="total" title="应签署" :title-help="{message: '应签署=未签署+员工已填写成绩但讲师仍未确认纠错成绩+培训通过+培训未通过', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.total ? row.total : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="signingComplete" title="签署完成" :title-help="{message: '在查询时间范围内，已签署完成的数据，即状态为“签署完成”，且签署完成日期处于查询时间范围内的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.signingComplete ? row.signingComplete : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="pass" title="培训通过" :title-help="{message: '在查询时间范围内，最新一次培训讲师纠错后的成绩达到80分的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.pass ? row.pass : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="noPass" title="培训未通过" :title-help="{message: '在查询时间范围内，最新一次培训讲师纠错后的成绩未达到80分的数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.noPass ? row.noPass : '--' }}</span>
          </template>
        </vxe-column>      
        <vxe-column field="toBeSigned" title="未签署" :title-help="{message: '目前仍未进入签署流程的数据，即三级安全教育已发起，员工仍未开始填写成绩的全部数据', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <span>{{ row.toBeSigned ? row.toBeSigned : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="rateOfCompletion" title="签署完成率" :title-help="{message: '签署完成率 = 签署完成/应签署 * 100%', icon: 'vxe-icon-question-circle-fill'}">
          <template #default="{ row }">
            <div>
              <span style="display:block;position:absolute;left:40%; z-index:99999; color: black;" v-if="!isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{parseFloat((row.signingComplete / row.total) * 100).toFixed(2)+'%'}}</span>
              <span style="display:block;position:absolute;left:40%; z-index:99999; color: black;" v-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))">{{'0.00%'}}</span>
              <a-progress style="display:block;" v-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))==1" :percent="100"/>
              <a-progress style="display:block;" v-else-if="isNaN(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))"  :show-info="false" :percent='0'/>
              <a-progress style="display:block;" v-else-if="(parseFloat((row.signingComplete / row.total) * 100).toFixed(2))!=1" :show-info="false" :percent="parseFloat(((row.signingComplete / row.total) * 100).toFixed(2))" /> 
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>
    <div v-show="tabValue == 'e'">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineE" :colon="false">
          <CommonSearchItem ref="commonSearchItemE" :CommonFormInline="formInlineE" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
          <a-form-model-item label="培训日期">
            <a-range-picker format="YYYY-MM-DD" v-model="formInlineE.validityPeriod" :placeholder="['开始日期','结束日期']"/>
          </a-form-model-item>
          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearchE">查询</a-button>
            <a-button @click="iRestE">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <h4 class="pe-data-title">{{peDateE}}培训数据</h4>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-overflow
        align="center"
        :data="dataSourceE"
        show-header-overflow
      >
        <vxe-column field="userName" title="讲师">
          <template #default="{ row }">
            <span>{{ row.userName ? row.userName : '--' }}/{{ row.userJobNumber ? row.userJobNumber  : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="total" title="培训总次数">
          <template #default="{ row }">
            <span>{{ row.total ? row.total : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="company" title="公司级">
          <template #default="{ row }">
            <span>{{ row.company ? row.company : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="dept" title="车间(部门)级">
          <template #default="{ row }">
            <span>{{ row.dept ? row.dept : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="group" title="班组级">
          <template #default="{ row }">
            <span>{{ row.group ? row.group : '--' }}</span>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>
    <div v-show="tabValue == 'f'">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineF" :colon="false">
          <CommonSearchItem ref="commonSearchItemF" :CommonFormInline="formInlineF" :hasDepartment="trueOrFalse" deptLabel="所属部门"></CommonSearchItem>
          <a-form-model-item v-if="!trueOrFalse" label="厂商名称">
            <a-input v-model="formInlineF.manufacturerName" placeholder="请输入厂商名称"></a-input>
          </a-form-model-item>
          <a-form-model-item label="签署日期">
            <a-range-picker format="YYYY-MM-DD" v-model="formInlineF.validityPeriod" :placeholder="['开始日期','结束日期']"/>
          </a-form-model-item>
          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" @click="iSearchF">查询</a-button>
            <a-button @click="iRestF">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <h4 class="pe-data-title" style="margin-bottom:0px">{{peDateF}}证书统计</h4>
      <div style="display: flex;justify-content: flex-end; margin-bottom:10px;">
        <a-radio-group :defaultValue="1" @change="onChangeCert">
          <a-radio :value="1">内部人员</a-radio>
          <a-radio :value="2">外部人员</a-radio>
        </a-radio-group>
      </div>
      <vxe-table
        class="vxe-scrollbar beauty-scroll-fireBox"
        border
        show-overflow
        align="center"
        :data="dataSourceF"
        show-header-overflow
      >
        <vxe-column :visible="trueOrFalse" field="deptId" :min-width="120" title="组织/部门">
          <template #default="{ row }">
            <span v-if="row.corporationId != null">{{matchOrganizeName(row.corporationId)}}</span>
            <span v-else>{{row.deptId ? deptCache[row.deptId] : "--"}}</span>
          </template>
        </vxe-column>
        <vxe-column :visible="!trueOrFalse" field="manufacturerName" title="厂商名称">
          <template #default="{ row }">
            <span>{{ row.manufacturerName ? row.manufacturerName : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="total" title="全部证书">
          <template #default="{ row }">
            <span>{{ row.total ? row.total : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="temporary_count" :title='certTime'>
          <template #default="{ row }">
            <span>{{ row.temporary_count ? row.temporary_count : '--' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="overtime_count" title="过期未更新">
          <template #default="{ row }">
            <span>{{ row.overtime_count ? row.overtime_count : '--' }}</span>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>

  </div>
</template>

<script>
import { securityCertificate,hazardNotification,responsibilityStatement,getPushNotifyDetail,educationRecords,reportRecords,reportSummary } from "@/services/api.js"
import moment from 'moment'
import { debounce, cloneDeep } from 'lodash'
export default {
  components: {},
  mixins: [],
  data() {
    return {
      tabValue:'a',
      inOutValue:'1',
      certTimeValue:'',
      certTimeUnit:'',
      certTime:'',
      peDateA: '',
      peDateB: '',
      peDateC: '',
      peDateD: '',
      peDateE: '',
      peDateF: '',
      trueOrFalse:true,
      dataSourceA:[],
      dataSourceB:[],
      dataSourceC:[],
      dataSourceD:[],
      dataSourceE:[],
      dataSourceF:[],
      formInlineA: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
      formInlineB: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
      formInlineC: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
      formInlineD: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
      formInlineE: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
      formInlineF: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
    }
  },
  created() {
    this.getDataListA()
    this.getPeDateA()
    this.getCertDetail()// 获取证书到期时间
  },
  methods: {
    // 切换tab展示
    onChange(e) {
      this.tabValue = e.target.value
      // console.log(`checked = ${e.target.value}`);
      if(this.tabValue == 'a'){
        this.getDataListA()
        this.getPeDateA()
      }else if(this.tabValue == 'b'){
        this.getDataListB()
        this.getPeDateB()
      }else if(this.tabValue == 'c'){
        this.getDataListC()
        this.getPeDateC()
      }else if(this.tabValue == 'd'){
        this.getDataListD()
        this.getPeDateD()
      }else if(this.tabValue == 'e'){
        this.getDataListE()
        this.getPeDateE()
      }else if(this.tabValue == 'f'){
        this.getDataListF()
        this.getPeDateF()
      }
    },
    // 证书-切换内部外部员工
    onChangeCert(e) {
      this.inOutValue = e.target.value
      this.trueOrFalse = !this.trueOrFalse 
      this.formInlineF = {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      }
      this.getDataListF()
    },
    getPeDateA() {
      if (!this.formInlineA.validityPeriod || !this.formInlineA.validityPeriod.length) {
        this.peDateA = new Date().getFullYear() + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + String(new Date().getDate()-1).padStart(2, '0')
      } else {
        let startDay = String(new Date(this.formInlineA.validityPeriod[0]).getDate()).padStart(2, '0')
        let startMonth = new Date(this.formInlineA.validityPeriod[0]).getMonth() + 1
        let startYear = new Date(this.formInlineA.validityPeriod[0]).getFullYear()
        let endDay = String(new Date(this.formInlineA.validityPeriod[1]).getDate()).padStart(2, '0')
        let endMonth = new Date(this.formInlineA.validityPeriod[1]).getMonth() + 1
        let endYear = new Date(this.formInlineA.validityPeriod[1]).getFullYear()
        this.peDateA = startYear + '.' + startMonth + '.' +startDay + ' - ' + endYear + '.' + endMonth + '.' + endDay 
      }
    },
    getPeDateB() {
      if (!this.formInlineB.validityPeriod || !this.formInlineB.validityPeriod.length) {
        this.peDateB = new Date().getFullYear() + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + String(new Date().getDate()-1).padStart(2, '0')
      } else {
        let startDay = String(new Date(this.formInlineB.validityPeriod[0]).getDate()).padStart(2, '0')
        let startMonth = new Date(this.formInlineB.validityPeriod[0]).getMonth() + 1
        let startYear = new Date(this.formInlineB.validityPeriod[0]).getFullYear()
        let endDay = String(new Date(this.formInlineB.validityPeriod[1]).getDate()).padStart(2, '0')
        let endMonth = new Date(this.formInlineB.validityPeriod[1]).getMonth() + 1
        let endYear = new Date(this.formInlineB.validityPeriod[1]).getFullYear()
        this.peDateB = startYear + '.' + startMonth + '.' +startDay + ' - ' + endYear + '.' + endMonth + '.' + endDay 
      }
    },
    getPeDateC() {
      if (!this.formInlineC.validityPeriod || !this.formInlineC.validityPeriod.length) {
        this.peDateC = new Date().getFullYear() + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + String(new Date().getDate()-1).padStart(2, '0')
      } else {
        let startDay = String(new Date(this.formInlineC.validityPeriod[0]).getDate()).padStart(2, '0')
        let startMonth = new Date(this.formInlineC.validityPeriod[0]).getMonth() + 1
        let startYear = new Date(this.formInlineC.validityPeriod[0]).getFullYear()
        let endDay = String(new Date(this.formInlineC.validityPeriod[1]).getDate()).padStart(2, '0')
        let endMonth = new Date(this.formInlineC.validityPeriod[1]).getMonth() + 1
        let endYear = new Date(this.formInlineC.validityPeriod[1]).getFullYear()
        this.peDateC = startYear + '.' + startMonth + '.' +startDay + ' - ' + endYear + '.' + endMonth + '.' + endDay 
      }
    },
    getPeDateD() {
      if (!this.formInlineD.validityPeriod || !this.formInlineD.validityPeriod.length) {
        this.peDateD = new Date().getFullYear() + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + String(new Date().getDate()-1).padStart(2, '0')
      } else {
        let startDay = String(new Date(this.formInlineD.validityPeriod[0]).getDate()).padStart(2, '0')
        let startMonth = new Date(this.formInlineD.validityPeriod[0]).getMonth() + 1
        let startYear = new Date(this.formInlineD.validityPeriod[0]).getFullYear()
        let endDay = String(new Date(this.formInlineD.validityPeriod[1]).getDate()).padStart(2, '0')
        let endMonth = new Date(this.formInlineD.validityPeriod[1]).getMonth() + 1
        let endYear = new Date(this.formInlineD.validityPeriod[1]).getFullYear()
        this.peDateD = startYear + '.' + startMonth + '.' +startDay + ' - ' + endYear + '.' + endMonth + '.' + endDay 
      }
    },
    getPeDateE() {
      if (!this.formInlineE.validityPeriod || !this.formInlineE.validityPeriod.length) {
        this.peDateE = new Date().getFullYear() + '.' + (new Date().getMonth()).toString().padStart(2, '0')
      } else {
        let startDay = String(new Date(this.formInlineE.validityPeriod[0]).getDate()).padStart(2, '0')
        let startMonth = new Date(this.formInlineE.validityPeriod[0]).getMonth() + 1
        let startYear = new Date(this.formInlineE.validityPeriod[0]).getFullYear()
        let endDay = String(new Date(this.formInlineE.validityPeriod[1]).getDate()).padStart(2, '0')
        let endMonth = new Date(this.formInlineE.validityPeriod[1]).getMonth() + 1
        let endYear = new Date(this.formInlineE.validityPeriod[1]).getFullYear()
        this.peDateE = startYear + '.' + startMonth + '.' +startDay + ' - ' + endYear + '.' + endMonth + '.' + endDay 
      }
    },
    getPeDateF() {
      if (!this.formInlineF.validityPeriod || !this.formInlineF.validityPeriod.length) {
        this.peDateF = new Date().getFullYear() + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + String(new Date().getDate()-1).padStart(2, '0')
      } else {
        let startDay = String(new Date(this.formInlineF.validityPeriod[0]).getDate()).padStart(2, '0')
        let startMonth = new Date(this.formInlineF.validityPeriod[0]).getMonth() + 1
        let startYear = new Date(this.formInlineF.validityPeriod[0]).getFullYear()
        let endDay = String(new Date(this.formInlineF.validityPeriod[1]).getDate()).padStart(2, '0')
        let endMonth = new Date(this.formInlineF.validityPeriod[1]).getMonth() + 1
        let endYear = new Date(this.formInlineF.validityPeriod[1]).getFullYear()
        this.peDateF = startYear + '.' + startMonth + '.' +startDay + ' - ' + endYear + '.' + endMonth + '.' + endDay 
      }
    },
    iSearchA(){
      this.getPeDateA()
      this.getDataListA()
    },
    iSearchB(){
      this.getPeDateB()
      this.getDataListB()
    },
    iSearchC(){
      this.getPeDateC()
      this.getDataListC()
    },
    iSearchD(){
      this.getPeDateD()
      this.getDataListD()
    },
    iSearchE(){
      this.getPeDateE()
      this.getDataListE()
    },
    iSearchF(){
      this.getPeDateF()
      this.getDataListF()
    },
    // 重置
    iRestA: debounce(function () {
      this.$refs.commonSearchItemA.reset()
      this.formInlineA = {
        validityPeriod :[]
      }
      this.getDataListA()
      this.getPeDateA()
    }, 250, { leading: true, trailing: false }),
    // 重置
    iRestB: debounce(function () {
      this.$refs.commonSearchItemB.reset()
      this.formInlineB = {
        validityPeriod :[]
      }
      this.getDataListB()
      this.getPeDateB()
    }, 250, { leading: true, trailing: false }),
    // 重置
    iRestC: debounce(function () {
      this.$refs.commonSearchItemC.reset()
      this.formInlineC = {
        validityPeriod :[]
      }
      this.getDataListC()
      this.getPeDateC()
    }, 250, { leading: true, trailing: false }),
    // 重置
    iRestD: debounce(function () {
      this.$refs.commonSearchItemD.reset()
      this.formInlineD = {
        validityPeriod :[]
      }
      this.getDataListD()
      this.getPeDateD()
    }, 250, { leading: true, trailing: false }),
    // 重置
    iRestE: debounce(function () {
      this.$refs.commonSearchItemE.reset()
      this.formInlineE = {
        validityPeriod :[]
      }
      this.getDataListE()
      this.getPeDateE()
    }, 250, { leading: true, trailing: false }),
    // 重置
    iRestF: debounce(function () {
      this.$refs.commonSearchItemF.reset()
      this.formInlineF = {
        validityPeriod :[]
      }
      this.getDataListF()
      this.getPeDateF()
    }, 250, { leading: true, trailing: false }),
    getDataListA(){
      let validityPeriodStart = this.formInlineA.validityPeriod[0] ? moment(this.formInlineA.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInlineA.validityPeriod[1] ? moment(this.formInlineA.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInlineA,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      if(params.validityPeriod.length == 0){
        params.startTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
        params.endTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
      }
      reportSummary(params).then((res)=>{
        this.dataSourceA = res.data ? res.data : []
      }).catch((err)=>{
        console.log(err);
      })
    },
    getDataListB(){
      let validityPeriodStart = this.formInlineB.validityPeriod[0] ? moment(this.formInlineB.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInlineB.validityPeriod[1] ? moment(this.formInlineB.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInlineB,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      if(params.validityPeriod.length == 0){
        params.startTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
        params.endTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
      }
      hazardNotification(params).then((res)=>{
        this.dataSourceB = res.data ? res.data : []
      }).catch((err)=>{
        console.log(err);
      })
    },
    getDataListC(){
      let validityPeriodStart = this.formInlineC.validityPeriod[0] ? moment(this.formInlineC.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInlineC.validityPeriod[1] ? moment(this.formInlineC.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInlineC,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      if(params.validityPeriod.length == 0){
        params.startTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
        params.endTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
      }
      responsibilityStatement(params).then((res)=>{
        this.dataSourceC = res.data ? res.data : []
      }).catch((err)=>{
        console.log(err);
      })
    },
    getDataListD(){
      let validityPeriodStart = this.formInlineD.validityPeriod[0] ? moment(this.formInlineD.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInlineD.validityPeriod[1] ? moment(this.formInlineD.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInlineD,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      if(params.validityPeriod.length == 0){
        params.startTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
        params.endTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
      }
      reportRecords(params).then((res)=>{
        this.dataSourceD = res.data ? res.data : []
      }).catch((err)=>{
        console.log(err);
      })
    },
    getDataListE(){
      let validityPeriodStart = this.formInlineE.validityPeriod[0] ? moment(this.formInlineE.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInlineE.validityPeriod[1] ? moment(this.formInlineE.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInlineE,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      if(params.validityPeriod.length == 0){
        const today = new Date();
        const lastMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        const month = (today.getMonth()).toString().padStart(2, '0');
        params.startTime = lastMonthFirstDay.getFullYear() + '-' + month + '-' + String(lastMonthFirstDay.getDate()).padStart(2, '0');
        params.endTime = lastMonthLastDay.getFullYear() + '-' + month + '-' + String(lastMonthLastDay.getDate()).padStart(2, '0');
      }
      educationRecords(params).then((res)=>{
        this.dataSourceE = res.data ? res.data : []
      }).catch((err)=>{
        console.log(err);
      })
    },
    getDataListF(){
      let validityPeriodStart = this.formInlineF.validityPeriod[0] ? moment(this.formInlineF.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInlineF.validityPeriod[1] ? moment(this.formInlineF.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInlineF,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      if(params.validityPeriod.length == 0){
        params.startTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
        params.endTime = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()-1).padStart(2, '0')
      }
      params.inOutType = this.inOutValue
      securityCertificate(params).then((res)=>{
        this.dataSourceF = res.data ? res.data : []
      }).catch((err)=>{
        console.log(err);
      })
    },
    // 获取证书详情
    getCertDetail() {
      getPushNotifyDetail({})
      .then(res => {
        let unit = '个'
        this.certTimeValue = res.data.preliminaryStartTimeValue
        if(res.data.preliminaryStartTimeUnit == 'day'){
          this.certTimeUnit = '日'
          unit = ''
        } else if (res.data.preliminaryStartTimeUnit == 'week'){
          this.certTimeUnit = '周'
          unit = ''
        } else if (res.data.preliminaryStartTimeUnit == 'month') {
          this.certTimeUnit = '月'
        }
        this.certTime = '到期前' + this.certTimeValue + unit +  this.certTimeUnit
      })
      .catch(err => {
        console.log(err);
      })
    },
    
  }
}
</script>

<style lang="less" scoped>
.pe-data-title{
  margin-bottom: 30px;
  padding-bottom:20px;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}
::v-deep .ant-progress-outer {
  width: 100%;
  border-radius:0px !important;
}
::v-deep .ant-progress-bg{
  height:24px !important;
  border-radius:0px !important;
}
::v-deep .vxe-header--row .vxe-cell{
  display: flex !important;
  flex-direction: row-reverse !important;
}
</style>