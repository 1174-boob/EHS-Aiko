<template>
  <!-- 步骤条组件 -->
  <div class="step-box">
    <span v-for="item in stepList" :key="item.step" :class="step >= item.step ? 'active' : ''">{{item.step}}/{{item.text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepList: {
      type: Array,
      default: () => [
        {
          step: 1,
          text: '步骤1',
        },
        {
          step: 2,
          text: '步骤2',
        },
      ]
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
@baseHeight: 0.42rem;
.step-box {
  width: 100%;
  color: #2c3e50;
  box-sizing: border-box;
  display: flex;
  margin-bottom: 0.3rem;
  & > span {
    flex: 1;
    height: @baseHeight;
    padding-left: 0.6rem;
    margin-right: 0.2rem;
    background: #f1f2f9;
    position: relative;
    font-size: 0.16rem;
    line-height: @baseHeight;
    color: #999999;
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: @baseHeight / 2 solid;
      border-color: transparent transparent transparent #f1f2f9;
      position: absolute;
      right: -@baseHeight;
    }
    &:nth-child(2),
    &:nth-child(3) {
      padding-left: 1rem;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border: @baseHeight / 2 solid;
        border-color: transparent transparent transparent #fff;
        position: absolute;
        left: 0px;
      }
    }
  }
  .active {
    background: #eef2ff;
    color: #0067cc;
    &:before {
      border-color: transparent transparent transparent #eef2ff;
    }
  }
}
</style>
