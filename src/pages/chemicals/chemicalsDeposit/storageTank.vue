<template>
  <div class="storage-tank clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>化学品柜储存管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" :departmentMultiple="true" deptLabel="管理部门"></CommonSearchItem>
        <a-form-model-item label="柜架编号">
          <a-input v-model="formInline.code" placeholder="请输入柜架编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="柜架名称">
          <a-input v-model="formInline.name" placeholder="请输入柜架名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="柜架类型">
          <a-select v-model="formInline.shelfType" placeholder="请选择货架类型" show-search :filter-option="filterOption">
            <a-select-option v-for="item of storage_type" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="轴位">
          <a-input v-model="formInline.axialPosition" placeholder="请输入轴位" allowClear></a-input>
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
        <a-button type="dashed" @click="tankAdd">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="qrcode" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="qrcodeCheck(record)">查看二维码</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="newlyPreview(record.shelfId)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="newlyEdit(record.shelfId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="newlyDelete(record.shelfId)">删除</span>
          <span class="color-0067cc cursor-pointer" @click="newlyDetail(record.shelfId)">柜架明细</span>
          <span class="color-0067cc cursor-pointer" @click="newlyExport(record.shelfId)">导入</span>
        </div>
      </a-table>
    </CommonTable>
    <QRCodeModelVue v-model="QRCodeShow" :QRCodeData="QRCodeData"></QRCodeModelVue>
    <CommonModal title="柜架明细" :visible="depotVisible" :cancelFn="closedepotVisible" class="depot">
      <template slot="form">
        <CommonTable>
          <a-table bordered :columns="depotColumns" :locale="{emptyText: emptyText}" :data-source="depotList" :rowKey="(record, index)=>{return index}" :pagination="false">
            <div slot="currentQuantity" slot-scope="record">
              <span v-if="record.designStock*1 < record.currentQuantity*1" class="color-ff4d4f">{{record.currentQuantity}}</span>
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
          <span>当前存量: {{currentQuantity}}</span>
        </div>
        <CommonTable>
          <a-table bordered :columns="accessColumns" :locale="{emptyText: emptyText}" :data-source="accessList" :rowKey="(record, index)=>{return index}" :pagination="false"></a-table>
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
import { shelfDelete,shelfPageList,shelfStorageDetail,warehouseStorageRecords } from "@/services/api.js";
import DownLoadAndUpload from "./component/downloadAndUpload.vue";
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
      loadVisible: false,
      loadData: {
        entryId: '',
        type: '2', //类型 1-库房，2-柜架
      },
      QRCodeData: {},
      chemicalDict: {},
      storageDict: {},
      chemicalDict: {},
      corpDict: {},
      accessName: null,
      designStock: 0,
      currentQuantity: 0,
      formInline: {
        code:"",
        name:"",
        shelfType: undefined,
        axialPosition:""
      },
      shelfForm: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: "柜架编号",
          dataIndex: "code",
          key: "code",
          width: 200
        },
        {
          title: "柜架名称",
          dataIndex: "name",
          key: "name",
          width: 200
        },
        {
          title: "轴位",
          dataIndex: "axialPosition",
          key: "axialPosition",
          width: 200
        },
        {
          title: "管理人员",
          dataIndex: "person",
          key: "person",
          width: 220
        },
        {
          title: "柜架类型",
          dataIndex: "shelfType",
          key: "shelfType",
          width: 120,
          customRender: (text, record, index) => {
            return text ? this.storageDict[text] : "--";
          },
        },
        {
          title: "是否可用",
          dataIndex: "usable",
          key: "usable",
          width: 120,
          customRender: (text, record, index) => {
            return text == '1' ? '是' :  text == '2'?'否': "--";
          }
        },
        {
          title: "设计存量",
          dataIndex: "designStock",
          key: "designStock",
          align: "center",
          width: 120,
        },
        {
          title: "当前存量",
          dataIndex: "currentStock",
          key: "currentStock",
          align: "center",
          customCell: this.customCell,
          width: 120,
        },
        {
          title: "库房二维码",
          width: 160,
          scopedSlots: { customRender: 'qrcode' },
          key: "qrcode",
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 300
        },
      ],
      depotList: [],
      depotColumns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalName",
          key: "chemicalName",
          align: 'center',
          customRender: (text, record, index) => {
            return this.chemicalDict[text] ? this.chemicalDict[text] : text ? text : "--";
          },
        },
        {
          title: "设计存量",
          dataIndex: "designStock",
          key: "designStock",
          align: "center"
        },
        {
          title: "当前存量",
          scopedSlots: { customRender: 'currentQuantity' },
          key: "currentQuantity",
          align: "center"
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit",
          align: "center"
        },
        {
          title: "存取记录",
          scopedSlots: { customRender: 'access' },
          key: "access",
          align: "center"
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
      accessList: []
    }
  },
  computed: {
    storage_type() { //从字典组里获取货架类型数据
      const dict = this.$store.state.setting.dictTypeData;
      const storage_type = dict.find(item => {
        return item.dictType == 'storage_type';
      });
      storage_type.dictItem.forEach(ele => {
        this.$set(this.storageDict, ele.dictValue, ele.dictLabel)
      });
      return storage_type.dictItem; //字典项
    },
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      chemical.dictItem.forEach(ele => {
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel);
      });
      return chemical.dictItem;
    },
  },
  created() {
    this.setRouterCode("storageTank");
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "管理部门",
      key: "deptIds"
    }))
    this.initConfigPage()
    this.getShelfList();
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
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel);
      });
      const corporationList = this.$store.state.setting.corporationList;
      corporationList.forEach(item=>{
        this.$set(this.corpDict, item.corporationId, item.orgAbbrName);
      })
    },
    customCell(record) {
      if(Number(record.currentStock) > Number(record.designStock)) {
        return {
          style: {
            'background-color': '#ff4d4f',
          },
        };
      }
      
    },
    // 查询
    iSearch() {
      // this.handleLoading();
      this.shelfForm = JSON.parse(JSON.stringify(this.formInline));
      this.getShelfList();
    },
    getShelfList() {
      const params = {
        ...this.shelfForm,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      shelfPageList(params)
      .then(res=>{
        console.log("ttt-----------",res.data);
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      })
      .catch(err=>{
        console.log(err);
      })
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
        shelfId: record.shelfId,
        // name: record.name,
        // code: record.code,
      };
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 明细按钮
    newlyDetail(shelfId) {
      shelfStorageDetail({shelfId}).then(res=>{
        console.log("明细-----",res);
        this.depotList = res.data;
        this.depotVisible = true;
      }).catch(err=>{
        console.log(err);
      })
      this.depotVisible = true;
    },
    // 导入
    newlyExport(id) {
      this.loadData.entryId = id;
      this.loadVisible = true;
    },
    closeVisible(value,bool=false) {
      console.log("booooo-tt--",bool);
      this.loadVisible = value;
      if(bool) {
        this.getShelfList();
      }
    },
    // 存取记录按钮
    accessClick(storageId) {
      console.log("ii", storageId);
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
      this.accessVisible = true;
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
        code:"",
        name:"",
        shelfType: undefined,
        axialPosition:""
      }
      this.shelfForm = {};
      this.getShelfList();
    }, 250, { leading: true, trailing: false }),
    // 新建
    tankAdd() {
      this.$router.push("/safeManage/chemicalSafeManage/chemicalStoreManage/addEditTank");
    },
    // 化学品查看
    newlyPreview(shelfId) {
      // sessionStorage.setItem("handleNewly", 0)
      this.$router.push({ path: "/safeManage/chemicalSafeManage/chemicalStoreManage/tankPreview", query: { id: shelfId } });
    },
    // 编辑
    newlyEdit(shelfId) {
      // sessionStorage.setItem("handleNewly", 1)
      this.$router.push({ path: "/safeManage/chemicalSafeManage/chemicalStoreManage/addEditTank", query: { id: shelfId } });
    },
    // 删除
    newlyDelete(shelfId) {
      const _this = this;
      this.$antConfirm({
        title: `确定删除吗？`,
        onOk() {
          shelfDelete({shelfId}).then(res=>{
            if(res.code == 20000) {
              _this.$antMessage.success("删除成功");
              _this.getShelfList();
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
      this.getShelfList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getShelfList();
    }
  }
}
</script>

<style lang="less" scoped>
.storage-tank {
}
.access-detail {
  margin-bottom: 20px;
  span {
    margin-right: 30px;
  }
}
</style>