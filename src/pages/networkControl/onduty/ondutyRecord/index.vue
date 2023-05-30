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
                    <vxe-column field="action" fixed="right" title="操作" width="80" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span v-if="row.status == '4'" class="color-0067cc cursor-pointer" @click="troubleShootingChange(true,row)">编辑</span>
                          <!-- <span class="color-0067cc cursor-pointer" @click="troubleShootingChange(true,row)">编辑</span> -->
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
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">巡检记录</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openInspectionRecordModel">
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
                    :data="inspectionRecordTableList"
                  >
                    <vxe-column field="problemDescription" :min-width="columnMinWidth" title="问题描述"></vxe-column>
                    <vxe-column field="result" :min-width="columnMinWidth" title="处理方法及结果"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="100" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openInspectionRecordModel(row)">编辑</span>
                          <span class="color-ff4d4f cursor-pointer" @click="rmInspectionRecordItem(row,'inspectionRecord')">删除</span>
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
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">事件记录</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openEventRecordModel">
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
                    :data="eventRecordTableList"
                  >
                    <vxe-column field="problemDescription" :min-width="columnMinWidth" title="问题描述"></vxe-column>
                    <vxe-column field="result" :min-width="columnMinWidth" title="处理方法及结果"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="100" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openEventRecordModel(row)">编辑</span>
                          <span class="color-ff4d4f cursor-pointer" @click="rmInspectionRecordItem(row,'eventRecord')">删除</span>
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
                  <PageTitle class="ttile-text" :class="(!isShowPage && systemList.length)?'text-required':''">系统数据</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="systemList" label=" " prop="systemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CustomTable
                  :colList="systemList"
                  :disabled="iFrom.handPickStatus?iFrom.handPickStatus: false"
                  :readOnly="iFrom.handPickStatus"
                  @valueChange="()=>valueChangeCustomTableValidator('systemList')"
                />
              </a-form-model-item>
            </template>

            <template title="消防业务电话记录表">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">消防业务电话记录表</PageTitle>
                  <DashBtn class="ttile-bbtn" v-if="!isShowPage">
                    <div>
                      <a-button type="dashed" @click="openFirePhoneRecordModel">
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
                    :data="firePhoneRecordTableList"
                  >
                    <vxe-column field="telName" :min-width="columnMinWidth" title="来电人姓名"></vxe-column>
                    <vxe-column field="telJobNumber" :min-width="columnMinWidth" title="员工编号"></vxe-column>
                    <vxe-column field="telDept" :min-width="columnMinWidth" title="所属部门"></vxe-column>
                    <vxe-column field="telNum" :min-width="columnMinWidth" title="来电号码"></vxe-column>
                    <vxe-column field="telDate" :min-width="columnMinWidth" title="来电时间"></vxe-column>
                    <vxe-column field="description" :min-width="columnMinWidth" title="主要业务描述"></vxe-column>
                    <vxe-column field="answer" :min-width="columnMinWidth" title="电话接听人"></vxe-column>
                    <vxe-column field="remark" :min-width="columnMinWidth" title="备注"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="100" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openFirePhoneRecordModel(row)">编辑</span>
                          <span class="color-ff4d4f cursor-pointer" @click="rmFirePhoneRecordItem(row)">删除</span>
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
                <template v-if="firePhoneRecord.tableAllList.length > pageSize">
                  <div class="more-btn" v-if="firePhoneRecordTableList.length <= pageSize">
                    <span @click="getMore('firePhoneRecord',true)">
                      更多
                      <a-icon type="double-right" class="more-btn-up" />
                    </span>
                  </div>
                  <div class="more-btn" v-else>
                    <span @click="getMore('firePhoneRecord',false)">
                      <a-icon type="double-right" class="more-btn-down" />收起
                    </span>
                  </div>
                </template>
              </a-form-model-item>
            </template>

            <template title="消防系统CRT每日检测">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle :class="(!isShowPage && fireFightingSystemTableList.length)?'text-required':''">
                    消防系统CRT每日检测
                    <span class="title-tips">（2小时/次，正常√，异常×，并在附录写明原因及处理过程）</span>
                  </PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="fireFightingSystemTableList" label=" " prop="fireFightingSystemTableList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
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
                    <vxe-column field="fire" :formatter="formatterCTR" :min-width="columnMinWidth" title="火警系统"></vxe-column>
                    <vxe-column field="tgms" :formatter="formatterCTR" :min-width="columnMinWidth" title="TGMS系统"></vxe-column>
                    <vxe-column field="vesda" :formatter="formatterCTR" :min-width="columnMinWidth" title="VESDA系统"></vxe-column>
                    <vxe-column field="gas" :formatter="formatterCTR" :min-width="columnMinWidth" title="可燃气探测系统"></vxe-column>
                    <vxe-column field="radio" :formatter="formatterCTR" :min-width="columnMinWidth" title="消防广播系统"></vxe-column>
                    <vxe-column field="video" :formatter="formatterCTR" :min-width="columnMinWidth" title="视频监控系统"></vxe-column>
                    <vxe-column field="checkPerson" :min-width="columnMinWidth" title="检查人"></vxe-column>
                    <vxe-column field="action" fixed="right" title="操作" width="80" v-if="!isShowPage">
                      <template #default="{ row }">
                        <div class="table-btn-box">
                          <span class="color-0067cc cursor-pointer" @click="fireFightingSystemChange(true,row)">编辑</span>
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

            <template title="物品交接">
              <div>
                <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
                  <PageTitle class="ttile-text">物品交接</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="wupinjiaojie" label=" " prop="wupinjiaojie" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <a-checkbox-group v-model="iFrom.wupinjiaojie" v-if="itemsList.length" disabled>
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
                  <PageTitle class="ttile-text" :class="(!isShowPage && otherList.length)?'text-required':''">其他交接</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="otherList" label=" " prop="otherList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CustomTable
                  :colList="otherList"
                  :disabled="iFrom.handPickStatus?iFrom.handPickStatus: false"
                  :readOnly="iFrom.handPickStatus"
                  @valueChange="()=>valueChangeCustomTableValidator('otherList')"
                />
              </a-form-model-item>
              <div class="other-explain">
                <span class="other-explain-lable">其他交接说明</span>
                <a-textarea v-model="iFrom.remark" :read-only="iFrom.handPickStatus" />
              </div>
            </template>

            <a-form-model-item ref="agreement" label=" " prop="agreement" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
              <div class="responsibility">
                <div>
                  <a-radio class="responsibility-radio" :disabled="!iFrom.handPickStatus" :checked="iFrom.handConfirm">我确认有关事项已与接班人员进行了详细的沟通，未完成的工作已交接清楚</a-radio>
                </div>
                <div>
                  <a-radio class="responsibility-radio" :disabled="!iFrom.handPickStatus" :checked="iFrom.pickConfirm">我确认交班人员已将所有事项交待清楚，余下的工作将由我完全负责</a-radio>
                </div>
              </div>
            </a-form-model-item>
            <!-- handPickStatus true已交接  false未交接 -->
            <template title="确认交接班" v-if="isShowPage && iFrom.handPickStatus">
              <a-form-model-item ref="handSealList" label=" " prop="handSealList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <div class="other-explain">
                  <span class="other-explain-lable text-required">确认交接班 (手签章)</span>
                  <img class="main-header-top-right-img" v-for="item in handSealList" :key="item.id" :src="item.filePath" @click="handlePreview(item.filePath)" />
                </div>
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
    <!-- 故障维修记录 -->
    <TroubleShootingModel v-model="troubleShootingModelShow" :formModelOldData="formModelOldData" :dutyId="dutyId" @troubleShootingChange="troubleShootingChange" />
    <!-- 巡检记录 -->
    <!-- <InspectionRecordModel
      v-model="inspectionRecordModelShow"
      :formModelOldData="formModelOldData"
      :moduleList="inspectionRecord.tableAllList"
      :dutyId="dutyId"
      @changeModuleList="editInspectionRecordItem"
    /> -->
    <!-- 事件记录 -->
    <EventRecordModel v-model="eventRecordModelShow" :formModelOldData="formModelOldData" :moduleList="eventRecord.tableAllList" :dutyId="dutyId" @changeModuleList="editEventRecordItem" />
    <!-- 消防业务电话记录表 -->
    <FirePhoneRecordModel
      v-model="firePhoneRecordModelShow"
      :formModelOldData="formModelOldData"
      :moduleList="firePhoneRecord.tableAllList"
      :dutyId="dutyId"
      @changeModuleList="editFirePhoneRecordItem"
    />
    <!-- 消防系统CRT每日检测 -->
    <FireFightingSystemModel v-model="fireFightingSystemModelShow" :formModelOldData="formModelOldData" :dutyId="dutyId" @fireFightingSystemChange="fireFightingSystemChange" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { getOndutyRecordDetailApi, editOndutyRecordApi, getInspectionRecordListApi, rmInspectionRecordApi, getOndutyAlarmRecordApi, getOndutyTroubleShootingApi, getOndutyTestRecordApi, rmFirePhoneRecordItemApi, getFirePhoneRecordListApi, } from '@/services/networkControl/onduty.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import deptAndUser from '@/pages/dangerWorkStatic/mixin/deptAndUser.js'
