<template>
    <div class="form-wrapper">
        <h2 class="page-title">表单的标题</h2>
        <div class="form-content">
            <a-form-model ref="ruleForm" :model="extensionForm" :rules="extensionRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item label="姓名" prop='realName'>
                            <a-input v-model="extensionForm.realName" placeholder="请填写真实姓名"/>
                        </a-form-model-item>
                        <a-form-model-item label="电话" prop='phone'>
                            <a-input v-model.trim="extensionForm.phone" placeholder="请填写手机号码"/>
                        </a-form-model-item>
                        <a-form-model-item label="树结构" prop='tree'>
                            <!-- allow-clear 清除选中 -->
                            <!-- multiple 可多选 -->
                            <!-- tree-checkable 是否有多选框 -->
                            <!-- tree-default-expand-all 默认展开全部 -->
                            <a-tree-select
                                v-model="extensionForm.tree"
                                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                placeholder="请选择"
                                :tree-data="treeData"
                                allow-clear
                                multiple
                                tree-checkable
                                tree-default-expand-all
                            >
                            </a-tree-select>
                        </a-form-model-item>
                        <a-form-model-item label="证件类型" prop="cardType">
                            <a-select v-model="extensionForm.cardType" placeholder="请选择证件类型">
                                <a-select-option v-for="item in legalType" :key="item.key-0" :value="item.key-0">{{item.value}}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="证件号码" prop="cardNo">
                            <a-input v-model.trim="extensionForm.cardNo" placeholder="请输入证件号码" />
                        </a-form-model-item>
                        <a-form-model-item label="证件有效期" prop="lperiod" ref="lperiod">
                            <div style="position: relative;display: flex;">
                                <a-range-picker
                                    style="width:78%;"
                                    :disabled="extensionForm.lforever"
                                    separator="至"
                                    class="contract-search-left-item"
                                    v-model="extensionForm.lperiod"
                                    @change="() => {$refs.lperiod.onFieldChange()}"
                                >
                                    <a-icon slot="suffixIcon" type="calendar" />
                                </a-range-picker>
                                <a-checkbox v-model="extensionForm.lforever" @change.stop="longTimeChange" style="width:20%;margin-left:3%;">长期</a-checkbox>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="证件照片" prop="lcertificateIdCard">
                            <div class="ecertificateFileId-main">
                                <upload-solt
                                    :width="'160px'"
                                    :height="'114px'"
                                    :isImg="true"
                                    :handleSuccessName="'setLcertificateBackFileId'"
                                    @setLcertificateBackFileId="setLcertificateBackFileId"
                                    :imageUrl="extensionForm.idCardA"
                                    :showUploadList="false"
                                    :typeText="'正面'"
                                    @click="previewImg(extensionForm.idCardA)"
                                ></upload-solt>
                                <upload-solt
                                    :width="'160px'"
                                    :height="'114px'"
                                    :isImg="true"
                                    :handleSuccessName="'setLcertificateFrontFileId'"
                                    @setLcertificateFrontFileId="setLcertificateFrontFileId"
                                    :imageUrl="extensionForm.idCardB"
                                    :showUploadList="false"
                                    style="margin-left:20px;"
                                    :typeText="'反面'"
                                    @click="previewImg(extensionForm.idCardB)"
                                ></upload-solt>
                            </div>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="开户行" prop='openBank'>
                            <a-input v-model="extensionForm.openBank" placeholder="请输入开户行"/>
                        </a-form-model-item>
                        <a-form-model-item label="银行卡号" prop='bankNo'>
                            <a-input v-model="extensionForm.bankNo" placeholder="请输入银行卡号（银行卡信息用于激励现金收款账号）"/>
                            <!-- <span class="main-tishi">银行卡信息用于激励现金收款账号</span> -->
                        </a-form-model-item>
                        <a-form-model-item label="推广身份" prop='promoteType'>
                            <a-radio-group v-model="extensionForm.promoteType">
                                <a-radio value="1">BOE员工</a-radio>
                                <a-radio value="2">非BOE员工</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </div>
        <div class="btn-content">
            <a-button type="primary">提交</a-button>
            <a-button>取消</a-button>
        </div>
        <!-- <editor-bar></editor-bar>  -->
    </div>
