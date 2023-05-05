<template>
  <HasFixedBottomWrapper>
    <PageTitle>菜单数据权限</PageTitle>
    <div>
      <a-row class="pd-t-12 pd-b-12 pd-l-20 pd-r-20 border-b-e7 bg-f5f7fa" :span="24" type="flex" justify="center" align="middle">
        <a-col :span="8">功能模块</a-col>
        <a-col :span="8">功能菜单</a-col>
        <a-col :span="8">数据权限</a-col>
      </a-row>
    </div>
    <div v-for="(item, index) in menuList" :key="index">
      <a-row class="pd-t-12 pd-b-12 pd-l-20 pd-r-20 border-b-e7" :span="24" type="flex" justify="center" align="middle">
        <a-col :span="8">
          <div>{{item.fatherName ? item.fatherName : item.name}}</div>
        </a-col>
        <a-col :span="8">
          <div>{{item.name}}</div>
        </a-col>
        <a-col :span="8">
          <div>
            <a-radio-group v-model="item.checkedValues" @change="(checkedValues) => {onChange(checkedValues, item.path)}">
              <a-radio :value="0">全部数据</a-radio>
              <a-radio :value="1">当前法人机构</a-radio>
            </a-radio-group>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button type="primary" class="m-r-15" @click="submitConfirm">保存</a-button>
        </div>
      </FixedBottom>
    </div> -->
  </HasFixedBottomWrapper>
</template>
<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { mapMutations } from "vuex";
import reLogin from "@/utils/reLogin";

import { getMenuAuthList, updateDataAuth } from "@/services/api.js";


export default {
  components: {
    FixedBottom,  
  },
  data() {
    return {
      menuList: [],
      cloneMenuList: [],
      authList: [],
      menuData: JSON.parse(sessionStorage.getItem("menuData"))
    }
  },
  created() {
    this.setRouterCode("menuDataPermission");
    console.log(JSON.parse(sessionStorage.getItem("menuData")))
    console.log(this.menuData, this.menuList);
    this.getMenuList(this.menuData);
    this.menuList = [...this.cloneMenuList];
    this.getPageMenuAuthList();
  },
  methods: {
    getPageMenuAuthList() {
      getMenuAuthList().then(res => {
        this.authList = res.data || [];
        this.cloneMenuList = [];
        this.getMenuList(this.menuData, "", true);  
        this.menuList = [...this.cloneMenuList];
      }).catch(err => {
        console.log(err);
      }) 
    },
    getMenuList(arr, fatherName, flag) {
      for(let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0 && arr[i].path != "chemicals") {
          this.getMenuList(arr[i].children, arr[i].name, flag);
        } else {
          if (!arr[i].meta.invisible) {
            let itemObj = {
              path: arr[i].path,
              fullPath: arr[i].fullPath,
              name: arr[i].name,
              fatherName: fatherName
            };
            if (flag) {
              let authType = this.getMappingValue(this.authList, "resourceCode", arr[i].path).authType;
              console.log(authType)
              itemObj.checkedValues = authType != undefined ? authType : 1;
            }
            this.cloneMenuList.push(itemObj);
          }
        }
      }
    },
    onChange(e, path) {
      let _this = this;
      updateDataAuth({
        resourceCode: path,
        authType: e.target.value
      }).then(res => {
        this.$antMessage.success("修改成功");
        this.$antConfirm({
          title: '重新登录后生效，是否重新登录?',
          onOk() {
            reLogin(() => {
              _this.$router.push("/login");
            });
          }
        });
      }).catch(err => {
        for (let i = 0; i < this.menuList.length; i++) {
          if (this.menuList[i].path == path) {
            this.menuList[i].checkedValues = this.menuList[i].checkedValues == 0 ? 1 : 0;
          }
        }
      }) 
    },
    submitConfirm() {
      console.log(this.menuList);
    },
  },
}
</script>
<style lang="less" scoped>
.wrapper > div{
  width: 100%;
}
.title{
  // .ant-row{
  //   background: #ccc
  // }
}
</style>
