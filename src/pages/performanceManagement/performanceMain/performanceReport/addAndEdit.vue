<template>
  <HasFixedBottomWrapper>
    <PageTitle>配置绩效填报表</PageTitle>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="selectCorporation" v-if="!corporationId">选择组织</a-button>
        <a-button type="dashed" @click="selectIndex">选择指标</a-button>
      </div>
    </DashBtn>
    <PageTitle>
      组织：
      <template v-if="selectedRowKeys.length">
        <span class="m-r-15" v-for="item in selectedRowKeys">{{getMappingValue(getCommonAddOrgnizeListAll, "id", item).orgAbbrName}}</span>
      </template>
      <template v-else><span class="font-14 color-999">请点击上方”选择组织“按钮选择组织</span></template>
    </PageTitle>
    <div>
      <div class="index-item" v-for="item in bodyIndexData">
        <PageTitle>{{item.projectName}}</PageTitle>
        <PerformanceIndex :flag="true" :configIndex="true" :componentsData="item.indexList" @configIndexDelete="configIndexDelete"></PerformanceIndex>
      </div>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button @click="pageCancle">取消</a-button>
          <a-button type="primary" :loading="btnLoading" @click="pageSubmit">保存</a-button>
        </div>
      </FixedBottom>
    </div>
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
          <!-- 固定指标 -->
          <a-form-model-item class="flex" label="所属项目" prop="projectId">
            <a-select v-model="indexForm.projectId" placeholder="请选择所属项目">
              <a-select-option v-for="item in projectList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <div class="color-0067cc m-b-20">已关联的指标不可重复选择，禁止点击</div>
          <a-form-model-item class="flex" label="" prop="indexList" :wrapper-col="{ style: { width: '100%' } }">
            <PerformanceIndex ref="performanceIndex" :flag="true" @indexSelectChange="indexSelectChange" :projectId="indexForm.projectId" :hasSelectId="hasSelectId"></PerformanceIndex>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="indexCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="indexLoading" @click="indexConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal class="table-modal-large" title="选择组织" :visible="corporationVisible" :cancelFn="corporationCancle">
      <div>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <CommonDept ref="commonDept" :CommonFormInline="formInline" :isAllCorporation="true"></CommonDept>
            <a-form-model-item class="flex" label="配置状态" prop="centerId">
              <a-select v-model="formInline.configStatus" placeholder="请选择配置状态">
                <a-select-option v-for="item in configStatusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <!-- 搜索栏按钮需要加固定的float-right类名 -->
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable>
          <a-table :row-selection="rowSelection" :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="corporationDataList" :rowKey="(record, index)=>{return record.corporationId}" :pagination="false">
            <div slot="centerId" slot-scope="record">
              {{getMappingValue(setCorporationTree, "corporationCode", record.centerId).corporationName}}
            </div>
            <div slot="corporationId" slot-scope="record">
              {{getMappingValue(getCommonAddOrgnizeListAll, "orgId", record.corporationId).orgName}}
            </div>
            <div slot="configStatus" slot-scope="record">
              {{getMappingValue(configStatusList, "key", record.configStatus).value}}
            </div>
          </a-table>
        </CommonTable>
      </div>
      <template slot="btn">
        <a-button @click="corporationCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="indexLoading" @click="corporationConfirm">确定</a-button>
      </template>
    </CommonModal>
  </HasFixedBottomWrapper>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";

import PerformanceIndex from "@/pages/performanceManagement/performanceMain/performanceIndex/index.vue"
import { nanoid } from 'nanoid'
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from 'lodash';

