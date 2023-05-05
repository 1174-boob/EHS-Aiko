<template>
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <div class="baseInfo">
            <a-row type="flex"
                   justify="space-around">
                <a-col :span="10"
                       class="my-col">
                    所属组织：{{baseInfo.corporationName||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    部门： {{baseInfo.deptName||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    设备ID： {{baseInfo.equipmentCode||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    设备名称：{{baseInfo.equipmentName||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    设备类型：{{baseInfo.equipmentType||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    区域： {{baseInfo.equipmentRegion||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    设备量产时间：{{baseInfo.equipmentProductionDate||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    初次认证时间：{{baseInfo.initialCertificationDate||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    本次认证时间：{{baseInfo.thisCertificationConclusion||'--'}}
                </a-col>

                <a-col :span="10"
                       class="my-col">
                    本次认证有效期：{{baseInfo.securityCertificationCycle||'--'}}年
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    本次认证结论：{{commonInfo.thisCertificationConclusion==1?'合格':'不合格'||'--'}}
                </a-col>
                <a-col :span="10"
                       v-if="commonInfo.thisCertificationConclusion==2"
                       class="my-col">
                    不合格原因：{{commonInfo.unqualifiedReason||'--'}}
                </a-col>
                <a-col :span="10"
                       v-else
                       class="my-col">

                </a-col>
                <a-col :span="10"
                       class="my-col">
                    设备担当部门认证人：{{baseInfo.responsibilityName||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    动力部门认证人：{{baseInfo.corporationId||'--'}}
                </a-col>
                <a-col :span="22"
                       class="my-col">
                    技安环保认证人：{{baseInfo.corporationId||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    厂商名称：{{baseInfo.manufacturerName||'--'}}
                </a-col>
                <a-col :span="10"
                       class="my-col">
                    厂商认证人：{{baseInfo.manufacturerAuthenticator||'--'}}
                </a-col>
                <a-col :span="22"
                       class="my-col">
                    认证报告：
                    <a-button class="m-l-15"
                              type="link"
                              @click="handleDow">认证报告.pdf</a-button>
                </a-col>
            </a-row>
            <div class="floor">
                <div>

                    <a-button class="m-l-15"
                              @click="handleBack">返回</a-button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import { recordDetails } from "@/services/deviceSafety.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import { getPortraitUrlt } from "@/services/api.js";
import StaffOrDept from "@/components/staffOrDept";
import dayJs from "dayjs";
export default {
    data () {
        return {
            countInfo: {},
            curIndex: null,
            //弹框
            loading: false,
            baseInfo: {},
            certificationId: null,
            commonInfo: {}
        };
    },
    components: {},
    computed: {},
    created () {
        this.certificationId = this.$route.query.Id
        this.initData()
    },
    methods: {

        initData () {
            recordDetails({ certificationId: this.certificationId }).then(res => {
                this.baseInfo = res.data.equipmentAccountVo
                this.commonInfo = res.data

            })
        },
        handleBack () {
            // this.$router.push({
            //     path: "/safeManage/deviceSafeManage/deviceSafety/authRecord",
            // });
            this.$router.back()
        },
        handleDow () {
            //baseInfo.certificationReport
            console.log('111111111')
            getPortraitUrlt([this.baseInfo.certificationReport]).then((res) => {
                if (res.data[0]) {
                    console.log(res.data[0].filePath);
                    window.open(res.data[0].filePath);
                }
            });
        }
    },
};
</script>

<style lang="less" scoped>
.download {
    padding: 20px 0;
}
.baseInfo {
    padding: 30px 0;
    .bottom {
        margin-top: 30px;
    }
}
.my-col {
    margin: 20px 0;
}
.floor {
    width: 100%;
    height: 62px;
    background: #f9f9f9;
    border: 1px solid #f6fbff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    > div {
        padding-right: 20px;
        > span {
            width: 20px;
            display: inline-block;
        }
    }
}
</style>