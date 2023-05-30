import Vue from 'vue'
import App from './App.vue'
import { initRouter } from './router'
// 千万不要动boeplat-header.css和ant design vue样式的引入顺序，header在前，ant在后
import 'boeplat-header/lib/boeplat-header.css';
import 'animate.css/source/animate.css'
import './theme/index.less'
import BoeplatHeader from "boeplat-header"
import Viser from 'viser-vue'
// import '@/mock'
import store from './store'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import '@/config/default/service.config.js'
import '@/theme/overall-situation.less'
import dayJs from "dayjs";
import VueDraggableResizable from 'vue-draggable-resizable'
Vue.component('vue-draggable-resizable', VueDraggableResizable)
import pageTitle from "@/components/commonTpl/pageTitle.vue"; // 页面标题
import searchTerm from "@/components/commonTpl/searchTerm.vue"; // 搜索项
import dashBtn from "@/components/commonTpl/dashBtn.vue"; // 虚线按钮
import commonTable from "@/components/commonTpl/commonTable.vue"; // 表格
import commonModal from "@/components/commonTpl/commonModal.vue"; // 弹框
import commonModalSpin from "@/components/commonTpl/commonModalSpin.vue"; // 弹框
import commonDrawer from "@/components/commonTpl/commonDrawer.vue"; // 抽屉
import hasFixedBottomWrapper from "@/components/commonTpl/hasFixedBottomWrapper.vue"; // 弹框
import hasFixedBottomContainer from "@/components/commonTpl/hasFixedBottomContainer.vue"; // 带有底部固定内容的布局
import hasSpinAndBtnBox from "@/components/commonTpl/hasSpinAndBtnBox.vue"; // 带有底部固定内容的布局
import fixedBottom from "@/components/commonTpl/fixedBottom"; //底部按钮
import commonSearchItem from "@/components/commonSearchItem/index.vue"; // 弹框
import commonDept from "@/components/commonSearchItem/commonDept.vue"; // 弹框
import deptTree from "@/components/deptTree/index.vue"; //选择组织下部门树
import deptOrgTree from "@/components/deptOrgTree/index.vue"; //选择平台组织下部门树
import global from '@/mixin/global.js'
import '@/utils/ployfill.js'
Vue.mixin(global)

// 按需加载
import XEUtils from 'xe-utils'
import { VXETable as VXETableObj, Tooltip as VXETooltip, Column as VXEColumn, Table as VXEtable, Colgroup, Input as VEXInput, Edit, Validator, Footer } from 'vxe-table'
console.log('VXEtable', VXETableObj);
// 自定义全局的格式化处理函数
VXETableObj.formats.mixin({
  // 秒转分 累计学习时长(分)
  studyDuration({ cellValue }) {
    return cellValue ? (cellValue / 60).toFixed(1) : 0
  },
  // 空内容
  isNull({ cellValue }) {
    return cellValue ? cellValue : '--'
  },
})
Vue.use(VXETooltip)
  .use(VXEColumn)
  .use(VXEtable).use(Colgroup).use(VEXInput).use(Edit).use(Validator).use(Footer)

import 'vxe-table/lib/style.css'
// 文件分片上传
import uploader from 'vue-simple-uploader'
Vue.use(uploader)


import element from 'element-ui'
import '@/style/commonStyle.less'
import '@/style/element-variables.scss'

import 'babel-polyfill'
import func from './plugins/preload.js'
import nodeWrap from './pages/workflowDesign/components/nodeWrap'
Vue.component('nodeWrap', nodeWrap); //初始化组件
import addNode from './pages/workflowDesign/components/addNode.vue'
Vue.component('addNode', addNode); //初始化组件
Vue.prototype.$func = func;

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    el.focus()
  }
});


Vue.use(element)

import {
  Base,
  Affix,
  Anchor,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  FormModel,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  Comment,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  PageHeader,
  Space,
  message,
  notification,
  PageHeaderWrapper
} from 'ant-design-vue';

const components = [
  Base,
  Affix,
  Anchor,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  FormModel,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  Comment,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  PageHeader,
  Space,
];

components.map(component => {
  Vue.use(component);
});

Vue.component('PageTitle', pageTitle);
Vue.component('SearchTerm', searchTerm);
Vue.component('DashBtn', dashBtn);
Vue.component('CommonTable', commonTable);
Vue.component('CommonModal', commonModal);
Vue.component('CommonModalSpin', commonModalSpin);
Vue.component('CommonDrawer', commonDrawer);
Vue.component('HasFixedBottomWrapper', hasFixedBottomWrapper);
Vue.component('HasFixedBottomContainer', hasFixedBottomContainer);
Vue.component('HasSpinAndBtnBox', hasSpinAndBtnBox);
Vue.component('FixedBottom', fixedBottom);
Vue.component('CommonSearchItem', commonSearchItem);
Vue.component('CommonDept', commonDept);

Vue.component('DeptTree', deptTree);
Vue.component('DeptOrgTree', deptOrgTree);
// msg提示的最大数量
Vue.prototype.$antMessage = message;
Vue.prototype.$antMessage.config({
  maxCount: 2,
});
Vue.prototype.$antNotification = notification;
Vue.prototype.$antInfo = Modal.info;
Vue.prototype.$antSuccess = Modal.success;
Vue.prototype.$antError = Modal.error;
Vue.prototype.$antWarning = Modal.warning;
Vue.prototype.$antConfirm = Modal.confirm;
Vue.prototype.$antDestroyAll = Modal.destroyAll;
Vue.use(BoeplatHeader)
// 导入组件库 element-ui版本
import NgForm from 'ng-form-element-self'
import 'ng-form-element-self/lib/ng-form-element.css'
Vue.use(NgForm)

// 引入预览图片组件
import hevueImgPreview from 'hevue-img-preview';

Vue.use(hevueImgPreview)
// 格式化金额库
import accounting from 'accounting'

// 格式化金额--保留两位小数
Vue.filter('paymentFilter', function (value) {
  let num = Number(value)
  return accounting.formatNumber(num, 2)
})
// 格式化时间
Vue.filter('dateFilter', function (value) {
  return value ? dayJs(value).format("YYYY-MM-DD") : ''
})
// 格式化金额转万元
Vue.filter('amountFilter', function (value) {
  let k = 10000
  let twoEnd = 100
  let amountFilter = ''
  if (Number(value) < k) {
    amountFilter = value
  } else {
    amountFilter = Math.floor((value * twoEnd / k)) / twoEnd
    amountFilter = amountFilter + '万'
  }
  return amountFilter
})
// 人员id转换名字过滤器
Vue.filter('userIdFilter', (val, ids) => {
  if (typeof val == 'string') {
    val = val.split(",");
  }
  if (val && val.length >= 1) {
    let text = "";
    for (let ele of val) {
      const obj = ids[ele];
      text = obj ? text + obj.name + '、' : text + ''
    }
    return text.substring(0, text.length - 1);
  } else {
    return '--'
  }
})

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

// Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.prototype.$bus = new Vue();
bootstrap({ router, store, i18n, message: Vue.prototype.$message })


new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
