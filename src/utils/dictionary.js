import store from '@/store'
import { isEmpty } from 'lodash'
/**
 * 参数解释
 * @param type 字典类型 必传
 * @param key  属性名 如果不传则返回type类型下的所有列表（适用于下拉-列表）
 * @param isValue 默认值true:仅返回属性值  值为false:返回被匹配的对象
 */
export default function getDictionaryItemObj(type, key, isValue = true) {
  // store.state.setting.dictConfigData --配置管理字典
  let dictionaryData = store.state.setting.dictionaryData
  // console.log(dictionaryData, '...dictionaryData我是公共方法');
  let errObj = { value: '1字典数据异常！' }
  // 字典不存在
  if (isEmpty(dictionaryData)) return isValue ? '字典数据异常！' : errObj
  // 字典存在
  // type未传递
  if (type === undefined) throw new Error('getDictionaryItemObj方法-必须传递类型')
  // type不匹配
  if (!dictionaryData[type]) return errObj
  let typeObj = dictionaryData[type]
  let typeArr = Object.keys(typeObj).map(item => typeObj[item][0])
  // key未传递
  if (key === undefined) return typeArr
  //key传递
  let resObj = typeArr.filter(item => item.key == key)
  // key不匹配
  if (resObj.length === 0) return isValue ? '--' : errObj
  return isValue ? resObj[0].value : resObj[0]
}

// 仅适用于 store.state.setting.dictConfigData --配置管理字典
export function getDictConfigData(type, key, isValue = true) {
  let dictionaryData = store.state.setting.dictConfigData
  // console.log(dictionaryData,'...dictionaryData');
  let errObj = { value: '字典数据异常！' }
  // 字典不存在
  if (isEmpty(dictionaryData)) return isValue ? '字典数据异常！' : errObj
  // 字典存在
  // type未传递
  if (type === undefined) throw new Error('getDictConfigData方法-必须传递类型')
  // type不匹配
  if (!dictionaryData[type]) return errObj
  let typeObj = dictionaryData[type]
  let typeArr = Object.keys(typeObj).map(item => typeObj[item][0])
  // key未传递
  if (key === undefined) return typeArr
  //key传递
  let resObj = typeArr.filter(item => item.key == key)
  // key不匹配
  if (resObj.length === 0) return isValue ? '字典数据异常！' : errObj
  return isValue ? resObj[0].value : resObj[0]
}

// 用户字典
function getUserDictionaryItemObj(type, key, isValue = true) {
  // 返回list
  let dictionaryData = store.state.setting.dictTypeData
  let dictTargetObj = (dictionaryData || []).find(item => item.dictType == type);
  let dictTargetList = dictTargetObj ? dictTargetObj.dictItem : []
  dictTargetList.forEach(item => {
    item.key = item.dictValue
    item.value = item.dictLabel
  })
  if (key === undefined) return dictTargetList

  // 返回obj 或 文字
  let dictObj = dictTargetList.find(item => item.key == key)
  let dictTargetText = dictObj ? dictObj.value : ''
  return isValue ? dictTargetText : dictObj
}

/**
 * 全部字典项-参数解释
 * @param  base 字典来源 必传 system、s为系统后端内置字典  user、u为用户可配置字典
 * @param  type 字典类型 必传
 * @param  key  属性名 如果不传则返回type类型下的所有列表（适用于下拉-列表 下拉id字段:key,中文展示:value）
 * @param  isValue 默认值true:仅返回属性值  值为false:返回被匹配的对象
 */
export function getDictTarget(base, type, key, isValue = true) {
  let target = ''
  switch (base) {
    case 'system':  //系统字典
    case 's':
      target = getDictionaryItemObj(type, key, isValue)
      break;
    case 'user':    //用户字典
    case 'u':
      target = getUserDictionaryItemObj(type, key, isValue)
      break;
    default:
      target = getDictionaryItemObj(type, key, isValue)
      break;
  }
  return target
}