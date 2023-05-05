
/**
 * @author: 成礼雄
 * @description 处理流程首节点创建
 */

import { GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, } from '@/services/api'
import { msdsApproveNodeUser } from '@/services/chemicalMsds'
const firstFlowMinxin = {
    data() {
        return {
            // 流程人员
            plainOptions: [],
            // 提交所需要的流程节点信息
            flowData: {
                infoStatus: undefined,
                taskId: undefined,
                processId: undefined,
            },
            userId: null,
        }
    },
    created() {
        this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    methods: {
        //获取首节点信息
        getFirstNode() {
            let para = {
                deployId: this.DEPLOYID
            }
            return GetFirstNode(para)
        },
        // 创建流程-获取taskId
        createProcessData(infoStatus) {
            let para = {
                deployId: this.DEPLOYID,
                module: new Date().getTime(),
                map: {}
            }
            para.map[infoStatus] = infoStatus
            return CreateProcess(para)
        },
        //获取节点用户信息
        getUserNodeInfo(infoStatus) {
            let para = {
                node: infoStatus,
                corporationId:this.iFrom.corporationId || undefined
            }
            return msdsApproveNodeUser(para)
        },
        // 审批通过
        approvedTask({ infoStatus, taskId, userId }) {
            let para = {
                taskId,
                param: {},
                msg: '',
                userId,
            }
            para.param[infoStatus] = infoStatus
            return ApprovedTask(para)
        },
        // 获取下一节点infoStatus信息
        getNextTask(taskId, infoStatus) {
            let para = {
                taskId,
                param: {}
            }
            para.param[infoStatus] = infoStatus
            return GetNextTask(para)
        },
        // 1.创建节点 2.自动审批首节点 3.获取第二节点审批人
        creatFlow() {
            // 获取首节点
            return new Promise((resove, reject) => {
                this.getFirstNode()
                    .then(res => {
                        return res
                    })
                    .then(firstNodeData => {  //创建流程
                        const { id } = firstNodeData.data
                        return Promise.all([Promise.resolve(id), this.createProcessData(id)])
                    })
                    .then(([id, createProcessDataRes]) => {    //获取下级节点-获取节点用户
                        // 创建流程返回值
                        const { taskId, processId } = createProcessDataRes.data
                        this.flowData.processId = processId
                        return Promise.all([Promise.resolve(taskId), this.getNextTask(taskId, id)])
                    })
                    .then(([taskId, getNextTaskRes]) => {   //自动审批通过
                        let { id } = getNextTaskRes.data
                        this.flowData.infoStatus = id
                        // 处理人员为当前登陆人的userId
                        let userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
                        // 第一节点自动审批通过
                        return Promise.all([this.approvedTask({ infoStatus: id, taskId, userId }), this.getUserNodeInfo(id)])
                    })
                    .then(([approvedTaskRes, getUserNodeInfoRes]) => { //获取下级节点应选的人员-处理数据-打开弹窗
                        // 自动审批通过返回值
                        let { taskId } = approvedTaskRes.data
                        this.flowData.taskId = taskId
                        // 获取人员返回值
                        const { data } = getUserNodeInfoRes
                        this.plainOptions = (data || []).map(item => {
                            const { userId: value, name: label } = item
                            return { value, label }
                        })
                        resove()
                    })
                    .catch(err => { // 任何一步失败-则失败
                        console.log('前端代码报错了');
                        reject()
                    })
            })
        }
    },
};

export default firstFlowMinxin;