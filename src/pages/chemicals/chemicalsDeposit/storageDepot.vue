<template>
  <div class="storage-depot clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>化学品库房储存管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :departmentMultiple="true" :hasDepartment="true"  deptLabel="管理部门"></CommonSearchItem>
        <a-form-model-item label="库房编号">
          <a-input v-model="formInline.code" placeholder="请输入库房编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="库房名称">
          <a-input v-model="formInline.name" placeholder="请输入库房名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="位置">
          <a-input v-model="formInline.location" placeholder="请输入位置" allowClear></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="depotAdd">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="dataSource"
        :rowKey="(record, index)=>{return index}"
        :pagination="false"
      >
        <div slot="chemicalName" slot-scope="record">
          <span v-if="record.chemicalName">{{ record.chemicalName | filterChemical }}</span>
        </div>
        <div slot="qrcode" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="qrcodeCheck(record)">查看二维码</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="newlyPreview(record.warehouseId)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="newlyEdit(record.warehouseId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="newlyDelete(record.warehouseId)">删除</span>
          <span class="color-0067cc cursor-pointer" @click="newlyDetail(record.warehouseId)">明细</span>
          <span class="color-0067cc cursor-pointer" @click="newlyExport(record.warehouseId)">导入</span>
        </div>
      </a-table>
    </CommonTable>
    <QRCodeModelVue v-model="QRCodeShow" :QRCodeData="QRCodeData"></QRCodeModelVue>
    <CommonModal title="明细" :visible="depotVisible" :cancelFn="closedepotVisible" class="depot">
      <template slot="form">
        <CommonTable>
          <a-table
            bordered
            :columns="storageColumns"
            :locale="{emptyText: emptyText}"
            :data-source="storageList"
            :rowKey="(record, index)=>{return index}"
            :pagination="false"
          >
            <div slot="currentQuantity" slot-scope="record">
              <span v-if="record.designStock*1 < record.currentQuantity*1" style="color:red">{{record.currentQuantity}}</span>
              <span v-else>{{record.currentQuantity}}</span>
            </div>
            <div slot="access" slot-scope="record">
              <span class="color-0067cc cursor-pointer" @click="accessClick(record.storageId)">存取记录</span>
            </div>
          </a-table>
        </CommonTable>
      </template>
      <!-- <template slot="btn">
        <a-button @click="closedepotVisible">取消</a-button>
        <a-button class="m-l-15" type="primary">确定</a-button>
      </template> -->
    </CommonModal>
    <CommonModal title="存取记录" :visible="accessVisible" :cancelFn="closeAccessVisible" class="depot">
      <template slot="form">
        <div class="access-detail">
          <span>化学品名称: {{ chemicalDict[accessName] }}</span>
          <span>设计存量: {{designStock}}</span>
          <span>当前数量: {{currentQuantity}}</span>
        </div>
        <CommonTable>
          <a-table
            bordered
            :columns="accessColumns"
            :locale="{emptyText: emptyText}"
            :data-source="accessList"
            :rowKey="(record, index)=>{return index}"
            :pagination="false"
          >
          </a-table>
        </CommonTable>
      </template>
      <!-- <template slot="btn">
        <a-button @click="closeAccessVisible">取消</a-button>
        <a-button class="m-l-15" type="primary">确定</a-button>
      </template> -->
    </CommonModal>
    <DownLoadAndUpload :visible="loadVisible" :data="loadData" @visible="closeVisible"></DownLoadAndUpload>
  </div>
</template>
<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
import QRCodeModelVue from "@/components/qrCodeModel/qrCodeModel.vue";
import { warehousePageList,warehouseDelete,warehouseStorageDetail,warehouseStorageRecords } from "@/services/api.js";
import DownLoadAndUpload from "./component/downloadAndUpload.vue";
let that;
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    QRCodeModelVue,
    DownLoadAndUpload,
  },
  data() {
    return {
      tableSpinning:false,
      QRCodeShow: false,
      depotVisible: false,
      accessVisible: false,
      accessName: null,
      loadVisible: false,
      loadData: {
        entryId: '',
        type: '1', //类型 1-库房，2-柜架
      },
      designStock: 0,
      currentQuantity: 0,
      QRCodeData:{},
      formInline: {
        deptList: undefined,
      },
      warehouseForm: {},
      chemicalDict: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: "库房编号",
          dataIndex: "code",
          key: "code",
          width: 200
        },
        {
          title: "库房名称",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "位置",
          dataIndex: "location",
          key: "location",
          width: 200,
        },
        {
          title: "管理人员",
          dataIndex: "person",
          key: "person",
          width: 220
        },
        {
          title: "储存化学品",
          // dataIndex: "chemicalName",
          key: "chemicalName",
          width: 160,
          scopedSlots: { customRender: 'chemicalName' },
        },
        {
          title: "柜架",
          scopedSlots: { customRender: 'qrcode' },
          key: "qrcode",
          width: 160
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 300
        },
      ],
      storageList:[
        // {id:'111',name:"名字1",name1:"20",name2:'瓶',currentNum:'11',gt: true},
        // {id:'122',name:"名字1",name1:"20",name2:'瓶',currentNum:'22',gt: false},
      ],
      storageColumns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalName",
          key: "chemicalName",
          align:"center",
          customRender: (text, record, index) => {
            return this.chemicalDict[text] ? this.chemicalDict[text] : text ? text : "--";
          },
        },
        {
          title: "设计存量",
          dataIndex: "designStock",
          key: "designStock",
          align:"center"
        },
        {
          title: "当前数量",
          scopedSlots: { customRender: 'currentQuantity' },
          key: "currentQuantity",
          align:"center"
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit",
          align:"center"
        },
        {
          title: "存取记录",
          scopedSlots: { customRender: 'access' },
          key: "access",
          align:"center"
        },
      ],
      accessColumns: [
        {
          title: "操作",
          dataIndex: "operate",
          key: "operate",
          align:"center",
          customRender: (text, record, index) => {
            return text==1?"存":text==2?'取':'--';
          },
        },
        {
          title: "数量",
          dataIndex: "num",
          key: "num",
          align:"center"
        },
        {
          title: "操作人",
          dataIndex: "operateUser",
          key: "operateUser",
          align:"center",
          customRender: (text, record, index) => {
            return text ? text :'--';
          },
        },
        {
          title: "操作时间",
          dataIndex: "operateTime",
          key: "operateTime",
          align:"center"
        },
      ],
      accessList:[]
    }
  },
  computed: {
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      return chemical.dictItem;
    },
  },
  beforeCreate () {
    that = this;
  },
  filters: {
    filterChemical(value) {
      const arr = value.split(',');
      let chemicalName = '';
      arr.forEach(item=>{
        let name = that.chemicalDict[item];
        chemicalName = chemicalName + name +'、';
      })
      return chemicalName.slice(0,chemicalName.length-1);
    }
  },
  created() {
    this.setRouterCode("storageDepot");
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "管理部门",
      key: "deptIds"
    }))
    this.initConfigPage()
    this.getWarehouseList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      this.chemical.forEach(ele => {
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel)
      });
    },
    // 查询
    iSearch() {
      // this.handleLoading();
      this.warehouseForm = JSON.parse(JSON.stringify(this.formInline));
      this.getWarehouseList();
    },
    getWarehouseList() {
      const params = {
        ...this.warehouseForm,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      warehousePageList(params)
      .then(res=>{
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      })
      .catch(err=>{})
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查看二维码
    qrcodeCheck(record) {
      console.log(record);
      this.QRCodeShow = true;
      this.QRCodeData = {
        // companyId: record.companyId,
        type: record.type,
        warehouseId: record.warehouseId,
        // name: record.name,
        // code: record.code,
      };
    },
    // 明细按钮
    newlyDetail(warehouseId) {
      warehouseStorageDetail({warehouseId}).then(res=>{
        this.storageList = res.data;
        this.depotVisible = true;
      }).catch(err=>{
        console.log(err);
      })
    },
    // 导入
    newlyExport(id) {
      this.loadData.entryId = id;
      this.loadVisible = true;
    },
    closeVisible(value) {
      this.loadVisible = value
    },
    // 存取记录按钮
    accessClick(storageId) {
      warehouseStorageRecords({storageId}).then(res=>{
        const data = res.data;
        this.accessList = data.recordsList;
        this.accessName = data.chemicalName;
        this.designStock = data.designStock;
        this.currentQuantity = data.currentQuantity;
        this.accessVisible = true;
      }).catch(err=>{
        console.log(err);
      })
    },
    // 存取记录弹框取消
    closedepotVisible() {
      this.depotVisible = false;
    },
    // 关闭存取记录弹框
    closeAccessVisible() {
      this.accessVisible = false;
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        code:'',
        name:'',
        location:'',
      }
      this.warehouseForm = {};
      this.getWarehouseList();
    }, 250, { leading: true, trailing: false }),
    // 新建
    depotAdd() {
      this.$router.push("/safeManage/chemicalSafeManage/chemicalStoreManage/addEditDepot");
    },
    // 化学品查看
    newlyPreview(warehouseId) {
      // sessionStorage.setItem("handleNewly",0)
      this.$router.push({path: "/safeManage/chemicalSafeManage/chemicalStoreManage/depotPreview", query: {warehouseId}});
    },
    // 编辑
    newlyEdit(warehouseId) {
      // sessionStorage.setItem("handleNewly",1)
      this.$router.push({path: "/safeManage/chemicalSafeManage/chemicalStoreManage/addEditDepot", query: {warehouseId}});
    },
    // 删除
    newlyDelete(warehouseId) {
      const _this = this;
      this.$antConfirm({
        title: `确定删除吗？`,
        onOk() {
          warehouseDelete({warehouseId}).then(res=>{
            if(res.code == 20000) {
              _this.$antMessage.success("删除成功");
              _this.getWarehouseList();
            }
          }).catch(err=>{
            console.log(err);
          })
        },
        onCancel() {
          _this.$antMessage.info('取消删除');
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getWarehouseList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getWarehouseList();
    }
  }
}
</script>

<style lang="less" scoped>
// .storage-depot{
  
// }
.access-detail {
  margin-bottom: 20px;
  span {
    margin-right: 30px;
  }
}
</style>