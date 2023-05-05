<template>
  <CommonModal :title="`用户详情`" :visible="resignedDetail" :cancelFn="cancelResignedDetail">
    <template slot="form">
      <a-form-model ref="detailFormRef" :model="detailForm" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="right">
        <!-- 基本信息 -->
        <template title="基本信息">
          <h1 class="h1_wxt">基本信息</h1>
          <a-form-model-item label="头像">
            <div class="ant-form-text ant-form-text-img">
              <img :src="detailForm.profilePath || deImg" @click="previewImg" />
            </div>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="手机号">
            <span class="modal-form-text-main">{{ detailForm.phone || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="姓名">
            <span class="modal-form-text-main">{{ detailForm.name || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="昵称">
            <span class="modal-form-text-main">{{ detailForm.nickName || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="性别">
            <span class="modal-form-text-main">{{(detailForm.sex && getDictionaryItemObj("sex", detailForm.sex)) ||"--"}}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="生日">
            <span class="modal-form-text-main">{{ detailForm.birthday || "--" }}</span>
          </a-form-model-item>

          <a-form-model-item class="modal-form-text" label="加入时间">
            <span class="modal-form-text-main">{{ detailForm.createTime || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="过期时间">
            <span class="modal-form-text-main">{{ detailForm.expireTime || "--" }}</span>
          </a-form-model-item>
        </template>
        <!-- 工作信息 -->
        <template title="工作信息">
          <h1 class="h1_wxt">工作信息</h1>
          <a-form-model-item class="modal-form-text" label="工号">
            <span class="modal-form-text-main">{{ detailForm.jobNumber || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="邮箱">
            <span class="modal-form-text-main">{{ detailForm.email || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="部门及职位">
            <span class="modal-form-text-main">{{ detailForm.deptAndPositionStr || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="角色">
            <span class="modal-form-text-main">{{ detailForm.roleName || "--" }}</span>
          </a-form-model-item>
          <a-form-model-item class="modal-form-text" label="标签">
            <span class="modal-form-text-main">{{ detailForm.labelId || "--" }}</span>
          </a-form-model-item>
        </template>
        <!-- 自定义信息 -->
        <template title="自定义信息">
          <div v-show="detailFormCustomNew.length">
            <h1 class="h1_wxt">自定义信息</h1>
            <a-form-model ref="customRef" :model="addUserFormT" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="right">
              <a-form-model-item class="modal-form-text" v-for="(item, index) in formCustomNew" :key="index" :label="item.label" :prop="item.prop">
                <span class="modal-form-text-main">{{ item.value }}</span>
              </a-form-model-item>
            </a-form-model>
          </div>
        </template>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="cancelResignedDetail">返回</a-button>
    </template>
  </CommonModal>
</template>

<script>
import deImg from "@/assets/images/overview/touxiangtong.svg";
import getDictionaryItemObj from "@/utils/dictionary";
import { cloneDeep } from "lodash";
export default {
  model: {
    prop: 'resignedDetail',
  },
  props: ["detailFormData", "detailFormCustomNew", "resignedDetail"],
  data() {
    return {
      getDictionaryItemObj,
      formCustomNew: [],
      addUserFormT: [],
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      deImg,
      detailForm: {},
    };
  },
  methods: {
    // 处理默认信息
    initdetailForm() {
      let detailForm = cloneDeep(this.detailFormData)
      let deptAndPositionArr = []
      detailForm.deptAndPositionDtos.forEach(item => {
        let deptName = item.deptName ? '/' + item.deptName : ''
        let positionName = item.positionName ? '_' + item.positionName : ''
        let deptAndPositionStrItem = detailForm.companyName + deptName + positionName
        deptAndPositionArr.push(deptAndPositionStrItem)
      })
      detailForm.deptAndPositionStr = deptAndPositionArr.join('，')
      this.detailForm = detailForm
    },
    // 头像预览
    previewImg() {
      let imageUrl = this.detailForm.profilePath ? this.detailForm.profilePath : deImg
      this.$hevueImgPreview(imageUrl);
    },
    // 处理自定义信息
    formCustomThing() {
      let newArr = [];
      let newArrTwo = {};
      let newArrS = {};
      this.detailFormCustomNew.forEach((item) => {
        newArr.push({
          label: item.cnName,
          prop: item.customeFieldsId,
          required: item.required,
          value: item.value || "--",
        });

        newArrTwo[item.customeFieldsId] = item.value || "";

        newArrS[item.customeFieldsId] = [
          {
            required: item.required == 1 ? true : false,
            message: `请输入${item.cnName}`,
          },
        ];
      });
      this.formCustomNew = newArr; //处理后形成 新数组
      this.addUserFormT = newArrTwo; //处理后形成 存储表单每一项数组
    },
    // 关闭弹窗
    cancelResignedDetail() {
      this.$emit('input', false)
    },
  },
  watch: {
    detailFormCustomNew(newVal) {
      if (newVal) {
        this.initdetailForm()
        this.formCustomThing();
      }
    },
  },
};
</script>

<style lang='less' scoped>
.h1_wxt {
  font-size: 14px;
  margin-bottom: 30px;
}
.ant-form-text-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
    }
  }
}
.modal-form-text {
  .modal-form-text-main {
    line-height: 1.5;
    transform: translateY(-4px);
    display: inline-block;
  }
}
@media screen and (max-width: 1366px) {
  .modal-form-text {
    .modal-form-text-main {
      transform: translateY(-2px);
    }
  }
}
</style>