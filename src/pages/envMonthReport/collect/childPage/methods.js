import aikoMonthData from "@/pages/envMonthReport/terrain/childPage/aikoMonthData.js";
import store from '@/store'
export const tableConversion = (data, n = 1, type) => { // style：样式  Nodes：节点结构体
    let tableData = []
    let titleList = []
    for (let key in data) {
        let item = findData(key)
        for (let i = 0; i < data[key].length; i++) {
            let name = data[key][i].corporationId;
            if (key == n) {
                titleList.push(name);
            }
            if(type == 'elec') {
                item[name] = data[key][i].scopeSum
            } else {
                item[name] = data[key][i].dataItem
            }
        }
        tableData.push(item)
    }
    return { tableData, titleList }
}

// function findData (key) {
//     let item = aikoMonthData.find(i => {
//         return i.nicheItemsCode == key
//     })
//     return item
// }

export const findData = (key) => {
    let item = aikoMonthData.find(i => {
        return i.nicheItemsCode == key
    })
    return item
}

export const findCorporationId = (id) => {
    return store.state.setting.corporationList.find(item => item.orgId == id).orgName
}

export const lastMonth = () => {
    const date = new Date();
    const yy = date.getFullYear();
    const mm = date.getMonth();
    if (mm == 0) {
        return `${yy - 1}-12`
    } else {
        return `${yy}-${mm}`
    }
}


