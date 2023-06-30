<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="编号">
          <a-input v-model="formInline.code" placeholder="请输入编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属分类">
          <a-select
            v-model="formInline.classificationCode"
            placeholder="请选择"
            @change="classChangeOne"
            allowClear
          >
            <a-select-option
              v-for="(val, key) in classDictObj"
              :key="key"
              :value="key"
              >{{ val }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属组织">
          <a-select
            v-model="formInline.corporationId"
            placeholder="请选择"
            allowClear
          >
            <a-select-option
              v-for="item in coDictList"
              :key="item.corporationId"
              :value="item.corporationId"
              >{{ item.orgAbbrName }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="部门">
          <a-input v-model="formInline.deptName" placeholder="请输入部门" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="工艺">
          <a-input v-model="formInline.workmanship" placeholder="请输入工艺" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.infoStatus" placeholder="请选择作业状态" allowClear>
            <a-select-option v-for="item in approveStatus" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="危险源种类">
          <a-select v-model="formInline.riskClass" placeholder="请选择危险源种类" allowClear>
            <a-select-option v-for="item in wxyHazardkind" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="可能导致事件">
          <a-select v-model="formInline.possibleEvents" placeholder="请选择可能导致事件" allowClear>
            <a-select-option v-for="item in wxyLeadtheevent" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关键词">
          <a-input v-model="formInline.keyWord" placeholder="请输入关键词" allowClear></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="dataSource"
        :pagination="false"
        :rowKey="(record, index)=>{return record.id}"
        bordered
      >
        <!-- <template slot="deptId" slot-scope="text">
          {{text ? deptCache[text] : '--'}}
        </template> -->
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionPreview(record.id,record.code)">查看</span>
          <span v-if="record.infoStatus=='1'" class="color-0067cc cursor-pointer m-r-15" @click="handleAction(record.id,record.code)">处理</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dictionary from '@/utils/dictionary'
import { debounce } from 'lodash';
import { reviewSelect } from "@/services/dangerSource/dangerApprove/index.js";
import {
  AllClassList,
  GetOrganizationList,
} from "@/services/dangerSource/dangerList/index.js";
import { queryDeptTree } from '@/services/api'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    OrganizeLazyTree
  },
  data() {
    return {
      tableSpinning:false,
      formInline: {
        corporationId: undefined,
      },
      possibleEventsList: null,
      classDictObj: {}, //所属分类数据
      // deptData: [],
      dangerApproveForm: {},
      approveStatusDict: {}, //状态字典
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      //现地字段下拉框数据
      // riskLevel:[],
      columns: [
        {
          title: '状态',
          dataIndex: 'infoStatus',
          width: 150,
          customRender: (text, record, index) => {
            return this.approveStatusDict[text] ? this.approveStatusDict[text] : '--';
          },
        },
        {
          title: '编号',
          dataIndex: 'code',
          width: 180,
          customRender: (text, record, index) => {
            return text ? text :'--';
          },
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text :'--';
          },
        },
        {
          title: '工艺',
          dataIndex: 'workmanship',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text :'--';
          },
        },
        {
          title: '设备或区域',
          dataIndex: 'equipmentArea',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text :'--';
          },
        },
        {
          title: '作业状态',
          dataIndex: 'jobStatus',
          width: 150,
        },
        {
          title: '风险描述',
          dataIndex: 'riskDescription',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text :'--';
          },
        },
        {
          title: '危险源种类',
          dataIndex: 'riskClass',
          width: 150,
        },
        {
          title: '可能导致的事件',
          dataIndex: 'possibleEvents',
          width: 150,
          customRender: (text, record, index) => {
            let dictText = text ? JSON.parse(text) : [];
            let list = this.possibleEventsList, arr = [];
            dictText.forEach(item1=> {
              list.forEach(item2=> {
                if(item1 == item2.dictValue) {
                  arr.push(item2.dictLabel)
                }
              })
            })
            return arr.length > 1 ? arr.join(',') : '--';
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 260 // 宽度根据操作自定义设置
        }
      ],
      dataSource: [],
      addForm: {},
      coDictList: [], //组织数据
    }
  },
  created() {
    this.setRouterCode("dangerApprove");
    this.possibleEventsList = this.getDictItemList('wxy_leadtheevent');
    this.getDataList();
    this.initConfigPage()
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  computed: {
    // 危险源种类字典
    wxyHazardkind() {
      const dict = this.$store.state.setting.dictTypeData;
      const wxyHazardkind = dict.find((item) => {
        return item.dictType == "wxy_hazardkind";
      });
      return wxyHazardkind.dictItem;
    },
    // 危险源种类字典
    wxyLeadtheevent() {
      const dict = this.$store.state.setting.dictTypeData;
      const wxyLeadtheevent = dict.find((item) => {
        return item.dictType == "wxy_leadtheevent";
      });
      return wxyLeadtheevent.dictItem;
    },
  },
  methods: {
    initConfigPage(){
      this.allClassList(); //获取所有所属分类
      this.approveStatus = dictionary("approveStatus"); //状态字典
      this.approveStatus.forEach((ele) => {
        this.$set(this.approveStatusDict, ele.key, ele.value);
      });
    },
    // 获取所有所属分类
    allClassList() {
      return AllClassList()
        .then((res) => {
          this.classDictObj = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //所属分类切换
    classChangeOne(val) {
      GetOrganizationList({ classificationCode: val })
        .then((res) => {
          // this.deptData = [];
          this.formInline.corporationId = undefined;
          // this.formInline.deptId = undefined;
          this.coDictList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取列表
    getDataList() {
      let params = {
        ...this.dangerApproveForm,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.tableSpinning = true
      return reviewSelect(params)
      .then((res) => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.dangerApproveForm = JSON.parse(JSON.stringify(this.formInline));
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },

    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        corporationId: undefined,
      };
      // this.deptData = [];
      this.coDictList = [];
      this.dangerApproveForm = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    // 查看
    actionPreview(id,code) {
      sessionStorage.setItem('processReview',1);
      this.$router.push({ path:'/safeManage/dualControlManage/riskManage/processReview', query:{id,code} });
    },
    // 处理
    handleAction(id,code) {
      sessionStorage.setItem('processReview',2);
      this.$router.push({ path:'/safeManage/dualControlManage/riskManage/processReview', query:{id,code} });
    },
  }
}
</script>
<style lang="less" scoped>

</style>