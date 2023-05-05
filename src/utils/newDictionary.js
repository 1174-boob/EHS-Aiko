import store from '@/store'
import { isEmpty } from 'lodash'
/**
 * 参数解释
 * @param key  属性名 如果不传则返回type类型下的所有列表（适用于下拉-列表）
 */
export default function getDictionaryItemObj(key) {
  const dict = store.state.setting.dictTypeData || []
  if (key === '' || key === undefined) {
    return dict
  }
  const findDict = dict.find(item => {
    return item.dictType === key
  })
  return (findDict || {}).dictItem || [] //字典项
}