import { organizationSelect, organizationSave, organizationSelectDetail } from "@/services/performanceManagement.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    PerformanceIndex,
    FixedBottom
  },
  data() {
    return {
      btnLoading: false,
      indexLoading: false,
      indexVisible: false,
      projectList: [],
      indexForm: {
        projectId: undefined
      },
      indexFormRules: {
        projectId: [
          { required: true, message: "所属项目不可为空", trigger: "change" },
        ],
        indexList: [
          { required: true, message: "指标不可为空", trigger: "change" },
        ]
      },
      selectIndexList: [], // 当前指标选择的数组
      bodyIndexData: {},
      
      hasSelectId: [], // 所选指标id组合
      corporationVisible: false,
      configStatusList: [
        {
          key: "1",
          value: "未配置"
        },
        {
          key: "2",
          value: "已配置"
        }
      ],
      columns: [
        // {
        //   title: '制造中心',
        //   scopedSlots: { customRender: 'centerId' },
        //   width: 100,
        // },
        {
          title: '组织',
          scopedSlots: { customRender: 'corporationId' },
          width: 100,
        },
        {
          title: '配置状态',
          scopedSlots: { customRender: 'configStatus' },
          width: 100,
        },
      ],
      formInline: {},
      preFormInline: {},
      currentSelectedRowKeys: [],
      selectedRowKeys: [],
      corporationDataList: [],
      corporationId: ""
    }
  },
  created() {
    this.projectList = this.getMappingValue(this.dictTypeData, "dictType", "kpi_project").dictItem;
    for (let i = 0; i < this.projectList.length; i++) {
      this.bodyIndexData[this.projectList[i].dictValue] = {
        projectName: this.projectList[i].dictLabel,
        indexList: [],
      }
    }
    this.bodyIndexData = { ...this.bodyIndexData }
    if (this.$route.query && this.$route.query.configStatus == 2 && this.$route.query.achieveId) { // 已配置 获取详情
      this.getDetail();
    }
    if (this.$route.query && this.$route.query.corporationId) {
      this.corporationId = this.$route.query.corporationId;
      this.selectedRowKeys = [ this.corporationId ];
    }
    console.log(this.selectedRowKeys)

  },
  computed: {
    rowSelection() {
      return {
        onChange: (currentSelectedRowKeys) => {
          this.currentSelectedRowKeys = [ ...currentSelectedRowKeys ];
        },  
        getCheckboxProps: record => ({
          props: {
            disabled: record.configStatus == 2
          },
        }),
        selectedRowKeys: this.currentSelectedRowKeys,
        fixed: true
      };
    },
  },
  methods: {
    // 获取详情
    getDetail() {
      organizationSelectDetail({
        achieveId: this.$route.query.achieveId
      }).then(res => {
        let result = res.data || {};
        // this.selectedRowKeys = result.corporationId || [];
        let achievementRelationDTOS = result.achievementRelationDTOS || [];
        let selectIndexList = [];
        let hasSelectId = [];
        for (let i = 0; i < achievementRelationDTOS.length; i ++) {
          for (let j = 0; j < achievementRelationDTOS[i].indexIds.length; j++) {
            let arr = [], brr = [], crr = [];
            achievementRelationDTOS[i].indexIds[j].projectId = achievementRelationDTOS[i].modular;
            selectIndexList.push({
              ...achievementRelationDTOS[i].indexIds[j],
              projectId: achievementRelationDTOS[i].modular,
              _id: nanoid()
            });
            hasSelectId.push(selectIndexList[i].id);
            for (let m = 0; m < achievementRelationDTOS[i].indexIds[j].deductScoreDTOList.length; m++) {
              arr.push(achievementRelationDTOS[i].indexIds[j].deductScoreDTOList[m].deductPoints);
              brr.push(achievementRelationDTOS[i].indexIds[j].deductScoreDTOList[m].unit);
              crr.push(achievementRelationDTOS[i].indexIds[j].deductScoreDTOList[m].deductScore);
            }
            achievementRelationDTOS[i].indexIds[j].deductPoints = arr;
            achievementRelationDTOS[i].indexIds[j].unit = brr;
            achievementRelationDTOS[i].indexIds[j].deductScore = crr;
          }
          this.bodyIndexData[achievementRelationDTOS[i].modular].indexList = [ ...achievementRelationDTOS[i].indexIds];
        }
        this.selectIndexList = selectIndexList;
        this.hasSelectId = hasSelectId;
        this.bodyIndexData = { ...this.bodyIndexData }
        console.log(this.bodyIndexData)
      }).catch(err => console.log(err))
    },
    // 选指标
    selectIndex() {
      this.indexVisible = true;
    },
    indexSelectChange(indexArr, arr, flag) {
      this.selectIndexList = [...indexArr || []];
      this.$set(this.indexForm, "indexList", [...arr || []]);
      if (!flag) {
        formValidator.formItemValidate(this, 'indexList', 'indexForm');
      }
    },
    indexCancle() {
      this.selectIndexList = [];
      this.indexVisible = false;
      this.indexLoading = false;
      this.indexForm = {
        projectId: undefined
      };
    },
    indexConfirm() {
      if (!formValidator.formAll(this, 'indexForm')) {
        return;
      }
      this.indexLoading = true;
      for (let i = 0; i < this.selectIndexList.length; i++) {
        this.selectIndexList[i].projectId = this.indexForm.projectId;
        this.selectIndexList[i]._id = nanoid();
        this.hasSelectId.push(this.selectIndexList[i].id);
      }
      this.hasSelectId = [...new Set(this.hasSelectId)];
      this.indexLoading = false;
      this.indexVisible = false;
      if (this.bodyIndexData[this.indexForm.projectId]) {
        this.bodyIndexData[this.indexForm.projectId].indexList.push(...this.selectIndexList);
      }
      this.selectIndexList = [];
      this.indexForm = {
        projectId: undefined
      };
    },
    configIndexDelete(record) {
      if (record.projectId && this.bodyIndexData[record.projectId]) {
        let arr = this.bodyIndexData[record.projectId].indexList || [];
        let ind = this.hasSelectId.indexOf(record.id);
        if (ind != -1) {
          this.hasSelectId.splice(ind, 1);
        }
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == record.id) {
            this.bodyIndexData[record.projectId].indexList.splice(i, 1);
            return;
          }
        }
      }
    },

    // 选组织
    selectCorporation() {
      this.getCorporationDataList();
      this.corporationVisible = true;
      this.currentSelectedRowKeys = [ ...this.selectedRowKeys];
    },
    // 获取组织列表数据
    getCorporationDataList() {
      this.corporationDataList = [];
      return organizationSelect({
        pageNo: 1,
        pageSize: 9999,
        ...this.preFormInline
      }).then((result) => {
        this.corporationDataList = result.data.list || [];
      }).catch((err) => {
        console.log(err);
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getCorporationDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.formInline = {};
      this.preFormInline = {};
      this.getCorporationDataList();
    }, 250, { leading: true, trailing: false }),
    onSelectChange(currentSelectedRowKeys) {
      this.currentSelectedRowKeys = [ ...currentSelectedRowKeys ];
    },
    corporationConfirm() {
      this.selectedRowKeys = [ ...this.currentSelectedRowKeys ];
      this.corporationCancle();
    },
    corporationCancle() {
      this.corporationVisible = false;
      this.currentSelectedRowKeys = [];
      this.formInline = {};
      this.preFormInline = {};
    },

    pageCancle() {
      this.setKeepalive(true)
      this.$router.push("/ehsGerneralManage/performanceManagement/performanceReport");
    },
    pageSubmit() {
      if (!this.selectedRowKeys.length) {
        this.$antMessage.warn("必须选择所属组织！");
        return;
      }
      let arr = [];
      for (let key in this.bodyIndexData) {
        arr.push(...(this.bodyIndexData[key].indexList || []));
      }
      if (!arr.length) {
        this.$antMessage.warn("必须选择指标！");
        return;
      }
      
      let params = {
        corporationIdList: [ ...this.selectedRowKeys ],
        achievementRelationDTOS: []
      }
      for(let key in this.bodyIndexData) {
        if (this.bodyIndexData[key].indexList && this.bodyIndexData[key].indexList.length) {
          for (let i = 0; i < this.bodyIndexData[key].indexList.length; i++ ) {
            let deductScoreDTOList = [];
            if (this.bodyIndexData[key].indexList[i].deductPoints && this.bodyIndexData[key].indexList[i].deductPoints.length) {
              for(let j = 0; j < this.bodyIndexData[key].indexList[i].deductPoints.length; j++) {
                deductScoreDTOList.push({
                  deductPoints: this.bodyIndexData[key].indexList[i].deductPoints[j],
                  unit: this.bodyIndexData[key].indexList[i].unit[j],
                  deductScore: this.bodyIndexData[key].indexList[i].deductScore[j]
                })
              }
            }
            this.bodyIndexData[key].indexList[i].deductScoreDTOList = [ ...deductScoreDTOList ];
          }
        }
        if (this.bodyIndexData[key].indexList && this.bodyIndexData[key].indexList.length) {
          params.achievementRelationDTOS.push({
            modular: key,
            indexIds: [ ...this.bodyIndexData[key].indexList ]
          })
        }
      }
      this.btnLoading = true;
      organizationSave(params).then(result => {
        this.$router.push("/ehsGerneralManage/performanceManagement/performanceReport");
      }).finally(() => {
        this.btnLoading = false;
      })
    },
  }
}
</script>