import CustomTable from '../comp/customTable.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import TroubleShootingModel from './comp/troubleShootingModel.vue'
import InspectionRecordModel from './comp/inspectionRecordModel.vue'
import EventRecordModel from './comp/eventRecordModel.vue'
import FireFightingSystemModel from './comp/fireFightingSystemModel.vue'
import FirePhoneRecordModel from './comp/firePhoneRecordModel.vue'
import { getDictConfigData } from "@/utils/dictionary.js";
import dictionary from "@/utils/dictionary.js";
import dayJs from "dayjs";
import ondutyMixin from '@/pages/networkControl/onduty/mixin/ondutyMixin.js'
export default {
  components: { FixedBottom, CustomTable, TroubleShootingModel, InspectionRecordModel, EventRecordModel, FireFightingSystemModel, FirePhoneRecordModel },
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
      iFrom: {},
      iRules: {
        systemList: [{ required: true, validator: this.customTableValidator, trigger: "change", targetName: 'systemList', text: '系统数据' },],
        fireFightingSystemTableList: [{ required: true, validator: this.customTableValidator, trigger: "change", targetName: 'fireFightingSystemTableList', text: '消防系统CRT每日检测', targetAttr: 'fire', },],
        otherList: [{ required: true, validator: this.customTableValidator, trigger: "change", targetName: 'otherList', text: '其他交接' },],
      },
      showPrintPdfBtn: true,
      // 主键
      dutyId: undefined,
      formModelOldData: {},
      handSealList: [],
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
        // this.getInspectionRecordListFn(null, null, true),
        // this.getFirePhoneRecordListFn(),
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

            //  匹配字典项-系统数据、物品交接、其他交接
            this.systemList = cloneDeep(this.matchDictConfigListHasValueFn(iFrom.systemList, 'system'))
            this.itemsList = cloneDeep(this.matchDictConfigListHasValueFn(iFrom.itemsList, 'items'))
            this.otherList = cloneDeep(this.matchDictConfigListHasValueFn(iFrom.otherList, 'other'))
            return iFrom
          } else {
            console.log('详情数据返回异常');
            return Promise.reject()
          }
        })
        .then(detailRes => {
          return Promise.all([
            // this.getAlarmRecord(detailRes),
            this.getTroubleShooting(detailRes),
            this.getTestRecord(detailRes),
          ])
        })
        .catch(err => {
          return Promise.reject()
        })
    },
    // 获取报警记录
    getAlarmRecord(detailRes) {
      let apiData = {
        centerId: detailRes.centerId,
        corporationId: detailRes.corporationId,
      }
      return getOndutyAlarmRecordApi(apiData)
        .then(res => {
          let tableAllList = res.data || []
          tableAllList.forEach(item => {
            // 设备类型
            item.equipTypeText = dictionary('equipType', item.equipType)
            // 状态
            item.statusText = dictionary('closeStatus', item.status)
            // 报警原因类型
            item.reasonTypeText = this.getChemicalDictText('alarm_reason_type', item.reasonType)
          })
          this.alarmRecord.tableAllList = cloneDeep(tableAllList)
        })
        .catch(err => { })
    },
    // 获取故障维修记录
    // getTroubleShooting(detailRes) {
    //   let apiData = {
    //     centerId: detailRes.centerId,
    //     corporationId: detailRes.corporationId,
    //   }
    //   return getOndutyTroubleShootingApi(apiData)
    //     .then(res => {
    //       let tableAllList = res.data || []
    //       tableAllList.forEach(item => {
    //         // 设备类型
    //         item.equipTypeText = dictionary('equipType', item.equipType)
    //         // 状态
    //         item.statusText = dictionary('faultStatus', item.status)
    //         // 报警原因类型
    //         item.reasonTypeText = this.getChemicalDictText('alarm_reason_type', item.reasonType)
    //       })
    //       this.troubleShooting.tableAllList = cloneDeep(tableAllList)
    //     })
    //     .catch(err => { })
    // },
    // 获取测试记录
    // getTestRecord(detailRes) {
    //   let apiData = {
    //     centerId: detailRes.centerId,
    //     corporationId: detailRes.corporationId,
    //   }
    //   return getOndutyTestRecordApi(apiData)
    //     .then(res => {
    //       let tableAllList = res.data || []
    //       tableAllList.forEach(item => {
    //         // 预警类型 1-火灾；-2-特气
    //         item.typeText = item.type == '1' ? '火灾' : '特气'
    //         // 状态
    //         item.statusText = dictionary('alarmStatus', item.status)
    //       })
    //       this.testRecord.tableAllList = cloneDeep(tableAllList)
    //     })
    //     .catch(err => { })
    // },
    // 过滤内容
    filterValue(tarInfo) {
      if (tarInfo) {
        let str = Array.isArray(tarInfo) ? tarInfo.toString() : tarInfo
        return str
      } else {
        return ''
      }
    },
    // 匹配字典项-系统数据、物品交接、其他交接
    matchDictConfigListHasValueFn(keysObjArr, dictKey) {
      let matchDictConfigList = Array.isArray(getDictConfigData(dictKey)) ? getDictConfigData(dictKey) : []
      // console.log(matchDictConfigList, keysObjArr, dictKey);
      let newArr = [];
      (keysObjArr || []).forEach(item => {
        let targetObj = matchDictConfigList.find(item1 => item1.randomKey == item.key)
        if (targetObj) {
          newArr.push({ ...targetObj, ...item })
        }
      })
      // console.log(newArr);
      return newArr
    },
    // 巡检记录--添加一行
    // openInspectionRecordModel(row) {
    //   this.formModelOldData = row ? row : {}
    //   this.inspectionRecordModelShow = true;
    // },
    // // 巡检记录--修改表格某一行
    // editInspectionRecordItem(row) {
    //   this.inspectionRecord.tableAllList = row
    // },
    // // 巡检记录--删除表格某一行
    // rmInspectionRecordItem(row, attrName) {
    //   console.log(row);
    //   this.$antConfirm({
    //     title: "确定删除吗?",
    //     onOk: () => {
    //       return rmInspectionRecordApi({ historyId: row.historyId })
    //         .then(async (res) => {
    //           await this.getInspectionRecordListFn(row.type, attrName)
    //           this.$antMessage.success('删除成功');
    //         })
    //         .catch(err => { });
    //     },
    //   });
    // },
    // 获取巡检记录、事件记录列表
    // getInspectionRecordListFn(type, attrName, getAll = false) {
    //   // console.log('获取巡检记录、事件记录列表', type, attrName);
    //   let apiData = {
    //     dutyId: this.dutyId,
    //     type: getAll ? undefined : type,
    //   };
    //   return getInspectionRecordListApi(apiData)
    //     .then((res) => {
    //       if (getAll) {
    //         this.inspectionRecord.tableAllList = (res.data || []).filter(item => item.type == '1')
    //         this.eventRecord.tableAllList = (res.data || []).filter(item => item.type == '2')
    //       } else {
    //         this[attrName].tableAllList = res.data || [];
    //       }
    //     })
    //     .catch(err => { })
    // },
    // 事件记录--巡检记录--添加一行
    openEventRecordModel(row) {
      this.formModelOldData = row ? row : {}
      this.eventRecordModelShow = true;
    },
    // 事件记录--巡检记录--修改表格某一行
    editEventRecordItem(row) {
      this.eventRecord.tableAllList = row
    },

    // 消防业务电话记录表--添加一行
    openFirePhoneRecordModel(row) {
      this.formModelOldData = row ? row : {}
      this.firePhoneRecordModelShow = true;
    },
    // 消防业务电话记录表--修改表格某一行
    editFirePhoneRecordItem(row) {
      this.firePhoneRecord.tableAllList = row
    },
    // 消防业务电话记录表--删除表格某一行
    rmFirePhoneRecordItem(row) {
      console.log(row);
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmFirePhoneRecordItemApi({ telId: row.telId })
            .then(async (res) => {
              await this.getFirePhoneRecordListFn()
              this.$antMessage.success('删除成功');
            })
            .catch(err => { });
        },
      });
    },
    // 消防业务电话记录表列表
    getFirePhoneRecordListFn() {
      let apiData = {
        dutyId: this.dutyId,
      };
      return getFirePhoneRecordListApi(apiData)
        .then((res) => {
          this.firePhoneRecord.tableAllList = res.data || [];
        })
        .catch(err => { })
    },

    // 故障维修记录--编辑
    troubleShootingChange(isOpen, row) {
      // console.log(isOpen, row);
      if (isOpen) {
        this.formModelOldData = row
        this.troubleShootingModelShow = true
      } else {
        // 修改
        let index = this.troubleShooting.tableAllList.findIndex(item => item.equipFireId == this.formModelOldData.equipFireId)
        this.troubleShooting.tableAllList.splice(index, 1, { ...row })
      }
    },
    // 消防系统CRT每日检测--编辑
    fireFightingSystemChange(isOpen, row) {
      // console.log(isOpen, row);
      if (isOpen) {
        this.formModelOldData = row
        this.fireFightingSystemModelShow = true
      } else {
        // 修改
        let index = this.fireFightingSystem.tableAllList.findIndex(item => item.guid == this.formModelOldData.guid)
        this.fireFightingSystem.tableAllList.splice(index, 1, { ...row })
        formValidator.formItemValidate(this, 'fireFightingSystemTableList', 'ruleForm')
      }
    },
    // 消防系统CRT每日检测--格式化
    formatterCTR({ cellValue }) {
      return cellValue ? (cellValue == 1 ? '√' : '×') : ''
    },
    // 系统数据、其他交接--内容修改时
    valueChangeCustomTableValidator(targetName) {
      formValidator.formItemValidate(this, targetName, 'ruleForm')
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
    // 获取各列表api
    getMoreFn(listName, isAll) {
      let apiData = {
        isAll,
      }
      let apiName = undefined
      switch (listName) {
        case 'alarmRecord':
          apiName = getAlarmRecordApi
          break;
        case 'troubleShooting':
          apiName = getTroubleShootingApi
          break;
        case 'testRecord':
          apiName = getTestRecordApi
          break;
        case 'inspectionRecord':
          apiName = getInspectionRecordApi
          break;
        case 'eventRecord':
          apiName = getEventRecordApi
          break;
        case 'fireFightingSystem':
          apiName = getFireFightingSystemApi
          break;
        case 'firePhoneRecord':
          apiName = getFirePhoneRecordApi
          break;
        default:

      }
      return
      return apiName(apiData)
        .then(res => {
          this[listName] = res.data || []
          this[`${listName}HasMore`] = false
        })
        .catch(err => { })
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
      // console.log(this.iFrom);
      if (!this.formValidate()) {
        return
      }
      let apiData = {
        dutyId: this.dutyId,
        remark: this.iFrom.remark,
        systemList: this.systemList,
        itemsList: this.itemsList,
        otherList: this.otherList,
        crtList: this.fireFightingSystem.tableAllList,
      }
      this.handleLoading();
      Promise.all([editOndutyRecordApi(apiData)])
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
    // 图片预览
    handlePreview(url) {
      this.$hevueImgPreview(url);
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