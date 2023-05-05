<template>
  <div class="tree-content">
    <h2 class="page-title">树形控件</h2>
    <div class="main-content">
      <!-- 多选树控件 -->
      <div class="tree">
        <div class="tree-title">可以多选</div>
          <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @select="onSelect"
          />
      </div>
      <!-- 公用模板（带有标题、查询条件、表格、分页、虚线边框按钮、点击按钮弹出公用弹框样式） -->
      <div class="searchTable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">  
        <div v-show="true" class="searchTable-box">
          <!-- 查询 -->
          
          <!-- 虚线按钮 -->
          <div class="dashed-btn clx-btn-dashed-box">
            <a-button type="dashed">普通虚线框按钮</a-button>
            <!-- 带有加号按钮 -->
            <a-button type="dashed"><a-icon type="plus" />带加号按钮</a-button>
          </div>
          <!-- 表格 -->
          <div class="contract-table">
            <a-table :columns="columns" :locale="{emptyText: emptyText}" :data-source="dataList" :rowKey="(record, index)=>{return index}" :pagination="false">
              <div slot="phone" slot-scope="record">
                <span>{{encryptionRules("phone", record.phone)}}</span>
              </div>
              <div slot="invitePlatform" slot-scope="record">
                <span>{{record.invitePlatform ? record.invitePlatform : "-"}}</span>
              </div>
            </a-table>
            <!-- 页码 -->
            <div class="table-pagination">
              <a-pagination simple :current="page.pageNo" :pageSize="page.pageSize" :total="page.total" show-less-items showQuickJumper @change="pageNoChange" />
              <span class="table-pagination-totel">
                共
                <span>{{ page.total }}</span>
                条
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="tree">
        <div class="tree-title">单选</div>
        <a-tree
          v-model="checkedKeys"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :selected-keys="selectedKeys"
          :tree-data="treeData"
          @expand="onExpand"
          @select="onSelect"
        />
      </div>
    </div>
    <h2 class="page-title">富文本编辑器1</h2>
    <TEditor @submitEditor='submitEditor'></TEditor>
    <h2 class="page-title">富文本编辑器2</h2>
    <editor-bar v-model="content" :isClear="isClear" @submitEditor="submitEditor"></editor-bar>
  </div>
</template>

<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import TEditor from './tinyEditor.vue';
import EditorBar from '../../components/editor/wangEditor.vue'
export default {
  components: {TEditor,EditorBar},
  mixins: [teableCenterEllipsis],
  data() {
    return {
      content:'',
      isClear: false,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [
        {
          title: '0-0',
          key: '0-0',
          children: [
            {
              title: '0-0-0',
              key: '0-0-0',
              children: [
                { title: '0-0-0-0', key: '0-0-0-0' },
                { title: '0-0-0-1', key: '0-0-0-1' },
                { title: '0-0-0-2', key: '0-0-0-2' },
              ],
            },
            {
              title: '0-0-1',
              key: '0-0-1',
              children: [
                { title: '0-0-1-0', key: '0-0-1-0' },
                { title: '0-0-1-1', key: '0-0-1-1' },
                { title: '0-0-1-2', key: '0-0-1-2' },
              ],
            },
            {
              title: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: '0-1',
          key: '0-1',
          children: [
            { title: '0-1-0-0', key: '0-1-0-0' },
            { title: '0-1-0-1', key: '0-1-0-1' },
            { title: '0-1-0-2', key: '0-1-0-2' },
          ],
        },
        {
          title: '0-2',
          key: '0-2',
        },
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: '企业名称',
          dataIndex: 'partnerCompanyName',
          key: "partnerCompanyName"
        },
        {
          title: '联系人手机号',
          scopedSlots: { customRender: 'phone' },
          key: "phone",
        },
        {
          title: '邀请人',
          dataIndex: 'userName',
          key: "userName"
        },
        {
          title: '邀请时间',
          dataIndex: 'inviteTime',
          key: "inviteTime"
        },
        {
          title: '邀请入口',
          scopedSlots: { customRender: 'invitePlatform' },
          key: "invitePlatform"
        }
      ],
      dataList: [],
    }
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val);
    },
  },
  methods: {
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
      this.selectedKeys = checkedKeys[1];
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info);
      console.log('onSelect-key==', info.node.eventKey);
      // console.log(this.checkedKeys.indexOf(info.node.eventKey));
      // const ind = this.checkedKeys.indexOf(info.node.eventKey);
      // if(ind<0) {
      //   this.checkedKeys.push(info.node.eventKey)
      // } else {
      //   this.checkedKeys.splice(ind,1)
      // }
      this.selectedKeys = selectedKeys;
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      // this.getCooperationPartnerList();
    },
    submitEditor(value) {
      console.log("富文本编辑器输入的内容是======",value);
    },
    submitEditor(val) {
      console.log(val)
      
    },
  },

}
</script>

<style lang='less' scoped>
.tree-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .page-title {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 0 30px;
  }
  .main-content {
    display: flex;
    .tree {
      width: 320px;
      height: 100%;
      margin-bottom: 20px;
      overflow-y: auto;
      background: #FFFFFF;
      border: 0.5px solid rgba(220,220,220,1);
      box-shadow: 0px 8px 10px -5px rgba(0,0,0,0.08);box-shadow: 0px 16px 24px 2px rgba(0,0,0,0.04);box-shadow: 0px 6px 30px 5px rgba(0,0,0,0.05);
      border-radius: 3px;
      .tree-title {
        padding-left: 10px;
        margin-top: 10px;
        font-size: 16px;
        color: #333333;
        font-weight: 400;
      }
    }
    .searchTable-wrapper {
      padding-left: 20px;
      box-sizing: border-box;
      flex: 1;
    }
  }
}
</style>