</template>

<script>
import uploadSolt from '@/components/upload/uploadSolt.vue'
// import dictionary from '@/utils/dictionary';
import dayJs from 'dayjs';
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
    components: { uploadSolt},
    data() {
        return {
            dialogShow: false,
            bankShow: false,
            userCps: null,
            // companyStatus:null, //1未认证 2认证中 3已认证 4未通过 5资料不全
            // 勾选
            checked: false,
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
            fromType: '1',
            extensionForm: {
                realName:'',
                phone:'',
                cardType: undefined, //证件类型
                cardNo: '', //证件号码
                lforever: false, //长期
                cardTimeType: 1,
                lperiod: [],  //证件有效期
                lcertificateIdCard: ['', ''], // 0正面--- 1反面
                idCardA: '',//正面url
                idCardB: '',//反面url
                openBank:'', //开户行
                bankNo:'', //银行卡号
                promoteType:'1', //是否BOE员工
            },
            legalType: [], //证件类型
            promoteInfoId: null,
            tree:'',
            treeData: [
                {
                    title: 'Node1',
                    value: '0-0',
                    key: '0-0',
                    children: [
                    {
                        title: 'Child Node1',
                        value: '0-0-0',
                        key: '0-0-0',
                    },
                    ],
                },
                {
                    title: 'Node2',
                    value: '0-1',
                    key: '0-1',
                    children: [
                    {
                        title: 'Child Node3',
                        value: '0-1-0',
                        key: '0-1-0',
                        disabled: true,
                    },
                    {
                        title: 'Child Node4',
                        value: '0-1-1',
                        key: '0-1-1',
                    },
                    {
                        title: 'Child Node5',
                        value: '0-1-2',
                        key: '0-1-2',
                    },
                    {
                        title: 'Child Node6',
                        value: '6',
                        key: '6',
                    },
                    ],
                },
            ]
        }
    },
    computed: {
        extensionRules() {
            // 证件信息
            let cardNo = undefined
            switch (this.extensionForm.cardType - 0) {
                case 1:
                cardNo = [
                    { required: true, validator: formValidator.texTidCard, trigger: 'blur', },
                ]
                break;
                case 2:
                cardNo = [
                    { required: true, validator: formValidator.texTidCardOuther, trigger: 'blur', text: { title: '港澳居民往来内地通行证', length: 11 } },
                ]
                break;
                case 3:
                cardNo = [
                    { required: true, validator: formValidator.texTidCardOuther, trigger: 'blur', text: { title: '台湾居民往来大陆通行证', length: 10 } },
                ]
                break;
                case 4:
                cardNo = [
                    { required: true, validator: formValidator.texTidCardOuther, trigger: 'blur', text: { title: '外国人永久居留身份证', length: 18 } },
                ]
                break;
                case 5:
                cardNo = [
                    { required: true, validator: formValidator.texTidCardOuther, trigger: 'blur', text: { title: '港澳台居民居住证', length: 18 } },
                ]
                break;
                case 6:
                cardNo = [
                    { required: true, validator: formValidator.texTidCardOuther, trigger: 'blur', text: { title: '护照', length: 9 } },
                ]
                break;
                default:
                cardNo = [
                    { required: true, message: '证件号码不能为空', trigger: 'blur', },
                ];
            }
            let extensionRules = {
                realName: [
                    { required: true, message: '姓名不能为空', trigger: 'blur'},
                ],
                tree: [
                    { required: true, message: '不能为空', trigger: 'change'},
                ],
                phone: [
                    { required: true, validator: formValidator.texTphoneNumber, trigger: 'blur'},
                ],
                cardType: [
                    { required: true, message: '证件类型不能为空', trigger: 'change' },
                ],
                cardNo,
                lperiod: [
                    { required: true, validator: formValidator.lperiod, trigger: 'change', text: '证件' },
                ],
                ecertificateFileId: [
                    { required: true, message: '证件照片不能为空', trigger: 'blur' },
                ],
                lcertificateIdCard: [
                    { required: true, validator: formValidator.lcertificateIdCard, trigger: 'blur', text: '证件照片' },
                ],
                openBank: [
                    { required: true, message: '开户行不能为空', trigger: 'change'},
                ],
                bankNo: [
                    { required: true, message: '银行卡号不能为空', trigger: 'change'},
                ],
                promoteType: [
                    { required: true, message: '推广身份不能为空', trigger: 'change'},
                ],
            }
            return extensionRules
        },
    },
    methods: {
        // 是否长期
        longTimeChange(sel) {
            if (this.extensionForm.lforever) {
                this.extensionForm.cardTimeType = 2;
                this.extensionForm.lperiod = ['', '']
                this.extensionForm.cardStartTime = '';
                this.extensionForm.cardEndTime = '';
            } else {
                this.extensionForm.cardTimeType = 1;
                this.extensionForm.cardStartTime = this.extensionForm.lperiod[0] ? dayJs(this.extensionForm.lperiod[0]).format('YYYY-MM-DD') : this.extensionForm.lperiod[0]
                this.extensionForm.cardEndTime = this.extensionForm.lperiod[1] ? dayJs(this.extensionForm.lperiod[1]).format('YYYY-MM-DD') : this.extensionForm.lperiod[1]
            }
            sel ? formValidator.clearFormItemValidate(this, 'lperiod', 'ruleForm') : ''
        },
        // 图片预览
        previewImg(imageUrl) {
            this.$hevueImgPreview(imageUrl)
        },
        // 设置证件照片--正面
        setLcertificateBackFileId(uploadData) {
            this.$set(this.extensionForm.lcertificateIdCard, 0, uploadData.id)
            this.extensionForm.idCardA = uploadData.url
            formValidator.clearFormItemValidate(this, 'lcertificateIdCard', 'ruleForm')
        },
        // 设置证件照片--反面
        setLcertificateFrontFileId(uploadData) {
            this.$set(this.extensionForm.lcertificateIdCard, 1, uploadData.id)
            this.extensionForm.idCardB = uploadData.url
            formValidator.clearFormItemValidate(this, 'lcertificateIdCard', 'ruleForm')
        },
    },
}
</script>

