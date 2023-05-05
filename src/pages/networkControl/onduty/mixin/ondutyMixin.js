
const ondutyMixin = {
    data() {
        return {
            pageSize: 5,
            // 报警记录
            alarmRecord: {
                tableAllList: [],
                isOpen: false,
            },
            // 故障维修记录
            troubleShooting: {
                tableAllList: [],
                isOpen: false,
            },
            troubleShootingModelShow: false,
            // 测试记录
            testRecord: {
                tableAllList: [],
                isOpen: false,
            },
            // 巡检记录
            inspectionRecord: {
                tableAllList: [],
                isOpen: false,
            },
            inspectionRecordModelShow: false,
            // 事件记录
            eventRecord: {
                tableAllList: [],
                isOpen: false,
            },
            eventRecordModelShow: false,
            // 消防系统CRT每日检测
            fireFightingSystem: {
                tableAllList: [],
                isOpen: false,
            },
            fireFightingSystemModelShow: false,
            // 消防业务电话记录表
            firePhoneRecord: {
                tableAllList: [],
                isOpen: false,
            },
            firePhoneRecordModelShow: false,
        }
    },
    computed: {
        // 报警记录-展示项
        alarmRecordTableList() {
            let tableList = this.tableListFilter(this.alarmRecord)
            return tableList
        },
        // 故障维修记录-展示项
        troubleShootingTableList() {
            let tableList = this.tableListFilter(this.troubleShooting)
            return tableList
        },
        // 测试记录-展示项
        testRecordTableList() {
            let tableList = this.tableListFilter(this.testRecord)
            return tableList
        },
        // 巡检记录-展示项
        inspectionRecordTableList() {
            let tableList = this.tableListFilter(this.inspectionRecord)
            return tableList
        },
        // 事件记录-展示项
        eventRecordTableList() {
            let tableList = this.tableListFilter(this.eventRecord)
            return tableList
        },
        //  消防系统CRT每日检测-展示项
        fireFightingSystemTableList() {
            let tableList = this.tableListFilter(this.fireFightingSystem)
            return tableList
        },
        // 消防业务电话记录表-展示项
        firePhoneRecordTableList() {
            let tableList = this.tableListFilter(this.firePhoneRecord)
            return tableList
        },
        columnMinWidth() {
            let minWidthVal = this.isShowPage ? undefined : 120
            return minWidthVal
        }
    },
    methods: {
        // 匹配组织
        matchOrgnize(dictArr) {
            dictArr.forEach(item => {
                let orgAbbrName = this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", item.corporationId).orgAbbrName
                item.corporationName = orgAbbrName ? orgAbbrName : item.corporationId
            })
            return dictArr
        },
        // 获取当前展示的列表
        tableListFilter(listObj) {
            let { tableAllList, isOpen } = listObj
            let tableList = tableAllList
            if (tableAllList.length > this.pageSize && !isOpen) {
                tableList = tableAllList.filter((item, index) => index < this.pageSize)
            }
            return tableList
        },
        // 更多、展开-切换
        getMore(listName, isOpen) {
            this[listName].isOpen = isOpen
        },
    },
};

export default ondutyMixin;