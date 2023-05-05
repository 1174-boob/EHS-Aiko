/*
 * @Author: 成礼雄
 * @Description: 工具库
 */
class ClxTools {
    constructor() { }
    // 递归获取属性
    recursionArr = (targetInfo, target = "name", children = "children", all = false, resultArr = []) => {
        if (!Array.isArray(targetInfo)) return [];
        targetInfo.forEach(item => {
            if (item[children] && item[children].length > 0) {
                if (all) {
                    if (item[target]) resultArr.push(item[target]);
                };
                this.recursionArr(item[children], target, children, all, resultArr);
            } else {
                if (item[target]) resultArr.push(item[target]); //取最深处的name
            }
        })
        return resultArr;
    }

    // 改变本地存储信息  某一项
    changeSessionItem = (targetInfo, key, value) => {
        if (!sessionStorage.getItem(targetInfo)) return false;
        // 存在 取出
        let dataFormLocal = JSON.parse(sessionStorage.getItem(targetInfo));
        // 替换其中某个值
        dataFormLocal[key] = value
        // 重新存储
        sessionStorage.setItem(targetInfo, JSON.stringify(dataFormLocal));
    }

    // 判断传参缺失 从本地获取
    hasRouteParams(that, sessionName) {
        let routeParams = null;
        // 刷新页面 从本地获取跳转的数据
        if (!that.$route.params[sessionName] && sessionStorage.getItem(sessionName)) {
            routeParams = JSON.parse(sessionStorage.getItem(sessionName));
        }
        //路由和本地都没有数据时
        if (!routeParams) {
            // that.$message.warn("信息丢失！请退出后重新登录")
            return false
        }
        return routeParams
    }
}
export const clxTools = new ClxTools()