<style lang="less" scoped>
.form-wrapper {
    width: 100%;
    background: #fff;
    padding-bottom: 50px;
    overflow-y: auto;
    .page-title {
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        margin: 15px 0 30px;
    }
    .ecertificateFileId-main {
        position: relative;
        display: flex;

        .ecertificateFileId-item2 {
            margin-left: 20px;
            height: 114px;
            width: 160px;
            position: relative;
            & > img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .main-tishi {
        font-size: 12px;
        color: #ccc;
        margin-top: 5px;
        display: block;
        line-height: 16px;
    }
    .action-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        right: 0.18rem;
        padding-right: 0.5rem !important;
        height: 0.6rem;
        padding-left: 0.4rem !important;
        background: #fff;
        z-index: 1;
        ::v-deep .ant-checkbox-wrapper {
            display: inline-block;
            margin-right: 6px;
            line-height: 0.6rem !important;
        }
        .promotion-agreement {
            color: #0067cc;
            cursor: pointer;  
        }
    }
    ::v-deep .ant-input {
        color: #000;
    }
    .btn-content {
        display: flex;
        justify-content: center;
        padding: 20px 0;
        ::v-deep .ant-btn {
            margin-right: 50px;
        }
    }
}
.hover-box {
    padding: 10px 16px 4px;
    .fweight-p {
        font-weight: bold;
        font-size: 14px;
        margin: 0;
        text-align: center;
    }
    p {
        text-align: left;
        font-size: 12px;
    }
}
</style>