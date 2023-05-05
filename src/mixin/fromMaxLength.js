/**
 * @author: 成礼雄
 * @description 表单长度
 */
const fromMaxLength = {
    data() {
        return {
            typeEnum: {
                1: '新增',
                2: '查看',
                3: '修改',
            },
            // 名称最长
            nameMaxLength: 20,
            // 编码最长
            codeMaxLength: 20,
            // 序号最长
            sortNoMaxLength: 8,
            // 数字最长
            numberMaxLength: 8,
            // 订单号最长
            orderNoMaxLength: 30,
            // 描述最长-文本域
            descriptionMaxLength: 100,
            // 密码最长
            psdMaxLength: 35,
            // 邮箱最长
            emailMaxLength: 35,
            // 订单最长
            contractMaxLengrh: 50,
            // 发票地址
            enterpriseAddressMaxLengrh: 200,
            // 发票开户行
            accountBankMaxLength: 20,
            // 证件代码
            ecertificateNumMaxLength: 100,
            // 服务评价
            workOrderTextareaMaxLength: 200,
            // 问题描述
            problemTextareaMaxLength: 999,
            // 优惠券编码
            couponIdMaxLength: 12,
            // 手机号
            phoneMaxLength: 11,
            // 角色描述
            roleDescriptionMaxLength: 50,
            // 工号
            jobNumberMaxLength: 50,
        }
    },
    methods: {

    },
};

export default fromMaxLength;