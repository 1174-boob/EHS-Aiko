// import {BASE_URL} from '@/services/api'
import { request, METHOD } from '@/utils/request'

//标识注册
export async function GetRegistrationList() {//列表
    return request(GOODS_COLUMNS, METHOD.GET)//路径  方式 传参
}