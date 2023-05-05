<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <a-form-model id="pdfDom" ref="ruleForm" :model="iFrom" :colon="false" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
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
                  <!-- <CommonDept
                    ref="corporationId"
                    disabled
                    :CommonFormInline="iFrom"
                    :notTablePage="true"
                    :hasDepartment="true"
                    @corporationDeptChange="corporationDeptChange"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  ></CommonDept>-->
                  <a-form-model-item ref="corporationId" label="所属组织" prop="corporationId">
                    <a-select v-model="iFrom.corporationId" option-filter-prop="children" disabled>
                      <a-select-option v-for="item in []" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="applyDepartCode" label="部门" prop="applyDepartCode">
                    <DeptTree disabled :placeholder="''" v-model="iFrom.applyDepartCode" :deptData="deptData" @change="(val,lab)=> departOrPerpleChange(lab,'applyDepartName')"></DeptTree>
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="zhibanbanci" label="值班班次" prop="zhibanbanci">
                    <a-select v-model="iFrom.zhibanbanci" option-filter-prop="children" disabled>
                      <a-select-option v-for="item in []" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="zhibanriqi" label="值班日期" prop="zhibanriqi">
                    <a-input v-model="iFrom.zhibanriqi" disabled />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="zhibanshiduan" label="值班时段" prop="zhibanshiduan">
                    <a-input v-model="iFrom.zhibanshiduan" disabled />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiaobanren" label="交班人" prop="jiaobanren">
                    <a-textarea v-model="iFrom.jiaobanren" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiaobanzuzhang" label="交班组长" prop="jiaobanzuzhang">
                    <a-textarea v-model="iFrom.jiaobanzuzhang" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiaobanzugongchengshi" label="交班组工程师" prop="jiaobanzugongchengshi">
                    <a-textarea v-model="iFrom.jiaobanzugongchengshi" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiaojiebankezhang" label="交班组科长" prop="jiaojiebankezhang">
                    <a-textarea v-model="iFrom.jiaojiebankezhang" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiebanren" label="接班人" prop="jiebanren">
                    <a-textarea v-model="iFrom.jiebanren" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiebanzuzhang" label="接班组长" prop="jiebanzuzhang">
                    <a-textarea v-model="iFrom.jiebanzuzhang" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiebanzugongchengshi" label="接班组工程师" prop="jiebanzugongchengshi">
                    <a-textarea v-model="iFrom.jiebanzugongchengshi" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiebanzukezhang" label="接班组科长" prop="jiebanzukezhang">
                    <a-textarea v-model="iFrom.jiebanzukezhang" disabled autoSize />
                  </a-form-model-item>
                </a-col>
                <a-col :span="spanCol">
                  <a-form-model-item ref="jiaojiebanshijian" label="交接班时间" prop="jiaojiebanshijian">
                    <a-textarea v-model="iFrom.jiaojiebanshijian" disabled autoSize />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>

            <template title="报警记录">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>报警记录</PageTitle>
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
                    :data="alarmRecordTableList"
                  >
                    <vxe-column title="序号" type="seq" width="60" fixed="left"></vxe-column>
                    <vxe-column field="area" :min-width="columnMinWidth" title="区域/楼号"></vxe-column>
                    <vxe-column field="floor" :min-width="columnMinWidth" title="楼层"></vxe-column>
                    <vxe-column field="location" :min-width="columnMinWidth" title="具体位置"></vxe-column>
                    <vxe-column field="equipTypeText" :min-width="columnMinWidth" title="设备类型"></vxe-column>
                    <vxe-column field="equipCode" :min-width="columnMinWidth" title="设备编号"></vxe-column>
                    <vxe-column field="equipName" :min-width="columnMinWidth" title="设备名称"></vxe-column>
                    <vxe-column field="description" :min-width="columnMinWidth" title="报警描述"></vxe-column>
                    <vxe-column field="alarmTime" :min-width="columnMinWidth" title="报警时间"></vxe-column>
                    <vxe-column field="statusText" :min-width="columnMinWidth" title="状态"></vxe-column>
                    <vxe-column field="reasonTypeText" :min-width="columnMinWidth" title="报警原因类型"></vxe-column>
                    <vxe-column field="closeTime" :min-width="columnMinWidth" title="关闭时间"></vxe-column>
                    <vxe-column field="closePerson" :min-width="columnMinWidth" title="关闭人"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="alarmRecord.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="alarmRecordTableList.length <= pageSize">
                    <span @click="getMore('alarmRecord',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('alarmRecord',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="故障维修记录">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>故障维修记录</PageTitle>
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
                    :data="troubleShootingTableList"
                  >
                    <vxe-column title="序号" type="seq" width="60" fixed="left"></vxe-column>
                    <vxe-column field="createTime" :min-width="columnMinWidth" title="故障时间"></vxe-column>
                    <vxe-column field="area" :min-width="columnMinWidth" title="区域/楼号"></vxe-column>
                    <vxe-column field="floor" :min-width="columnMinWidth" title="楼层"></vxe-column>
                    <vxe-column field="location" :min-width="columnMinWidth" title="具体位置"></vxe-column>
                    <vxe-column field="equipTypeText" :min-width="columnMinWidth" title="设备类型"></vxe-column>
                    <vxe-column field="equipCode" :min-width="columnMinWidth" title="设备编号"></vxe-column>
                    <vxe-column field="equipName" :min-width="columnMinWidth" title="设备名称"></vxe-column>
                    <vxe-column field="statusText" :min-width="columnMinWidth" title="状态"></vxe-column>
                    <vxe-column field="maintenance" :min-width="columnMinWidth" title="故障维修人员"></vxe-column>
                    <vxe-column field="spareParts" :min-width="columnMinWidth" title="所用备件"></vxe-column>
                    <vxe-column field="recoverTime" :min-width="columnMinWidth" title="恢复时间"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="troubleShooting.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="troubleShootingTableList.length <= pageSize">
                    <span @click="getMore('troubleShooting',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('troubleShooting',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="测试记录">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>测试记录</PageTitle>
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
                    :data="testRecordTableList"
                  >
                    <vxe-column title="序号" type="seq" width="60" fixed="left"></vxe-column>
                    <vxe-column field="typeText" :min-width="columnMinWidth" title="预警类型"></vxe-column>
                    <vxe-column field="preAlarmTime" :min-width="columnMinWidth" title="预警时间"></vxe-column>
                    <vxe-column field="description" :min-width="columnMinWidth" title="报警描述"></vxe-column>
                    <vxe-column field="statusText" :min-width="columnMinWidth" title="状态"></vxe-column>
                    <vxe-column field="createUser" :min-width="columnMinWidth" title="创建人"></vxe-column>
                    <vxe-column field="createTime" :min-width="columnMinWidth" title="创建时间"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="testRecord.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="testRecordTableList.length <= pageSize">
                    <span @click="getMore('testRecord',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('testRecord',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="巡检记录">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>巡检记录</PageTitle>
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
                    :data="inspectionRecordTableList"
                  >
                    <vxe-column field="problemDescription" :min-width="columnMinWidth" title="问题描述"></vxe-column>
                    <vxe-column field="result" :min-width="columnMinWidth" title="处理方法及结果"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="inspectionRecord.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="inspectionRecordTableList.length <= pageSize">
                    <span @click="getMore('inspectionRecord',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('inspectionRecord',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="事件记录">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>事件记录</PageTitle>
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
                    :data="eventRecordTableList"
                  >
                    <vxe-column field="problemDescription" :min-width="columnMinWidth" title="问题描述"></vxe-column>
                    <vxe-column field="result" :min-width="columnMinWidth" title="处理方法及结果"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="eventRecord.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="eventRecordTableList.length <= pageSize">
                    <span @click="getMore('eventRecord',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('eventRecord',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="系统数据">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">系统数据</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openAddCasNoModel('system')">
                        <a-icon type="plus" />选择配置
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CustomTable :colList="systemList" />
              </a-form-model-item>
            </template>

            <template title="消防系统CRT每日检测">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>
                    消防系统CRT每日检测
                    <span class="title-tips">（2小时/次，正常√，异常×，并在附录写明原因及处理过程）</span>
                  </PageTitle>
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
                    :data="fireFightingSystemTableList"
                  >
                    <vxe-column field="detectionTime" :min-width="columnMinWidth" title="检测时间"></vxe-column>
                    <vxe-column field="fire" :min-width="columnMinWidth" title="火警系统"></vxe-column>
                    <vxe-column field="tgms" :min-width="columnMinWidth" title="TGMS系统"></vxe-column>
                    <vxe-column field="vesda" :min-width="columnMinWidth" title="VESDA系统"></vxe-column>
                    <vxe-column field="gas" :min-width="columnMinWidth" title="可燃气探测系统"></vxe-column>
                    <vxe-column field="radio" :min-width="columnMinWidth" title="消防广播系统"></vxe-column>
                    <vxe-column field="video" :min-width="columnMinWidth" title="视频监控系统"></vxe-column>
                    <vxe-column field="checkPerson" :min-width="columnMinWidth" title="检查人"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="fireFightingSystem.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="fireFightingSystemTableList.length <= pageSize">
                    <span @click="getMore('fireFightingSystem',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('fireFightingSystem',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="消防业务电话记录表">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>消防业务电话记录表</PageTitle>
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
                    :data="firePhoneRecordTableList"
                  >
                    <vxe-column field="laidianrenxingming8" :min-width="columnMinWidth" title="来电人姓名"></vxe-column>
                    <vxe-column field="yuangongbainhao8" :min-width="columnMinWidth" title="员工编号"></vxe-column>
                    <vxe-column field="suoshubumen8" :min-width="columnMinWidth" title="所属部门"></vxe-column>
                    <vxe-column field="laidianhaoma8" :min-width="columnMinWidth" title="来电号码"></vxe-column>
                    <vxe-column field="laidianshijian8" :min-width="columnMinWidth" title="来电时间"></vxe-column>
                    <vxe-column field="zhuyaoyewuneirong8" :min-width="columnMinWidth" title="主要业务内容"></vxe-column>
                    <vxe-column field="dianhaujietingren8" :min-width="columnMinWidth" title="电话接听人"></vxe-column>
                    <vxe-column field="beizhu8" :min-width="columnMinWidth" title="备注"></vxe-column>
                    <template #empty>
                      <div style="padding:16px 0;">
                        <a-empty />
                      </div>
                    </template>
                  </vxe-table>
                </CommonTable>
                <template v-if="firePhoneRecord.tableAllList.length > pageSize">
                  <div class="more-btn" v-show="showPrintPdfBtn" v-if="firePhoneRecordTableList.length <= pageSize">
                    <span @click="getMore('firePhoneRecord',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-show="showPrintPdfBtn" v-else>
                    <span @click="getMore('firePhoneRecord',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="物品交接">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">物品交接</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openAddCasNoModel('goods')">
                        <a-icon type="plus" />选择配置
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <a-checkbox-group v-if="itemsList.length" disabled>
                  <a-checkbox class="checkbox-item" v-for="item in itemsList" :key="item.dutyId" :value="item.dutyId">{{item.dictValue}}</a-checkbox>
                </a-checkbox-group>
                <div style="padding:16px 0;" v-else>
                  <a-empty />
                </div>
              </a-form-model-item>
            </template>

            <template title="其他交接">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">其他交接</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openAddCasNoModel('other')">
                        <a-icon type="plus" />选择配置
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CustomTable :colList="otherList" />
              </a-form-model-item>
              <div class="other-explain">
                <span class="other-explain-lable">其他交接说明</span>
                <a-textarea read-only />
              </div>
            </template>

            <div class="responsibility">
              <a-radio class="responsibility-radio" disabled>我确认有关事项已与接班人员进行了详细的沟通，未完成的工作已交接清楚</a-radio>
              <a-radio class="responsibility-radio" disabled>我确认交班人员已将所有事项交待清楚，余下的工作将由我完全负责</a-radio>
            </div>
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

    <!-- 配置弹窗 -->
    <AddCasNoModel v-model="addCasNoModelShow" :corporationId="corporationId" :dictConfigKey="dictConfigKey" :selectedRowOld="selectedRowOld" @confirmModle="setConfigColList" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import AddCasNoModel from "../comp/addCasNoModel.vue";
