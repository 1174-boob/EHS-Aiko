<template>
  <div class="coupon-active">
    <!-- 激活优惠券 -->
    <a-form-model ref="couponActiveForm" :model="couponActiveForm" :rules="couponActiveFormRules" :labelCol="{ span: 2 }" :wrapperCol="{ span: 14 }" class="clx-from coupon-active-form">
      <a-form-model-item :label="showLable?'激活优惠券':''" prop="code">
        <a-input class="coupon-search-item" @blur="couponActiveBlur" v-model="couponActiveForm.code" :maxLength="couponIdMaxLength" placeholder="请输入12位优惠券编码"></a-input>
        <a-button type="primary" style="margin-left:10px" :loading="loading" @click="iActive">激活</a-button>
      </a-form-model-item>
    </a-form-model>

    <!-- 激活成功 -->
    <CustomModel :serviceModelShow="couponActiveSuccessModelShow" :headerTitle="'激活成功！'">
      <div class="coupon-active-success">
        <div class="coupon-active-success-item">
          <CouponItem :isModel="true" :title="'双十一打折券'" :couponItem="couponItem" />
        </div>
        <div class="coupon-active-success-btn">
          <a-button type="primary" @click="closeCouponActiveSuccessModelShow">确定</a-button>
        </div>
      </div>
    </CustomModel>
  </div>
</template>

<script>
import fromMaxLength from "@/mixin/fromMaxLength";
import cancelLoading from '@/mixin/cancelLoading'
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js"
import { couponActiveApi, } from '@/services/api'
import CustomModel from '@/components/customModel/customModel'
import CouponItem from '@/components/couponItem/couponItem.vue'
export default {
  components: { CustomModel, CouponItem },
  props: {
    showModel: {
      type: Boolean,
      default: true,
    },
    showLable: {
      type: Boolean,
      default: true,
    }
  },
  mixins: [fromMaxLength, cancelLoading],
  data() {
    return {
      couponActiveForm: {
        code: undefined,
      },
      couponActiveFormRules: {
        code: [
          { required: true, validator: formValidator.texTcouponActive, trigger: "blur", }
        ],
      },
      // 激活的优惠券信息
      couponItem: {},
      // 激活失败-次数过多
      couponActiveSuccessModelShow: false,
      ifAllFail: false,
      // 激活失败-次数过多
      couponActiveFailModelShow: false,
      ifAllFail: false,
    }
  },
  methods: {
    // 优惠券编码转大写
    // codeToUpperCase() {
    //   this.couponActiveForm.code = this.couponActiveForm.code.toUpperCase()
    // },
    // 激活
    iActive() {
      if (formValidator.formAll(this, 'couponActiveForm')) {
        let apiData = { ...this.couponActiveForm }
        couponActiveApi(apiData)
          .then(res => {
            let couponItem = res.data
            couponItem.active = true
            this.couponItem = couponItem
            // 激活成功
            if (this.showModel) {
              this.couponActiveSuccessModelShow = true;
            } else {
              this.$antMessage.success("激活成功");
            }
            this.$emit('couponActiveSuccess', couponItem)
          })
          .catch(err => {
            // console.log('激活', err);
            this.openCouponActiveFailModelShow(err.message)
          })
      }
    },
    // 失去焦点触发
    couponActiveBlur(e) {
      let value = e.target.value
      if (value === '') {
        Promise.resolve()
          .then(() => {
            formValidator.clearFormItemValidate(this, 'code', 'couponActiveForm')
          })
      }
    },
    // 激活成功
    openCouponActiveSuccessModelShow() {
      this.couponActiveSuccessModelShow = true;
    },
    closeCouponActiveSuccessModelShow() {
      this.couponActiveSuccessModelShow = false;
    },
    // 激活失败-次数过多
    openCouponActiveFailModelShow(content) {
      this.$antWarning({
        title: '激活失败！',
        content,
        okText: '确认',
      });
    },
    closeCouponActiveFailModelShow() {
      this.couponActiveFailModelShow = false;
    },
  },
}
</script>

<style lang="less">
.coupon-active {
  .coupon-active-form {
    .coupon-search-item {
      width: 270px;
    }
    .ant-form-item-required::before {
      display: none !important;
    }
    .ant-form-item-label {
      width: auto !important;
    }
  }
}
// 激活成功
.coupon-active-success {
  display: flex;
  flex-direction: column;
  .coupon-active-success-item {
    margin-top: 50px;
  }
  .coupon-active-success-btn {
    margin-top: 47px;
    display: flex;
    justify-content: center;
  }
}
// 服务激活失败-次数过多评价
.coupon-active-fail {
  display: flex;
  flex-direction: column;
  align-items: center;
  & > span {
    margin: 10px 0 40px;
    font-size: 24px;
    color: #fc3838;
    font-weight: 400;
  }
}
</style>
