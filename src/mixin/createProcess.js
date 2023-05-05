
/**
 * @author: 张丹丹
 * @description 自定义表单提交表单数据的时候发起流程
 */
import { SaveBusinessProcess, CreateProcess } from "@/services/api.js";

const cancelLoading = {
  data() {
    return {}
  },
  methods: {
    async createProcessFn() {
      // 发起流程
      let params2 = {
        deployId: this.deployId,
        module: this.businessId,
        map: {
          ...this.formObj
        },
        userId: this.userInfo.userId,
        companyId: this.companyId
      }
      params2.map[this.firstNode] = this.userInfo.userId;
      let result2 = await CreateProcess(params2);
      this.taskId = result2.data.taskId;

      // 保存业务流程
      let params3 = {
        businessId: this.businessId,
        moduleCode: this.formData.code,
        nextNode: this.firstNode,
        nextOperator: this.userInfo.userId,
        operatorStatus: 0,
        taskId: this.taskId,
        deploymentId: this.deployId,
        tempId: this.formData.tempId
      }
      let result3 = await SaveBusinessProcess(params3);
    },
    // 驳回 / 撤回
    async rejectedTask() {
      try {
        let params12 = {
          taskId: this.taskId,
          userId: this.userInfo.userId,
          companyId: this.companyId,
          msg: this.rebackMsg
        }
        let result12 = await RejectedTask(params12);

        // 获取当前节点扩展信息
        let params14 = {
          taskId: result12.data.taskId
        }
        let result14 = await getNowTask(params14);
        let nextOperator = "";
        for (let key in result14.data.param) {
          if (key == result14.data.id) {
            nextOperator = result14.data.param[key];
          }
        }
        let params13 = {
          businessId: this.businessId,
          moduleCode: this.formData.code,
          nextNode: result14.data.id,
          nextOperator: nextOperator, // 下级节点的变量：所选人员
          operatorStatus: 2, // 通过1  驳回2
          taskId: result12.data.taskId,
          deploymentId: this.deployId,
          tempId: this.formData.tempId
        }
        // 更新业务流程
        await UpdateBusinessProcess(params13);
        // 更新表单数据保存到台账列表
        this.updateFormDataFn();
      } catch (err) { console.log(err); }
    },
  },
};
export default cancelLoading;