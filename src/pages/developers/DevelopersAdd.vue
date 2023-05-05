<template>
  <div class="devel-boxs">
    <h1>{{ detailobj.type == "add" ? "添加" : "修改" }}</h1>
    <div class="dev">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="名称">
          <a-input placeholder="请输入" v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入名称' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="应用ID">
          <a-input placeholder="请输入" v-decorator="[
              'applicationId',
              {
                rules: [{ required: true, message: '请输入应用ID' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea height: v-decorator="['description']" :maxLength="100"
          placeholder="请输入描述（最多100字）" :auto-size="{ minRows: 8,
          maxRows: 10 }" />
        </a-form-item>

        <a-form-item label>
          <a-button style="margin-left: 80px" @click="handleCancel">取消</a-button>
          <a-button :loading="logging" type="primary" style="margin-left: 10px" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { AddDevelopersList, ChangeDevelopersList } from "@/services/developers";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      value: "",
      logging: false,
      detailobj: {},
    };
  },
  mounted() {
    this.getDetailObj();
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.logging = true;
          if (this.detailobj.type == "add") {
            values = { ...values, companyId: companyId };
            let result = await AddDevelopersList(values);
            if (result.code == "20000") {
              this.$antMessage.success("添加成功");
              this.$router.push("developers");
              this.logging = false;
            } else {
              this.logging = false;
              //this.$antMessage.info(res.message) llll;
            }
          } else if (this.detailobj.type == "change") {
            values = {
              ...values,
              companyId: companyId,
              accountId: this.detailobj.accountId,
            };
            let result = await ChangeDevelopersList(values);
            if (result.code == "20000") {
              this.$antMessage.success("修改成功");
              this.$router.push("developers");
              this.logging = false;
            } else {
              this.logging = false;
              //this.$antMessage.info(res.message) llll;
            }
          }
        }
      });
    },
    handleCancel() {
      this.$router.push("developers");
    },
    back() {
      this.$router.go(-1);
      // this.form.
    },
    getDetailObj() {
      let obj = this.$route.query;
      this.detailobj = obj;
      if (obj.type == "change") {
        //回显
        this.form.setFieldsValue({ name: obj.name });
        this.form.setFieldsValue({ description: obj.description });
        this.form.setFieldsValue({ applicationId: obj.applicationId });
      }
    },
  },
};
</script>

<style lang='less' >
.devel-boxs {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;

  .ant-row {
    display: flex !important;
    align-items: flex-start;
  }
  h1 {
    font-size: 20px;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 20px 24px 20px 0px;
    border-bottom: 2px solid #f5f5f5;
  }
}
.dev {
  width: 490px;
  margin: 0 auto;
  padding-top: 80px;
  .ant-form-item-label {
    width: 80px !important;
  }
  .ant-col {
    width: 400px;
  }
}
</style>