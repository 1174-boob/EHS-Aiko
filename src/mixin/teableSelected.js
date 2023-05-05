/**
 * @author: 成礼雄
 * @description 表格筛选
 */
import { cloneDeep } from 'lodash'
const teableSelected = {
    data() {
        return {
            // 表格所选择的key
            selectedRowKeys: [],
            selectedRow: [],
        }
    },
    methods: {
        // 表格选择的key
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.tableRowKey && this.setSelectedRow(selectedRows)
        },
        // 表格选择的项
        setSelectedRow(selectedRows) {
            let selectedRow = [...this.selectedRow, ...selectedRows]
            selectedRow = this.selectedRowKeys.map(item => {
                let selectedRowItem = {}
                selectedRow.some(item1 => {
                    if (item1[this.tableRowKey] === item) {
                        selectedRowItem = item1
                        return true
                    }
                })
                return selectedRowItem
            })
            this.selectedRow = cloneDeep(selectedRow)
            // console.log('this--', this.selectedRow);
        },
        // 清空表格选择的项
        clearSelectedTable() {
            this.selectedRowKeys = []
            this.selectedRow = []
        }
    },
    watch: {
        selectedRowKeys: {
            handler(newVal) {
                if (newVal.length == 0) {
                    // console.log('被清除');
                    this.selectedRow = []
                }
            },
            deep: true
        }
    }
};

export default teableSelected;