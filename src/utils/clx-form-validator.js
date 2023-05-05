/**
 * @author: 成礼雄
 * @description 表单验证
 */
import dayJs from 'dayjs';
export class FormValidator {
    constructor() { }
    // 清除全部状态
    clearFormValidate = (that, name = "formValidate") => {
        that.$refs[name].fields.forEach((valid) => {
            valid.validateDisabled = '' //是否校验
            valid.validateState = '' //爆红状态
            valid.validateMessage = '' //爆红文字
        })
    }
    // 清除指定项状态
    clearFormItemValidate = (that, prop, name = "formValidate") => {
        that.$refs[name].fields.forEach((valid) => {
            if (valid.prop == prop) {
                valid.validateDisabled = '' //是否校验
                valid.validateState = '' //爆红状态
                valid.validateMessage = '' //爆红文字
            }
        })
    }
    // 为指定项添加状态以及文字
    handleFormItemValidateText = (that, prop, errText, name = "formValidate") => {
        that.$refs[name].fields.forEach((valid) => {
            if (valid.prop == prop) {
                valid.validateDisabled = false //是否校验
                valid.validateState = 'error' //爆红状态
                valid.validateMessage = errText //爆红文字
            }
        })
        return false
    }
    // 验证指定项状态
    formItemValidate = (that, prop, name = "formValidate") => {
        let flag = false
        that.$refs[name].fields.forEach((valid) => {
            if (valid.prop == prop) {
                // console.log(valid);
                // valid.validateDisabled = '' //是否校验
                // valid.validateState = '' //爆红状态
                // valid.validateMessage = '' //爆红文字
                // let all = false
                // that.$refs[name].validate((valid) => {
                //     console.log("ccccccccccc==",valid,Boolean(valid));
                //     all = Boolean(valid)
                // })
                // return all
                that.$refs[name].validateField([prop], (Error) => {
                    if (!Error) {
                        flag = true
                    } else {
                        flag = false
                    }
                })
            }
        })
        return flag
    }
    // 表单验证
    formAll = (that, name = "formValidate") => {
        let all = false
        that.$refs[name].validate((valid) => {
            all = Boolean(valid)
        })
        return all
    }
    // 获取形参
    ruleInfo = (rule) => {
        let required = rule.required
        let text = rule.text
        let that = rule.that
        return { required, text, that }
    }
    // 普通文字
    texTiText = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error(`${text}不能含有空格`));
        } else {
            callback();
        }
    }
    // 评分
    texTscoreNum = (rule, value, callback) => {
        let { required } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`评分不能为空`)) : callback();
        } else if (value - 0 === 0) {
            required ? callback(new Error(`评分不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 激活-优惠券
    texTcouponActive = (rule, value, callback) => {
        let { required } = rule
        let re = new RegExp(`^[A-Z]{4}[0-9]{8}$`)
        if (!value && value !== 0) {
            required ? callback(new Error(`请输入12位优惠券编码`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`请输入12位(4位大写英文+8位数字)优惠券编码`));
        } else {
            callback();
        }
    }
    //仅英文和数字
    onlyNumberEnglish = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let re = /^([A-Z]|[a-z]|[\d])*$/
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`${text}格式错误`));
        } else {
            callback();
        }
    }

    texTcouponActive = (rule, value, callback) => {
        let { required } = rule
        let re = new RegExp(`^[A-Z][0-9]$`)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`请输入12位(4位大写英文+8位数字)优惠券编码`));
        } else {
            callback();
        }
    }
    // 时间
    texTiDate = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 包含0的非负整数
    texTonlyNumberContainZero = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let re = /^([0]|[1-9][0-9]*)$/
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`${text}只能为非负整数`));
        } else {
            callback();
        }
    }
    // 大于0的正整数
    texTonlyNumber = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let re = /^[1-9]+[0-9]*$/
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`${text}只能为大于0的整数`));
        } else {
            callback();
        }
    }
    // 仅数字
    onlyNumber = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let re = /^\d+[.]?\d*$/
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`${text}只能为数字`));
        } else {
            callback();
        }
    }
    // 仅英文
    onlyEnglish = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let re = /^[a-zA-Z]+$/
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`${text}只能为英文字母`));
        } else {
            callback();
        }
    }
    // 两位小数
    texTonlyNumberPreTwo = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 百分号
    texTonlyNumberPer = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error(`${text}不能含有空格`));
        } else {
            callback();
        }
    }
    // 手机号
    texTphoneNumber = (rule, value, callback) => {
        let { required } = this.ruleInfo(rule)
        var re = /^1[3456789]\d{9}$/
        if (!value && value !== 0) {
            required ? callback(new Error('手机号不能为空')) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error('手机号不能含有空格'));
        } else if (!re.test(value)) {
            callback(new Error('请输入格式正确的手机号'));
        } else {
            callback();
        }
    }
    // 电话
    texTtelephoneNumber = (rule, value, callback) => {
        let { required } = this.ruleInfo(rule)
        var re = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
        if (!value && value !== 0) {
            required ? callback(new Error('电话不能为空')) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error('电话不能含有空格'));
        } else if (!re.test(value)) {
            callback(new Error('请输入格式正确的电话'));
        } else {
            callback();
        }
    }
    // 身份证号
    texTidCard = (rule, value, callback) => {
        let { required } = this.ruleInfo(rule)
        let re = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (!value && value !== 0) {
            required ? callback(new Error('身份证号不能为空')) : callback();
        } else if (value.indexOf(' ') != -1) {
            callback(new Error('身份证号不能包含空格'));
        } else if (!re.test(value)) {
            callback(new Error('请输入格式正确的身份证号'));
        } else {
            callback();
        }
    }
    // 税号
    texTinvoiceTaxNumber = (rule, value, callback) => {
        let { required } = this.ruleInfo(rule)
        let re = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/
        if (!value && value !== 0) {
            required ? callback(new Error('发票税号不能为空')) : callback();
        } else if (!re.test(value)) {
            callback(new Error('请输入格式正确的发票税号'));
        } else {
            callback();
        }
    }
    // 银行卡 通用
    texTaccountNo = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let re = /^[0-9]{10,30}$/
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`请输入格式正确的${text}`));
        } else {
            callback();
        }
    }
    // 港澳居民通行证
    texTidCardOuther = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        let { title, length } = text
        if (!value && value !== 0) {
            required ? callback(new Error(`${title}不能为空`)) : callback();
        } else if (value.indexOf(' ') != -1) {
            callback(new Error(`${title}不能包含空格`));
        } else if (value.length !== length) {
            callback(new Error(`${title}需要为${length}位`));
        } else {
            callback();
        }
    }
    // 密码
    texTiPassword = (rule, value, callback) => {
        // let re = /^[^\u4e00-\u9fa5]{6,16}$/
        let re = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
        let { required } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`密码不能为空`)) : callback();
        } else if (!re.test(value)) {
            callback(new Error(`密码格式不正确`));
        } else {
            callback();
        }
    }
    // 确认密码
    texTiPasswordAgain = (rule, value, callback) => {
        let { required, that } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`确认密码不能为空`)) : callback();
        } else if (value !== that.formCode.newPassword) {
            callback(new Error(`确认密码需要和新密码相同`));
        } else {
            callback();
        }
    }
    // 下拉框单选
    texTiSelect = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 单选框
    texTiRadio = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 文本域
    texTiTextarea = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 富文本
    texTiWangEditor = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 普通账号  非中文
    texTiLoginId = (rule, value, callback) => {
        let re = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error(`${text}不能含有空格`));
        } else if (!re.test(value)) {
            callback(new Error(`${text}格式不正确`));
        } else {
            callback();
        }
    }
    // 图片url路径 文字
    texTimgUrl = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 身份证 有效期
    lperiod = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (value.length === 0) {
            required ? callback(new Error(`${text}有效期不能为空`)) : callback();
        } else if (dayJs(value[0]).diff(dayJs().format('YYYY-MM-DD'), 'day') > 0) {
            required ? callback(new Error(`开始日期不能选择未来日期`)) : callback();
        } else if (dayJs(value[1]).unix() < dayJs(dayJs().subtract(1, 'day')).unix()) {
            required ? callback(new Error(`${text}已过期`)) : callback();
        } else {
            callback();
        }
    }
    // 身份证 正反面
    lcertificateIdCard = (rule, value, callback) => {
        let { required, text } = this.ruleInfo(rule)
        if (value[0] === '' && value[1] === '') {
            console.log(1111);
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value[0] === '') {
            required ? callback(new Error(`${text}正面不能为空`)) : callback();
        } else if (value[1] === '') {
            required ? callback(new Error(`${text}反面不能为空`)) : callback();
        } else {
            callback();
        }
    }
    // 经度
    texTilng = (rule, value, callback) => {
        let re = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error(`${text}不能含有空格`));
        } else if (!re.test(value)) {
            callback(new Error(`经度整数部分为0-180,小数部分为0到6位`));
        } else {
            callback();
        }
    }
    // 纬度
    texTilat = (rule, value, callback) => {
        let re = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
        let { required, text } = this.ruleInfo(rule)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error(`${text}不能含有空格`));
        } else if (!re.test(value)) {
            callback(new Error(`纬度整数部分为0-90,小数部分为0到6位`));
        } else {
            callback();
        }
    }
    // 限制输入框内容最大长度和最小长度
    limitLength = (rule, value, callback) => {
        console.log(rule)
        let maxLength = rule.maxLength;
        let minLength = rule.minLength;
        let { required, text } = this.ruleInfo(rule)
        console.log(required, text, maxLength, minLength)
        if (!value && value !== 0) {
            required ? callback(new Error(`${text}不能为空`)) : callback();
        } else if (value.indexOf(' ') !== -1) {
            callback(new Error(`${text}不能含有空格`));
        } else if (!(value.length <= maxLength && value.length >= minLength)) {
            callback(new Error(`${text}长度必须多于${minLength}少于${maxLength}`));
        } else {
            callback();
        }
    }
}
export const formValidator = new FormValidator()