import { addOndutyConfigApi, getOndutyConfigDetailApi } from '@/services/networkControl/onduty.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import deptAndUser from '@/pages/dangerWorkStatic/mixin/deptAndUser.js'
import CustomTable from '../comp/customTable.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { getDictConfigData } from "@/utils/dictionary.js";
import ondutyMixin from '@/pages/networkControl/onduty/mixin/ondutyMixin.js'
export default {
  components: { FixedBottom, AddCasNoModel, CustomTable },
  mixins: [chemicalDict, cancelLoading, deptAndUser, ondutyMixin],
  data() {
    return {
      corporationId: undefined,
      // 配置弹窗
      addCasNoModelShow: false,
      dictConfigKey: undefined,
      selectedRowOld: [],
      configModelType: '',
      systemList: [],
      itemsList: [],
      otherList: [],
      spanCol: 12,
      spinning: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
      iFrom: {},
      iRules: {},
      showPrintPdfBtn: true,
      // 主键
      dutyId: undefined,
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
      Promise.all([this.getPageDetail()])
        .then(resArr => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 获取页面详情
    getPageDetail() {
      let apiData = { dutyId: this.dutyId }
      return getOndutyConfigDetailApi(apiData)
        .then(res => {
          let { systemList, itemsList, otherList, corporationId } = res.data ? res.data : { systemList: [], itemsList: [], otherList: [] }
          this.corporationId = corporationId
          this.systemList = this.matchDictConfigListFn(systemList, 'system')
          this.itemsList = this.matchDictConfigListFn(itemsList, 'items')
          this.otherList = this.matchDictConfigListFn(otherList, 'other')
        })
        .catch(err => { })
    },
    matchDictConfigListFn(keysArr, dictKey) {
      let matchDictConfigList = Array.isArray(getDictConfigData(dictKey)) ? getDictConfigData(dictKey) : []
      matchDictConfigList = matchDictConfigList.filter(item => {
        return keysArr.includes(item.randomKey)
      })
      matchDictConfigList = this.matchOrgnize(matchDictConfigList)
      return matchDictConfigList
    },
    // 选择配置
    setConfigColList(colListData) {
      if (this.configModelType == 'system') {
        this.systemList = cloneDeep(colListData)
      } else if (this.configModelType == 'goods') {
        this.itemsList = cloneDeep(colListData)
      } else if (this.configModelType == 'other') {
        this.otherList = cloneDeep(colListData)
      }
      this.selectedRowOld = colListData
    },
    // 获取当前展示的列表
    tableListFilter(listObj) {
      let { tableAllList, hasMore, isOpen } = listObj
      let tableList = tableAllList
      if (hasMore && !isOpen) {
        tableList = tableAllList.filter((item, index) => index < this.pageSize)
      }
      return tableList
    },
    // 更多、展开-切换
    getMore(listName) {
      this[listName].isOpen = !this[listName].isOpen
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
            scale: 2 // 提升画面质量，但是会增加文件大小
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
              pdf.save(`值班表.pdf`)
            })
            .finally(() => {
              this.showPrintPdfBtn = true
              elLoading.close();
            })
        })
      }, 200);
    },
    // 选择配置
    openAddCasNoModel(type) {
      this.configModelType = type
      setTimeout(() => {
        this.addCasNoModelShow = true
      });
    },
    // 提交api
    iSubmit() {
      // if (!formValidator.formAll(this, "rulesCode")) return;
      let systemList = this.systemList.map(item => item.randomKey)
      let itemsList = this.itemsList.map(item => item.randomKey)
      let otherList = this.otherList.map(item => item.randomKey)
      let apiData = {
        dutyId: this.dutyId,
        systemList,
        itemsList,
        otherList,
      }
      this.handleLoading();
      addOndutyConfigApi(apiData)
        .then(res => {
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/emergencyManagement/networkControl/dutyManagement' })
        })
        .catch(err => { })
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
  watch: {
    configModelType(newVal) {
      if (newVal == 'system') {
        this.dictConfigKey = 'system'
        this.selectedRowOld = this.systemList
      } else if (newVal == 'goods') {
        this.dictConfigKey = 'items'
        this.selectedRowOld = this.itemsList
      } else {
        this.dictConfigKey = 'other'
        this.selectedRowOld = this.otherList
      }
    }
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
    display: flex;
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
// 禁用样式 start-----
::v-deep .ant-checkbox-disabled .ant-checkbox-inner {
  background-color: #fff !important;
  border: 1px solid #d9d9d9 !important;
}
::v-deep .ant-checkbox-disabled + span {
  color: rgba(0, 0, 0, 0.65) !important;
}
::v-deep .ant-radio-disabled .ant-radio-inner {
  border-color: #d9d9d9 !important;
  background-color: #fff !important;
}
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