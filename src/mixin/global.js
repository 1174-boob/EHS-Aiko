
/**
 * @author: 成礼雄
 * @description 全局混入
 */
import { getPortraitUrlt, getUserAndJobNumber } from '@/services/api'
import { isArray } from 'lodash'
import { mapState, mapGetters, mapMutations } from 'vuex'
const copyTextMixin = {
    computed: {
        ...mapState('setting', ['dictTypeData', 'setMenuAuthList', 'setCorporationTree', 'setLoginCorporation', 'deptCache']), // setMenuAuthList:权限接口返回的结果，setCorporationTree：全部中心，setLoginCorporation给当前登录人分配的中心，deptCache：所有的部门对象，用来回显部门this.deptCache[部门id]
        ...mapGetters('setting', ['getCommonAddOrgnizeList', 'getCommonAddOrgnizeListAll', 'currentCorporationObj']), // getCommonAddOrgnizeList:当前登录人的所有组织，getCommonAddOrgnizeListAll：全部组织，currentCorporationObj：权限对象，以路由作为key
        allButtonCodeList() {
            return this.$store.state.guard.allButtonCodeList
        },
        ...mapState("system", ['keepalive']),
    },
    methods: {
        ...mapMutations('system', ['setKeepalive']),
        addCommonColumnItem(width, flag) {
            if (!flag) {
                return {
                    title: '所属组织',
                    customRender: (text, row, index) => {
                        if(row.orgId) {
                            return this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", row.orgId).orgName ? this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", row.orgId).orgName : "--";
                        } else if(row.corporationId) {
                            return this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", row.corporationId).orgName ? this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", row.corporationId).orgName : "--";
                        } else if(row.organizationId) {
                            return this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", row.organizationId).orgName ? this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", row.organizationId).orgName : "--";
                        }
                    },
                    align: "center",
                    ellipsis: true,
                    width: width
                }
            } else {
                return {
                    title: '所属组织',
                    dataIndex: "orgName",
                    align: "center",
                    ellipsis: true,
                    width: width
                }
            }

        },
        addCommonColumnDepartment(obj, flag) {
            let currentObj;
            if (isNaN(obj) && obj) { // true不是数字
                if (obj.constructor === Object) { // 是对象
                    currentObj = { ...obj }
                } else if (typeof (obj) == String) { // 是字符串
                    currentObj = {
                        key: obj ? obj : "deptId"
                    }
                } else {
                    currentObj = {
                        key: "deptId"
                    }
                }
            } else {
                currentObj = {
                    width: obj
                }
            }
            if (!flag) {
                return {
                    title: currentObj.title ? currentObj.title : "部门",
                    customRender: (text, row, index) => {
                        let key = row.deptIds ? "deptIds" : "deptId";
                        if (currentObj.key) {
                            key = currentObj.key;
                        }
                        if (!key) {
                            return "--";
                        }
                        if (row[key] && typeof (row[key]) == "string") {
                            return this.deptCache[row[key]] || "--";
                        } else if (row[key] && row[key].constructor == Array) {
                            let str = "";
                            for (let i = 0; i < row[key].length; i++) {
                                if (this.deptCache[row[key][i]]) {
                                    str += this.deptCache[row[key][i]] + ','
                                }
                            }
                            return str ? str.slice(0, -1) : "--";
                        }
                        return "--"
                    },
                    align: "center",
                    ellipsis: true,
                    width: currentObj.width
                }

            } else {
                return {
                    title: currentObj.title ? currentObj.title : "部门",
                    dataIndex: "deptName",
                    align: "center",
                    ellipsis: true,
                    width: currentObj.width
                }
            }
        },
        // 匹配组织名称
        matchOrganizeName(corporationId) {
            return this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", corporationId)?.orgAbbrName || ''
        },
        // 按钮是否可以点击
        canClickBtnMixin(btnId) {
            if (!this.allButtonCodeList.includes(btnId)) {
                this.$antMessage.warn('暂无权限，请联系管理员开通权限后再操作！')
            }
            return this.allButtonCodeList.includes(btnId)
        },
        // 功能是否展示
        canShowModalMixin(btnId) {
            return this.allButtonCodeList.includes(btnId);
        },
        // 根据id获取url (传递id组成的数组)
        getPortraitUrltFn(list) {
            // let apiData = { list }
            return getPortraitUrlt(list)
                .then(res => {
                    let data = (isArray(res.data) && res.data.length) ? res.data : []
                    return data
                })
                .catch(err => { })
        },
        // 根据传入的字典组编码值拿到对应的字典组项列表
        getDictItemList(dictType) {
            let obj = this.dictTypeData.filter(item => {
                return item.dictType == dictType;
            })[0];
            if (obj && obj.dictItem) {
                return obj.dictItem;
            } else {
                return [];
            }
        },
        // 获取映射值
        getMappingValue(arr, key, val) { // key：字段值， val：过滤值
            if (val == 0) val = 0 + "";
            if (!(arr && key && val)) {
                return {};
            }
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][key] == val) {
                    return arr[i]
                }
            }
            return {}
        },
        // 对象格式-获取中文
        getMappingValueObj(obj, val) { //obj为对象格式 val为key值
            for (let key in obj) {
                if (key == val) {
                    return obj[key]
                }
            }
            return ""
        },
        // 处理文件图片回显
        dealImgEcho(list, name, url) {
            list = list ? list : [];
            let fileList = [];
            list.forEach((item) => {
                let itemObj = {
                    id: item.id,
                    uid: item.id,
                    name: item[name],
                    status: "done",
                    url: item[url],
                };
                fileList.push(itemObj);
            });
            return fileList;
        },
        // 下拉框搜索
        filterOptionMixin(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        // 表格滚动条x属性值
        tableScrollX(columns) {
            let tableColumns = columns || this.columns || []
            let scrollX = tableColumns.reduce((prev, cur) => {
                let width = cur.width ? (cur.width - 0) : (cur.minWidth ? cur.minWidth : 0)
                return prev + width
            }, 0)
            return scrollX
        },
        // 数据权限往sessionStorage存放routerCode
        setRouterCode(code) {
            if (code) {
                sessionStorage.setItem('routerCode', code);
            } else {
                this.$antMessage.error("数据权限routerCode值不能为空");
                sessionStorage.removeItem('routerCode');
            }
        },
        //移除数据权限往sessionStorage存放routerCode
        removeRouterCode() {
            sessionStorage.removeItem('routerCode');
        },
        // 批量导出文件流处理成excel文件
        spreadSheetExcel(res, name = '批量导出文件', type = ".xlsx") {
            const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const downloadElement = document.createElement('a');
            const href = URL.createObjectURL(blob); //创建下载链接
            downloadElement.href = href;
            downloadElement.download = name + type;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);// 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
        },
        // 批量导出文件流处理成PDF文件
        spreadSheetPDF(res, name = '批量导出文件', type = ".pdf") {
            const blob = new Blob([res], { type: "application/pdf" });
            const downloadElement = document.createElement('a');
            const href = URL.createObjectURL(blob); //创建下载链接
            downloadElement.href = href;
            downloadElement.download = name + type;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);// 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
        },
        // 打开窗口时展示已选中的数据
        getUserAndJobNumber(userIds) {
            return getUserAndJobNumber({ userIds }).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err)
            })
        },
        // 生成唯一id
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // 是否是全汉字
        isCHinese(temp) {
            var re = /[^\u4e00-\u9fa5]/;
            if (re.test(temp)) return false;
            return true;
        },
        checkNum(num, temp) {
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            if (arr.indexOf(num) == -1) {
                return;
            }
            let obj = {
                0: /^\\d+$/, //非负整数（正整数 + 0）
                1: /^[0-9]*[1-9][0-9]*$/, //正整数
                2: /^((-\\d+)|(0+))$/, //非正整数（负整数 + 0）
                3: /^-[0-9]*[1-9][0-9]*$/, //负整数
                4: /^-?\\d+$/, //整数
                5: /^\\d+(\\.\\d+)?$/, //非负浮点数（正浮点数 + 0）
                6: /^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/, //正浮点数
                7: /^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$/, //非正浮点数（负浮点数 + 0）
                8: /^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/, //负浮点数
                9: /^(-?\\d+)(\\.\\d+)?$/, // 浮点数
            }
            let res = obj[num];
            if (res.test(temp)) return false;
            return true;
        }

    },
};

export default copyTextMixin;