import enquireJs from 'enquire.js'
import { cloneDeep } from 'lodash'
export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}
// ѭ������Ĭ�ϲ˵�����
export function recursionObject(dataInfo, objInfo) {
  for (let dataKey in dataInfo) {
    for (let objKey in objInfo) {
      if (dataInfo[dataKey].parentUrl == objInfo[objKey].router || dataInfo[dataKey].parentUrl == objInfo[objKey].url) {
        objInfo[objKey].children.push(dataInfo[dataKey])
      }
    }
  }
  return objInfo
}
//按钮权限接口返回结构处理
export function recursionMenuBtn(menuArr) {
  if (!Array.isArray(menuArr) || menuArr.length < 1) {
    return
  }
  let cpyMenuArr = cloneDeep(menuArr)
  cpyMenuArr.forEach((item, index) => {
    if (item.children && item.children.length > 0) {
      let isMenu = item.children.some(subItem => {
        return subItem.type === 0
      })
      let targetIndex = getItemIndex(item, menuArr)
      if (!isMenu) {
        // menuArr[index].children = []//不能根据index置空，因为menuArr的长度在变化
        //改用根据item唯一标识去查item所在menuArr所在的索引
        menuArr[targetIndex].children = []
        menuArr.splice(targetIndex + 1, 0, ...item.children)
      } else {
        recursionMenuBtn(menuArr[targetIndex].children)
      }
    }
  })
}
function getItemIndex(item, arr) {
  if (!item || !arr || !arr.length) {
    return -1
  }
  return (arr || []).findIndex(subItem => {
    return item.url === subItem.url
  })
}
// ��ȡ�˵���ť����
export function recursionMenuButton(menuData) {
  let buttonMenu = [];
  // ����һ���˵��е�children
  for (var i = 0; i < menuData.length; i++) {
    // menuData[i].buttonFlag�����true������parentId��root��ֱ��push��ȥ
    // menuData[i].buttonFlag�����true�����parentId����root����ѵ�ǰ�����˵���children���������ȫ����ȡ����Ӧ��һ���˵���children��
    // menuData[i].buttonFlag�����false���������ݣ�����children����ѭ��
    if (menuData[i].buttonFlag) {
      if (menuData[i].resourceId == 'root') {
        buttonMenu.push(menuData[i])
      } else {
        // ��ѵ�ǰ�����˵���children���������ȫ����ȡ����Ӧ��һ���˵���children��
        for (var j = 0; j < menuData[i].children.length; j++) {
          if (menuData[i].children[j].buttonFlag) {
            menuData[i].children = menuData[i].children.concat(menuData[i].children[j].children)
            menuData[i].children[j].children = [];
          }
        }
      }
    } else {
      // ���������˵��е�children
      for (var j = 0; j < menuData[i].children.length; j++) {
        if (menuData[i].children[j].buttonFlag) {
          menuData[i].children = menuData[i].children.concat(menuData[i].children[j].children)
          menuData[i].children[j].children = [];
        }
        menuData[i].children = menuData[i].children.filter(item => item.url != null)
      }
    }
  }
  return menuData
}

export function getQueryVariable(variable) {
  var query = decodeURIComponent(window.location.search.substring(1));
  // console.log(query)
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return undefined;
}

// 去重
export function rmDuplicatesByKey(arr, key) {
  let obj = {};
  let reduce = [];
  reduce = arr.reduce(function (item, next) {
    obj[next[key]] ? '' : (obj[next[key]] = true && item.push(next));
    return item;
  }, []);
  return reduce
}

// 数组匹配指定属性-获取对象
export function matchArrayObj(targetArr, id, val) {
  targetArr = Array.isArray(targetArr) ? targetArr : []
  let targetObj = targetArr.find(item => item[id] == val);
  return targetObj;
}

// 数组匹配指定属性-获取对象具体数值
export function matchArrayAttr(targetArr, id, val, attr, needObj = false) {
  let targetObj = matchArrayObj(targetArr, id, val);
  if (needObj) return targetObj
  let targetText = targetObj ? targetObj[attr] : ''
  return targetText;
}

// 删除地址栏指定参数
export function rmUrlParam(paramArr, path = '') {
  let newParamArr = (paramArr || []).map(item => {
    return item.includes('=') ? item : item + '='
  })

  return new Promise((res, rej) => {
    //获取当前页面的url
    let url = window.location.href;
    let search = window.location.search;
    //判断是否存在参数
    if (url.includes("?")) {
      let searchArr = search.split('&').filter(item => {
        return item && newParamArr.some(item1 => !item.includes(item1))
      })
      let finalSearch = searchArr.join('&')
      // 拼接url
      url = url.replace(/(\?|#)[^'"]*/, '') + (finalSearch && finalSearch.indexOf('?') < 0 ? '?' : '') + finalSearch + path;
      window.history.pushState({}, 0, url);
    }
    res()
  })
}

const _toString = Object.prototype.toString
