/*
 * @Author: 张丹丹
 * @Description: removeItemByPath：删除某个最里层的路由 
 * @Description: changeMenu：用来修改最里层某个路由的invisible，即控制路由显示隐藏
 */

export function removeItemByPath(arr, path) {
  const filter = (arr, prePath) => {
    return arr.filter(item => {
      if (Array.isArray(item.children)) {
        item.children = filter(item.children, prePath === undefined ? item.path : prePath + '/' + item.path);
        return true;
      }
      const fullPath = prePath === undefined ? item.path : prePath + '/' + item.path;
      return fullPath !== path;
    });
  };

  return filter(arr);
}

export function changeMenu(arr, path, configRadio) {
  const filter = (arr, prePath) => {
    return arr.filter(item => {
      if (Array.isArray(item.children)) {
        item.children = filter(item.children, prePath === undefined ? item.path : prePath + '/' + item.path);
        return true;
      }
      const fullPath = prePath === undefined ? item.path : prePath + '/' + item.path;
      console.log(path)
      if (fullPath === path && path != "cooperationPartner/draftbox10") { // 黑名单管理有流程但是台账和草稿箱不展示在菜单里
        item.meta.invisible = configRadio == 2;
      }
      return true;
    });
  };

  return filter(arr);
}