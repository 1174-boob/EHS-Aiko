<template>
  <div class="dataAdd-box">
    <h1>{{ detailobj.type == "add" ? "新增" : "编辑" }}</h1>
    <div class="f">
      <a-form class="forms" :form="form">
        <a-form-item label="前缀">
          <a-input class="one-input" :disabled="true" v-decorator="['attributionPrefix']" />
        </a-form-item>
        <a-form-item label>
          <!-- <a-input
            class="one-input"
            :disabled="true"
            v-decorator="['attributionPrefix']"
          />-->
        </a-form-item>
        <a-form-item label="模板名称">
          <a-input placeholder="请输入模板名称" v-decorator="[
              'templateName',
              {
                rules: [{ required: true, message: '请输入模板名称' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="产品型号">
          <a-input placeholder="请输入产品型号" v-decorator="[
              'productModel',
              {
                rules: [{ required: true, message: '请输入产品型号' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="行业">
          <a-input placeholder="请输入行业" v-decorator="[
              'industry',
              {
                rules: [{ required: true, message: '请输入行业' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="元数据对象类型" style="width: 3.8rem">
          <a-select placeholder="下拉选择" @change="handleSelectChange" v-decorator="['metadataObjectType']" style="width: 3.8rem">
            <a-select-option value="1">主动标识载体</a-select-option>
            <a-select-option value="2">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea height: style="width:3.8rem" v-decorator="['description']"
          class="text-a" placeholder="请输入描述简介" :auto-size="{ minRows: 5,
          maxRows: 6}" :maxLength="100"/>
        </a-form-item>
      </a-form>
    </div>
    <div class="next-box" v-show="showFlag == '0'">
      <a-button @click="back">取消</a-button>
      <a-button type="primary" @click="savebtn('next')" :loading="twoIslogging">下一步</a-button>
    </div>
    <div v-show="showFlag == '1'">
      <p class="size">
        <b>标识属性:</b>
        <a-button type="primary" html-type="submit" @click="showModal('add')" class="son-span">新增</a-button>
      </p>
      <a-table rowKey="propertyId" :columns="columns" :data-source="data" :pagination="false">
        <a slot="operation" slot-scope="text, record" class="as">
          <span @click="showModal('changes', record)">编辑</span>
          <span @click="confirm(record)">删除</span>
        </a>
        <span slot="readMethod" slot-scope="text">
          <span v-show="text == 0">私有</span>
          <span v-show="text == 1">公共</span>
        </span>
        <span slot="required" slot-scope="text">
          <span v-show="text == 0">否</span>
          <span v-show="text == 1">是</span>
        </span>
        <span slot="dataType" slot-scope="text">
          <span v-show="text == 1">字符串</span>
          <!-- <span v-show="text == 1">公共</span> -->
        </span>
      </a-table>
      <div class="paginations">
        <span class="total-span">共有{{ total }}条</span>
        <a-pagination
          style="margin-right: 0.1rem; display: inline-block"
          show-quick-jumper
          :current="pageNo"
          :pageSize="pageSize"
          :total="total"
          :hideOnSinglePage="total == 0 ? true : false"
          @change="onChangeTab"
        />
      </div>
      <div style="text-align: right; padding-right: 0.2rem; margin-bottom: 0.2rem">
        <a-button @click="back">返回</a-button>
        <a-button :loading="oneIslogging" style="margin: 0 0.15rem" @click="savebtn('save')">保存</a-button>

        <a-button type="primary" @click="savebtn('submits')">提交</a-button>
      </div>
    </div>
    <a-modal title="新增" :visible="visible" :footer="null" @cancel="handleCancel" :maskClosable="false">
      <a-form :form="formT" class="forms-data">
        <a-form-item label="中文名称">
          <a-input
            placeholder="请输入"
            v-decorator="[
              'nameCn',
              {
                rules: [
                  { required: true, message: '请输入中文名称' },
                  //{ validator: checkPhone },
                  {
                    pattern: /^[\u4e00-\u9fa5]{1,10}$/,
                    message: '只能输入中文',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="英文名称">
          <a-input
            placeholder="请输入"
            v-decorator="[
              'nameEn',
              {
                rules: [
                  { required: true, message: '请输入英文名称' },
                  {
                    pattern: /^[a-zA-Z]{1,20}$/,
                    message: '只能输入英文',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="数据类型">
          <a-select style v-decorator="['dataType']" placeholder="请输入" @change="handleSelectChange">
            <a-select-option value="1">字符串</a-select-option>
            <!-- <a-select-option value="female"> female </a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="最小长度">
          <a-input placeholder="请输入" v-decorator="[
              'minLength',
              {
                rules: [{ required: true, message: '请输入最小长度' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="最大长度">
          <a-input placeholder="请输入" v-decorator="[
              'maxLength',
              {
                rules: [{ required: true, message: '请输入最大长度' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="是否必填">
          <a-radio-group
            v-decorator="[
              'required',
              {
                rules: [{ required: true, message: '请输入是否必填' }],
                initalValue: '0',
              },
            ]"
          >
            <a-radio value="1" :defaultChecked="true">是</a-radio>
            <a-radio value="0" :defaultChecked="true">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="读取方式">
          <a-radio-group v-decorator="[
              'readMethod',
              {
                rules: [{ required: true, message: '请输入读取方式' }],
              },
            ]">
            <a-radio value="1">公共读</a-radio>
            <a-radio value="0">私有读</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-button style="margin-left: 35%" @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSubmitT" :loading="logging" style="margin-left: 0.2rem">确定</a-button>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "中文名称",
    dataIndex: "nameCn",
    key: "nameCn",
    align: "center",
    // scopedSlots: { customRender: "name" },
  },
  {
    title: "英文名称",
    dataIndex: "nameEn",
    key: "nameEn",
    width: 100,
    align: "center",
    ellipsis: true,
  },
  {
    title: "数据类型",
    dataIndex: "dataType",
    key: "dataType",
    align: "center",
    ellipsis: true,
    scopedSlots: { customRender: "dataType" },
  },
  {
    title: "最小长度",
    dataIndex: "minLength",
    align: "center",
    key: "minLength",
    ellipsis: true,
  },
  {
    title: "最大长度",
    align: "center",
    dataIndex: "maxLength",
    key: "maxLength",
    ellipsis: true,
  },
  {
    title: "读取方式",
    dataIndex: "readMethod",
    align: "center",
    key: "readMethod", //0私有，1公共
    ellipsis: true,
    scopedSlots: { customRender: "readMethod" },
  },
  {
    title: "是否必填",
    dataIndex: "required",
    align: "center",
    key: "required",
    ellipsis: true,
    scopedSlots: { customRender: "required" },
  },
  {
    title: "操作",
    dataIndex: "set",
    align: "center",
    key: "set",
    ellipsis: true,
    width: 120,
    scopedSlots: { customRender: "operation" },
  },
];

const typeobj = {
  0: "主动标识载体",
  1: "其他",
};

import {
  DraftDataList,
  SaveDataList,
  GetAttributeList,
  DetailDataList,
  AddAttributeList,
  UpdateDataList,
  DelAttributeList,
  ChangeAttributeList,
  DetailAttributeList,
} from "../../services/datatemplate";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;
let EnterprisePrefix = sessionStorage.getItem("EnterprisePrefix");

export default {
  data() {
    return {
      oneIslogging: false,
      twoIslogging: false,
      // threeIslogging: false,
      form: this.$form.createForm(this, { name: "datatemplateadd" }),
      formT: this.$form.createForm(this, { name: "datatemplateaddT" }),
      data: [],
      k: "",
      valdata: "",
      showFlag: "0", //0不显示1显示属性那个表格
      visible: false,
      confirmLoading: false,
      columns,
      step: 1,
      isAdd: "",
      value: "",
      flag: false,
      pageNo: 1,
      pageSize: 5,
      total: 0,
      detailobj: {},
      detailobjT: {},
      step: 1, //实例模板弹框-1添加2修改
      arrtobj: {},
      logging: false,
      templateIds: "", //新增页面的Id
    };
  },
  created() {
    this.getDetailObj();
  },
  methods: {
    async getAttributeList() {
      //获取属性列表
      let temp = "";
      if (this.detailobj.templateId === undefined) {
        temp = this.templateIds;
      } else {
        temp = this.detailobj.templateId;
      }
      let result = await GetAttributeList({
        templateId: temp,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });
      if (result.code == "20000") {
        this.data = result.data.list;
        this.total = result.data.total;
      }
    },
    handleSubmitT(e) {
      //属性-添加修改
      e.preventDefault();
      this.formT.validateFields(async (err, values) => {
        if (!err) {
          this.logging = true;

          if (this.step == "1") {
            //添加
            let temp = "";
            if (this.detailobj.templateId === undefined) {
              temp = this.templateIds;
            } else {
              temp = this.detailobj.templateId;
            }
            values = {
              ...values,
              companyId: companyId,
              templateId: temp,
            };
            let result = await AddAttributeList(values);
            if (result.code == "20000") {
              this.$antMessage.success("添加成功");
              this.getAttributeList();
              this.handleCancel();
              this.logging = false;
            } else {
              this.logging = false;

              //this.$antMessage.info(result.message) llll;
            }
          } else {
            //修改
            values = {
              ...values,
              propertyId: this.arrtobj.propertyId,
              templateId: this.detailobj.templateId,
            };
            let result = await ChangeAttributeList(values);
            if (result.code == "20000") {
              this.$antMessage.success("修改成功");
              this.getAttributeList();
              this.handleCancel();
              this.logging = false;
            } else {
              this.$antMessage.info(res.message);
              this.logging = false;
            }
          }
        }
      });
    },
    async getDetailObj() {
      let obj = this.$route.query;
      this.detailobj = obj;
      this.$nextTick(() => {
        this.form.setFieldsValue({ attributionPrefix: EnterprisePrefix });
      });
      if (obj.type == "change") {
        //回显
        this.showFlag = "1";
        let result = await DetailDataList({
          templateId: this.detailobj.templateId,
        });
        if (result.code == "20000") {
          this.detailobjT = result.data;
          this.$nextTick(() => {
            this.form.setFieldsValue({
              productModel: result.data.productModel,
            });
            this.form.setFieldsValue({
              templateName: result.data.templateName,
            });
            this.form.setFieldsValue({ industry: result.data.industry });
            this.form.setFieldsValue({ description: result.data.description });
            if (result.data.metadataObjectType == null) {
            } else {
              this.form.setFieldsValue({
                metadataObjectType: String(result.data.metadataObjectType),
              });
            }
          });
          this.getAttributeList();
          this.addflag = false;
        }
      } else if (obj.type == "add") {
        this.addflag = true;
        this.data = [];
      }
    },
    handleSelectChange() {
    },
    async savebtn(type) {
      if (type == "submits") {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            this.$antConfirm({
              title: "提交",
              content: "是否提交该数据模板，提交后无法修改？",
              okText: "确认",
              cancelText: "取消",
              maskClosable: false,
              onOk: async () => {
                //保存
                this.threeIslogging = true;
                let obj = values;
                for (var i in obj) {
                  if (obj[i] === undefined) {
                    obj[i] = "";
                  }
                }
                let temp = "";
                if (this.detailobj.templateId === undefined) {
                  temp = this.templateIds;
                } else {
                  temp = this.detailobj.templateId;
                }
                obj = { ...obj, companyId, templateId: temp };
                let result = await SaveDataList(obj);
                if (result.code == "20000") {
                  this.$antMessage.success("保存成功");
                  this.$router.push("datatemplate");
                  this.threeIslogging = false;
                } else {
                  this.threeIslogging = false;
                }
              },
            });
          }
        });
      } else if (type == "save") {
        //保存
        //更新类似于草稿

        this.form.validateFields(async (err, values) => {
          if (!err) {
            this.oneIslogging = true;
            let obj = this.form.getFieldsValue();
            let temp = "";
            if (this.detailobj.templateId === undefined) {
              temp = this.templateIds;
            } else {
              temp = this.detailobj.templateId;
            }
            for (var i in obj) {
              if (obj[i] === undefined) {
                obj[i] = "";
              }
            }
            obj = { ...obj, companyId, templateId: temp };
            let result = await UpdateDataList(obj);
            if (result.code == "20000") {
              this.$antMessage.success("保存成功");
              this.$router.push("datatemplate");
              this.oneIslogging = false;
            } else {
              this.oneIslogging = false;
            }
          }
        });
      } else if (type == "next") {
        //下一步
        //调用草稿接口
        this.twoIslogging = true;
        let obj = this.form.getFieldsValue();
        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = "";
          }
        }
        obj = { ...obj, companyId, templateId: this.detailobj.templateId };
        let result = await DraftDataList(obj);
        if (result.code == "20000") {
          this.showFlag = "1";
          this.templateIds = result.data.templateId;
          this.twoIslogging = false;
        } else {
          this.twoIslogging = false;
        }
      }
    },
    async showModal(type, record) {
      if (type == "add") {
        this.visible = true;
        this.step = "1";
      } else if (type == "changes") {
        if (this.detailobj.type == "change") {
          //如果添加的时候标识属性的编辑不想弹框则开启判断
          let result = await DetailAttributeList({
            propertyId: record.propertyId,
          });
          if (result.code == "20000") {
            this.step = "2";
            this.visible = true;
            this.arrtobj = record;
            this.$nextTick(() => {
              this.formT.setFieldsValue({
                nameCn: result.data.nameCn,
              });
              this.formT.setFieldsValue({
                nameEn: result.data.nameEn,
              });
              this.formT.setFieldsValue({ minLength: result.data.minLength });
              this.formT.setFieldsValue({ maxLength: result.data.maxLength });
              this.formT.setFieldsValue({
                required: String(result.data.required),
              });
              this.formT.setFieldsValue({
                readMethod: String(result.data.readMethod),
              });
              this.formT.setFieldsValue({
                dataType: String(result.data.dataType),
              });
            });
          }
        }
      }
    },
    handleCancel() {
      this.visible = false;
      this.formT.resetFields();
    },
    back() {
      this.$router.go(-1);
    },
    onChangeTab(pageNumber, pageSize) {
      this.pageSize = pageSize;
      this.pageNo = pageNumber;
      this.getAttributeList();
    },
    confirm(record) {
      this.$antConfirm({
        title: "删除",
        content: "是否删除此条数据？",
        okText: "确认",
        cancelText: "取消",
        maskClosable: false,
        onOk: async () => {
          let result = await DelAttributeList({
            propertyId: record.propertyId,
          });
          if (result.code == "20000") {
            //获取属性列表
            let temp = "";
            if (this.detailobj.templateId === undefined) {
              temp = this.templateIds;
            } else {
              temp = this.detailobj.templateId;
            }
            let result = await GetAttributeList({
              templateId: temp,
              pageNo: "1",
              pageSize: "5",
            });
            if (result.code == "20000") {
              this.data = result.data.list;
              this.total = result.data.total;
              this.pageNo = 1;
              this.pageSize = 5;
              this.$antMessage.success("删除成功");
            }
          }
        },
      });
    },
  },
};
</script>

<style lang='less' scoped>
.paginations {
  margin-bottom: 0.2rem;
  padding-right: 0.2rem;
}
.text-a {
  width: 3.8rem !important;
}
.as {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.dataAdd-box {
  width: 100%;
  height: 100%;
  padding-bottom: 0.2rem;
  .ant-form-item {
    display: flex !important;
  }
  .size {
    margin-top: 0.2rem;
    align-items: center;
    font-size: 14px;
    padding: 0 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    display: flex;
    button {
      margin-left: 0.1rem;
    }
  }
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 0.2rem 0.24rem 0.2rem 0rem;
    // border-bottom: 2px solid #f5f5f5;
  }
}
.dataAdd-box .forms {
  display: flex;
  flex-wrap: wrap;
  flex-direction: start !important;
}

.f {
  ::v-deep .ant-form-item-children {
    width: 3.8rem;
  }
  .ant-row {
    ::v-deep .ant-form-item-label {
      width: 1.8rem;
    }
  }
  .ant-form-item {
    width: 50% !important;
    .ant-col {
      width: 3.8rem;
    }
    .ant-form-item-control-wrapper {
      width: 3.8rem !important;
      div {
        input {
          width: 3.8rem !important;
        }
      }
    }
  }
  .ant-select-selection {
    width: 3.8rem !important;
  }
  .ant-input {
    width: 3.8rem;
  }
  .one-input {
    background: none;
    border: none;
    color: black;
  }
}

.forms-data {
  .ant-row {
    display: flex !important;
    align-items: flex-start !important;
    ::v-deep.ant-form-item-label {
      width: 35%;
    }
    ::v-deep.ant-form-item-control-wrapper {
      width: 40%;
    }
  }
}
::v-deep.son-span {
  span {
    color: #ffffff !important;
  }
}
.next-box {
  width: 100%;
  text-align: right;
  padding: 0.2rem;
  button {
    margin-left: 0.2rem;
  }
}
</style>