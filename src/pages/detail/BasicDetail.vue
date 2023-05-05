<template>
  <div class="basicdetail">
    <div class="top">
      <img src="../../assets/img/right.png" alt />
      <span>当前选中：{{ EnterprisePrefix }}</span>
    </div>
    <h1>
      <span class="colors"></span>
      标识属性
    </h1>
    <div class="basic">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="前缀:">
          <a-input
            placeholder="请输入前缀"
            :disabled="flag"
            style="color: black"
            v-decorator="[
              'attributionPrefix',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item v-for="item in formdatas" :label="item.nameCn" :key="item.propertyId">
          <!-- {{ 123 }} -->
          <a-input
            style="color: black"
            :disabled="flag"
            placeholder="请输入"
            v-decorator="[
              item.nameEn,
              {
                rules: [
                  {
                    required: item.required !== 0,
                    message: `请输入${item.nameCn}`,
                  },
                ],
              },
            ]"
          />
        </a-form-item>

        <a-form-item label>
          <a-button style="margin-left: 1rem" @click="back">返回</a-button>
          <a-button type="primary" style="margin-left: 0.2rem" html-type="submit" v-if="detailobj.type == 'change'">确认</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { DetailBasicList } from "../../services/basic";
let EnterprisePrefix = sessionStorage.getItem("EnterprisePrefix");
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      detailobj: {},
      flag: true,
      formdatas: [],
      EnterprisePrefix,
    };
  },
  created() {
    this.getDetailObj();
    this.getBasicDetailList();
  },
  methods: {
    async getBasicDetailList() {
      //实例模板获取新增里面的表单值
      let result = await DetailBasicList({
        handleId: this.detailobj.handleId,
      });
      if (result.code == "20000") {
        //设置回显
        this.formdatas = result.data.properties;
        let targ = {};
        let arr = result.data.properties.map((item) => {
          return `{"${item.nameEn}":"${item.propertyValue}"}`;
        });
        arr.forEach((element) => {
          let arrT = JSON.parse(element);
          targ = Object.assign(targ, arrT);
        });
        this.$nextTick(() => {
          this.form.setFieldsValue({
            attributionPrefix: result.data.attributionPrefix,
          });
          this.form.setFieldsValue(targ); //回显
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          // let result = await ChangeBasicList({
          //   handleId: this.detailobj.handleId,
          //   templateId: this.detailobj.templateId,
          //   companyId: "1412976006205149184",
          // });
          // if (result.code == "20000") {
          // }
        }
      });
    },
    back() {
      this.$router.go(-1); //返回上一层
    },
    getDetailObj() {
      let obj = this.$route.query;
      this.detailobj = obj;
      //this.form.setFieldsValue({});//回显
      if (obj.type == "change") {
        //修改输入框可编辑
        this.flag = false;
      } else if (obj.type == "look") {
        //查看输入框禁用
        this.flag = true;
      }
    },
  },
};
</script>

<style lang='less' >
.basicdetail {
  .ant-row {
    display: flex !important;
    align-items: center !important;
  }
}
.top {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.23rem 0.2rem 0.26rem 0px;
  border-bottom: 2px solid #f5f5f5;
  img {
    width: 0.2rem;
    height: 0.2rem;
    margin-right: 0.1rem;
  }
  span {
    width: 2.79rem;
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #0067cc;
  }
}
h1 {
  width: 100%;
  font-size: 0.18rem;
  font-family: FZLanTingHeiS-R-GB;
  font-weight: 400;
  color: #111111;
  padding-left: 0.1rem;
  margin-top: 0.2rem;
  height: auto;
  .colors {
    width: 0.04rem;
    height: 0.16rem;
    background: #005eba;
    border-radius: 0.01rem;
    display: inline-block;
  }
}
.basic {
  width: 4rem;
  margin: 0 auto;
  padding-top: 0.8rem;
  form {
    font-size: 0.12rem;
    .ant-form-item {
      div {
        label {
          font-size: 0.12rem;
        }
      }
    }
  }
  .ant-row {
    .ant-form-item-label {
      width: 1rem;
      color: #999999;
    }
    .ant-form-item-control-wrapper {
      div {
        input {
          border: none;
          outline: none;
          background: none;
        }
      }
    }
  }
}
</style>