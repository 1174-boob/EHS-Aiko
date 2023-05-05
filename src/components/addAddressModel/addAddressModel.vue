<template>
  <a-modal centered title="新增收件地址" :visible="addAddressModel" :footer="null" @cancel="closeAddAddressModel" :maskClosable="false" destroyOnClose class="clx-model">
    <div class="clx-model-body beauty-scroll">
      <!-- 表单 -->
      <a-form-model ref="addAddressModelForm" :model="addAddressModelForm" :rules="addAddressModelRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item label="收件人姓名" prop="addressOwer" ref="addressOwer">
          <a-input :maxLength="nameMaxLength" v-model="addAddressModelForm.addressOwer" placeholder="请输入收件人姓名" />
        </a-form-model-item>
        <a-form-model-item label="所在地区" prop="address" ref="address">
          <a-cascader v-model="addAddressModelForm.address" :options="city" placeholder="请选择地区" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" prop="addressDetail" ref="addressDetail">
          <a-textarea v-model="addAddressModelForm.addressDetail" :maxLength="descriptionMaxLength" placeholder="请输入街道" />
        </a-form-model-item>
        <a-form-model-item label="邮政编码" prop="postalCode" ref="postalCode">
          <a-input :maxLength="nameMaxLength" v-model="addAddressModelForm.postalCode" placeholder="请输入邮政编码" />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="contactNumber" ref="contactNumber">
          <a-input :maxLength="11" v-model="addAddressModelForm.contactNumber" placeholder="请输入手机号" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- clx-model-btn -->
    <div class="clx-model-btn">
      <a-button type="dashed" @click="closeAddAddressModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="addAddressModelSubmit">提交</a-button>
    </div>
  </a-modal>
</template>

<script>
import fromMaxLength from "@/mixin/fromMaxLength";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import city from '@/components/company/cities.js'
import { contractAddAddress } from "@/services/api";
import cancelLoading from '@/mixin/cancelLoading'
export default {
  mixins: [fromMaxLength, cancelLoading],
  props: ['addAddressModel'],
  data() {
    return {
      city,
      // 新增、修改表单
      addAddressModelForm: {
        addressOwer: '',
        address: [],
        contactNumber: '',
        postalCode: '',
        addressDetail: '',
      },
      // 表单验证
      addAddressModelRules: {
        addressOwer: [
          { required: true, message: "收件人姓名不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: '所在地区不能为空', trigger: 'change' },
        ],
        addressDetail: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
        postalCode: [
          { required: false, message: "邮政编码不能为空", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, validator: formValidator.texTphoneNumber, trigger: "blur" },
        ],
      },
    }
  },
  methods: {
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        console.log(object);
        let dom = this.$refs[i]
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== '[object Object]') {
          dom = dom[0]
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({ // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: 'center',
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: 'smooth'
        })
        break // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 关闭新建地址model
    closeAddAddressModel() {
      this.$emit('closeAddAddressModel')
    },
    // 新增地址提交
    addAddressModelSubmit() {
      let isAll = true
      this.$refs['addAddressModelForm'].validate((valid, object) => {
        if (!valid) {
          this.scrollView(object)
          isAll = valid
        }
      })
      if (!isAll) return
      this.handleLoading()
      // 处理地址
      let addressProvince = this.addAddressModelForm.address[0]
      let addressCity = this.addAddressModelForm.address[1]
      let addressDistinct = this.addAddressModelForm.address[2]
      let apiData = { ...this.addAddressModelForm, address: undefined, addressProvince, addressCity, addressDistinct }
      contractAddAddress(apiData)
        .then(res => {
          apiData.addressId = res.data
          this.$emit('setAddressInfo', apiData)
          // 关闭新建地址model
          this.closeAddAddressModel()
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
  },
  watch: {
    addAddressModel(newVal) {
      if (!newVal) {
        setTimeout(() => {
          // 新增、修改表单
          this.addAddressModelForm = {
            addressOwer: '',
            address: [],
            contactNumber: '',
            postalCode: '',
            addressDetail: '',
          }
        }, 200);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.clx-model-body {
  margin-bottom: 20px;
}
</style>
