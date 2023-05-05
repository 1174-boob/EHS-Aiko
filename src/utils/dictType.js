import store from '@/store'
import { isEmpty } from 'lodash'
/**
 * 参数解释
 * @param type 字典组的key  dictType
 * @param key  字典组里的子项key 如果不传则返回type类型下的所有子项，传了返回对应的value（适用于下拉-列表）
 */
export default function getDictTypeItemObj(type, key) {
  let dictTypeData = store.state.setting.dictTypeData
  // 字典不存在
  if (dictTypeData.length == 0) return key ? '暂无字典组数据' : [];
  // 字典存在
  // type未传递
  if (type === undefined) throw new Error('getDictTypeItemObj方法-必须传递类型')
  for (let i = 0; i < dictTypeData.length; i++) {
    if (dictTypeData[i].dictType == type) {
      if (key != undefined) {
        for (let j = 0; j < dictTypeData[i].dictItem.length; j++) {
          if (dictTypeData[i].dictItem[j].dictValue == key) {
            return dictTypeData[i].dictItem[j].dictLabel;
          }
        }
        return dictTypeData[i].dictItem;
      } else {
        return dictTypeData[i].dictItem;
      }
    }
  }
}
