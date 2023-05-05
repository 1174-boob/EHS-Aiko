<template>
  <div :class="isModel?'coupon-item-box-px':'coupon-item-box-rem'">
    <div class="coupon-item" :class="[couponItem.active ? 'pay-coupon-main-active' : '',disabled?'coupon-disabled':'']">
      <span class="title" v-if="showTitle && couponItem.couponName">{{couponItem.couponName}}</span>
      <!-- 左侧 -->
      <div class="pay-coupon-main-left">
        <img src="@/assets/order/pay-left-bg-active.png" v-if="couponItem.active" />
        <img src="@/assets/order/pay-left-bg.png" v-else />
        <!-- type  2是折扣，1是满减 -->
        <div class="pay-coupon-main-left-top">
          <!-- 满减 -->
          <span v-if="couponItem.type == 1" class="pay-coupon-main-left-top-amount">
            <span class="pay-coupon-main-left-top-amount-number">{{ amountFilter(couponItem.amount).amountFilter }}</span>
            <span v-if="amountFilter(couponItem.amount).unit">{{ amountFilter(couponItem.amount).unit }}</span>元
          </span>
          <!-- 折扣 -->
          <span v-else class="pay-coupon-main-left-top-discount">
            <span>{{ couponItem.discount / 10}}</span>折
          </span>
        </div>
        <div class="pay-coupon-main-left-bottom">
          <span>满{{couponItem.minBuyAmount | amountFilter}}元使用</span>
        </div>
      </div>
      <!-- 中间 -->
      <div class="pay-coupon-main-center">
        <img src="@/assets/order/pay-center-bg-active.png" v-if="couponItem.active" />
        <img src="@/assets/order/pay-center-bg.png" v-else />
      </div>
      <!-- 右侧 -->
      <div class="pay-coupon-main-ritht">
        <img src="@/assets/order/pay-right-bg-active.png" v-if="couponItem.active && !couponItem.activeSel" />
        <img src="@/assets/order/pay-right-bg-active-sel.png" v-else-if="couponItem.active && couponItem.activeSel" />
        <img src="@/assets/order/pay-right-bg.png" v-else />
        <span>{{couponItem.couponId}}</span>
        <span ref="productList" :title="productList" class="pay-coupon-main-ritht-pro">适用产品：{{productList}}</span>
        <span ref="effectiveDate">有效期：{{ couponItem.validityStart | iDate }}至{{couponItem.validityEnd | iDate}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import dayJs from "dayjs";
export default {
  props: {
    isModel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    couponItem: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      productList: '',
    }
  },
  filters: {
    // 格式化时间
    iDate(val) {
      return dayJs(val).format("YYYY-MM-DD");
    },
  },
  mounted() {
    this.$refs.productList.style.width = this.$refs.effectiveDate.clientWidth + 'px'
    // 1部分、2全部
    this.productList = this.couponItem.useType == 2 ? '全部' : this.couponItem.useProductName
  },
  methods: {
    // 格式化价格
    amountFilter(value) {
      let k = 10000
      let twoEnd = 100
      let amountFilterObj = { amountFilter: '', unit: '' }
      if (Number(value) < k) {
        amountFilterObj.amountFilter = value
      } else {
        amountFilterObj.amountFilter = Math.floor((value * twoEnd / k)) / twoEnd
        amountFilterObj.unit = '万'
      }
      return amountFilterObj
    }
  },
}
</script>

<style lang="less" scoped>
@import "./couponItemPx.less";
@import "./couponItemRem.less";
.coupon-disabled {
  cursor: not-allowed !important;
}
</style>
