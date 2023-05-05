<template>
  <div>
    <div class="node-wrap" v-if="processNode.type!=4 && processNode.type != 10 &&  processNode.type != 11 && processNode.type != -1">
      <!-- <div class="node-wrap-box" @click.self="nodeClick(processNode)"> -->
      <div class="node-wrap-box">
        <div>
          <div class="title" :style="'background: rgb('+ ['87, 106, 149','255, 148, 62','50, 150, 250'][processNode.type] +');'">
            <span class="iconfont" v-show="processNode.type==1"></span>
            <span class="iconfont" v-show="processNode.type==2"></span>
            <span v-if="processNode.type==0">{{processNode.nodeName}}</span>
            <input
              type="text"
              class="ant-input editable-title-input"
              v-if="processNode.type!=0&&isInput"
              @blur="blurEvent()"
              @focus="$event.currentTarget.select()"
              v-focus
              v-model="processNode.nodeName"
              :placeholder="placeholderList[processNode.type]"
            />
            <span class="editable-title" @click="clickEvent()" v-if="processNode.type!=0&&!isInput">{{processNode.nodeName}}</span>
            <i class="anticon anticon-close close" v-if="processNode.type!=0" @click="delNode(processNode)"></i>
          </div>
          <div class="error_tip" v-if="isTried&&processNode.error">
            <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
          </div>
        </div>
        <div class="content" @click.self="nodeClick(processNode)">{{processNode.nodeContent?processNode.nodeContent:""}}</div>
      </div>

      <addNode :nextNodeP.sync="processNode.nextNode"></addNode>
    </div>

    <div class="branch-wrap" v-if="processNode.type==4">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button class="add-branch" @click="addTerm">条件分支</button>
          <div class="col-box" v-for="(item,index) in processNode.branchNodes" :key="index">
            <div class="condition-node">
              <div class="condition-node-box">
                <div class="auto-judge" :class="isTried&&item.error?'error active':''">
                  <div class="sort-left" v-if="index!=0" @click="arrTransfer(index,-1)">&lt;</div>
                  <div class="title-wrapper">
                    <input type="text" class="ant-input editable-title-input" v-if="isInputList[index]" @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-focus v-model="item.nodeName" />
                    <span class="editable-title" @click="clickEvent(index)" v-if="!isInputList[index]">{{item.nodeName}}</span>
                    <!-- <span class="priority-title" @click="setPerson(item.priorityLevel)">优先级{{item.priorityLevel}}</span> -->
                    <i class="anticon anticon-close close" @click="delTerm(index)"></i>
                  </div>
                  <div class="sort-right" v-if="index!=processNode.branchNodes.length-1" @click="arrTransfer(index)">&gt;</div>
                  <div class="condition-content" @click.self="nodeCondition(item)">{{item.condition}}</div>
                  <!-- <div class="content" @click="setPerson(item.priorityLevel)">{{$func.conditionStr(item,index)}}</div> -->
                  <div class="error_tip" v-if="isTried&&item.error">
                    <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
                  </div>
                </div>
                <addNode :nextNodeP="item.nextNode" @update:nextNodeP="(value)=>abc(value,item)"></addNode>
                <!-- <addNode :nextNodeP.sync="item.nextNode"></addNode> -->
              </div>
            </div>
            <nodeWrap v-if="item.nextNode && item.nextNode && item.type !== -1" :processNode.sync="item.type != -1 ? item.nextNode : item.nextNode.nextNode" :tableId="tableId" :isTried.sync="isTried"></nodeWrap>
            <div class="top-left-cover-line" v-if="index==0"></div>
            <div class="bottom-left-cover-line" v-if="index==0"></div>
            <div class="top-right-cover-line" v-if="index==processNode.branchNodes.length-1"></div>
            <div class="bottom-right-cover-line" v-if="index==processNode.branchNodes.length-1"></div>
          </div>
        </div>
        <addNode :nextNodeP.sync="processNode.nextNode"></addNode>
        <!-- <addNode :childNodeP.sync="processNode.nextNode.nextNode" :parentNode.sync="processNode.nextNode"></addNode> -->
      </div>
    </div>

    <!-- <div class="branch-wrap" v-if="processNode.type==10">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <button class="add-branch" @click="parall">并行任务</button>
                    <div class="col-box" v-for="(item,index) in processNode.branchNodes" :key="index">
                        <div class="condition-node">
                            <div class="condition-node-box">
                                <addNode :nextNodeP.sync="item.nextNode" :parentNode.sync="item"></addNode>
                            </div>
                        </div>
                        <nodeWrap v-if="item.nextNode && item.nextNode" :processNode.sync="item.nextNode" :tableId="tableId"
                                  :isTried.sync="isTried"></nodeWrap>
                        <div class="top-left-cover-line" v-if="index==0"></div>
                        <div class="bottom-left-cover-line" v-if="index==0"></div>
                        <div class="top-right-cover-line" v-if="index==processNode.branchNodes.length-1"></div>
                        <div class="bottom-right-cover-line" v-if="index==processNode.branchNodes.length-1"></div>
                    </div>
                </div>
                <addNode :nextNodeP.sync="processNode.nextNode.nextNode" :parentNode.sync="processNode.nextNode"></addNode>
            </div>
    </div>-->

    <nodeWrap v-if="processNode.nextNode && processNode.nextNode" :processNode.sync="processNode.nextNode" :tableId="tableId" :isTried.sync="isTried"></nodeWrap>

    <a-drawer :title="drawerTitle" :width="380" :closable="false" :visible="drawerVisible" :body-style="{ padding:'10px 20px 80px',height:'calc(100vh - 80px)','overflow-y':'auto'}">
      <!-- 申请节点时候显示 -->
      <div v-if="drawerType=='0'">
        <label class="applicant">申请人</label>
        <a-select ref="select" style="width: 100%;margin-top:10px;" placeholder="请选择" v-model:value="applicant" @focus="focus" @change="handleChange">
          <a-select-option v-for="item of option1" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
        </a-select>
      </div>
      <!-- 填写-审批节点时候显示 -->
      <div class="write-approval" v-if="drawerType=='1' || drawerType=='2'">
        <a-form-model layout="inline" ref="principalForm" :model="dictForm" :rules="nodeRules" :colon="false">
          <!-- <a-row>
          <a-col :span="14">-->
          <a-form-model-item label="负责人" prop="headPeople">
            <a-button type="primary" @click="principalClick">选择人员</a-button>
          </a-form-model-item>
          <!-- </a-col>
          <a-col :span="16">-->
          <a-form-model-item label="负责人为空" prop="nullHeadPeople">
            <a-button type="primary" @click="principalNone">配置人员</a-button>
          </a-form-model-item>
          <!-- </a-col>
          </a-row>-->
        </a-form-model>
      </div>
      <a-tabs v-model:activeKey="activeKey" class="tab-content">
        <a-tab-pane key="1" tab="字段权限">
          <div class="form-auth-table">
            <header class="auth-table-header">
              <div class="row">
                <div class="label">表单字段</div>
                <a-radio-group name="radioGroup" v-model:value="radioAllvalue" @change="changeRadioAll">
                  <a-radio value="1" class="radio1">可编辑</a-radio>
                  <a-radio value="2" class="radio2">只读</a-radio>
                  <a-radio value="3" class="radio3">隐藏</a-radio>
                </a-radio-group>
                <!-- <div class="radio-group">
                                <span style="margin-left: -14px;">可编辑</span>
                                <span style="margin-left: -6px;">只读</span>
                                <span>隐藏</span>
                </div>-->
              </div>
            </header>
            <div class="auth-table-body">
              <div v-for="item in tableData" :key="item.fieldCode" class="row">
                <div class="label" :title="item.fieldName">{{item.fieldName}}</div>
                <a-radio-group v-model:value="item.fieldState" name="radioGroup" class="radio-group" @change="changeEditRadio(item.fieldState)">
                  <a-radio value="1" v-show="item.editRadio"></a-radio>
                  <div style="width:24px" v-show="!item.editRadio"></div>
                  <a-radio value="2"></a-radio>
                  <a-radio value="3"></a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="基础设置">
          <div v-if="drawerType=='0'">
            <div class="recall">
              <span>允许撤回</span>
              <a-switch v-model:checked="recallChecked" checked-children="开" un-checked-children="关" />
            </div>
            <span class="notes">允许申请人对未进入流程（第一个流程节点为待处理状态）的申请进行撤回</span>
            <div class="btn-content">
              <div>自定义表单按钮文案</div>
              <div class="btn">
                <a-form-model layout="inline" :model="btnName" :colon="false">
                  <a-row :gutter="16">
                    <a-col :span="18">
                      <a-button type="primary">提交</a-button>
                      <a-form-model-item label>
                        <a-input v-model="btnName.submit" placeholder="默认“提交”" allowClear></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col :span="10">
                      <a-button type="primary">保存</a-button>
                      <a-form-model-item label>
                        <a-input v-model="btnName.save" placeholder="默认“保存”" allowClear></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
          <div v-if="drawerType=='1'">
            <div class="recall">
              <span>允许退回</span>
              <a-switch v-model:checked="backChecked" checked-children="开" un-checked-children="关" />
            </div>
            <div class="btn-content">
              <div>自定义表单按钮文案</div>
              <div class="btn">
                <a-form-model layout="inline" :model="btnName" :colon="false">
                  <a-row :gutter="16">
                    <a-col :span="18">
                      <a-button type="primary">提交</a-button>
                      <a-form-model-item label>
                        <a-input v-model="btnName.submit" placeholder="默认“提交”" allowClear></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
          <div v-if="drawerType=='2'">
            <div class="approval-type">
              <a-form-model layout="inline" :colon="false">
                <a-row :gutter="20">
                  <a-col :span="24">
                    <a-form-model-item label="审批类型">
                      <a-select v-model="approvalType" placeholder="审批类型">
                        <a-select-option :title="item.label" v-for="item of approvalTypeArr" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>
            <span class="notes">当有多名负责人时的审批方式</span>
            <div class="btn-content">
              <div>自定义表单按钮文案</div>
              <div class="btn">
                <a-form-model layout="inline" :model="btnName" :colon="false">
                  <a-row :gutter="16">
                    <a-col :span="18">
                      <a-button type="primary">通过</a-button>
                      <a-form-model-item label>
                        <a-input v-model="btnName.submit" placeholder="默认“通过”" allowClear></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col :span="10">
                      <a-button type="primary">驳回</a-button>
                      <a-form-model-item label>
                        <a-input v-model="btnName.save" placeholder="默认“驳回”" allowClear></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
          <div class="btn-content">
            <div>业务状态</div>
            <span class="notes">注：每个节点下字典组必须一致，字典项可不统一</span>
            <div class="approval-type">
              <a-form-model layout="inline" ref="dictForm" :model="dictForm" :rules="nodeRules" :colon="false">
                <a-row :gutter="20">
                  <a-col :span="24">
                    <a-form-model-item label="字典组" prop="dictType">
                      <a-select v-model="dictForm.dictType" placeholder="请选择字典组" allowClear @change="dictTypeChange">
                        <a-select-option :title="item.dictName" v-for="item of dictTypeData" :value="item.dictType" :key="item.dictType">{{item.dictName}}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="20">
                  <a-col :span="24">
                    <a-form-model-item label="字典项" prop="dictValue">
                      <a-select v-model="dictForm.dictValue" placeholder="请选择字典项" allowClear>
                        <a-select-option :title="item.dictLabel" v-for="item of dictTypeList" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div
        :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">取消</a-button>
        <a-button type="primary" @click="confirmDrawer">确定</a-button>
      </div>
    </a-drawer>
    <CommonModal :title="'条件设置'" :visible="visible" :cancelFn="cancelFn" class="settlement-condition">
      <!-- <DashBtn>
                <div style="margin-left:44px">
                    <a-button type="dashed" @click="AndCondition"><a-icon type="plus" />且条件</a-button>
                    <a-button type="dashed" @click="OrCondition"><a-icon type="plus" />或条件</a-button>
                </div>
      </DashBtn>-->
      <template slot="form">
        <div v-for="(formArr,ind) of formList" :key="ind">
          <div v-if="formArr[0].andOr=='||'" class="form-text">或</div>
          <a-form-model :ref="'ruleForm'+ind+index" :model="formList[ind][index]" :rules="nodeRules" :colon="false" labelAlign="left" v-for="(formItem,index) of formArr" :key="formItem.id">
            <a-row :gutter="12" class="condition-form">
              <a-col :span="1"></a-col>
              <a-col :span="6">
                <a-form-model-item label=" " prop="fieldCode" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-select v-model="formItem.fieldCode" placeholder="下拉展示所有字段" @change="(value)=>fieldChange(value,ind,index)">
                    <a-select-option v-for="item of tableData" :value="item.fieldCode" :key="item.fieldCode">{{item.fieldName}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label=" " prop="opinion" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-select v-model="formItem.opinion" placeholder="判断项">
                    <a-select-option v-for="item of formItem.judgement" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="9">
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='text'">
                  <a-input v-model.trim="formItem.detail" placeholder :disabled="!formItem.opinion" allowClear />
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='number'">
                  <a-input-number v-model.trim="formItem.detail" :disabled="!formItem.opinion" allowClear />
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='dictData'">
                  <a-select v-model="formItem.detail" placeholder="请选择" allowClear :disabled="!formItem.opinion">
                    <a-select-option :title="item.dictLabel" v-for="item of formItem.dictDataList" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='date'">
                  <a-date-picker v-model="formItem.detail" allowClear @change="(value)=>dateChange(value,ind,index)" />
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='datePicker'">
                  <a-date-picker v-model="formItem.detail" show-time placeholder="请选择" @change="(value)=>datePickerChange(value,ind,index)" />
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='time'">
                  <a-time-picker v-model="time" format="HH:mm" @change="(value)=>timeChange(value,ind,index)" />
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='select'">
                  <a-select v-model="formItem.detail" placeholder="请选择" allowClear :disabled="!formItem.opinion">
                    <!-- <a-select-option :title="item.label" v-for="item of formItem.selectList" :value="item.value" :key="item.value">{{item.label}}</a-select-option> -->
                    <a-select-option :title="item.label" v-for="item of fieldDetailData(formItem.fieldCode)" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='organizeTree'">
                  <a-tree-select
                    v-model="formItem.detail"
                    :disabled="!formItem.opinion"
                    allowClear
                    show-search
                    :filterTreeNode="filterTree"
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '260px', overflow: 'auto' }"
                    :tree-data="deptData"
                    :replaceFields="replaceFields"
                    placeholder="请选择"
                    tree-default-expand-all
                  ></a-tree-select>
                </a-form-model-item>
                <a-form-model-item label=" " prop="detail" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formItem.fieldType=='staffTree'">
                  <a-tree-select
                    show-search
                    allowClear
                    multiple
                    :filterTreeNode="filterUserTree"
                    v-model="formItem.detail"
                    :replaceFields="userTreeFields"
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '260px', overflow: 'auto' }"
                    :tree-data="userTreeData"
                    treeIcon
                    placeholder="请选择"
                    treeDefaultExpandAll
                  ></a-tree-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="2">
                <a-button type="link" v-if="(ind==0 &&index>=1) ||ind!=0" @click="deleteCondition(ind,index)">删除</a-button>
              </a-col>
            </a-row>
            <DashBtn class="dash-btn" v-if="index == (formArr.length-1)">
              <div style="margin-left:44px">
                <a-button type="dashed" @click="AndCondition(ind,index)">
                  <a-icon type="plus" />且条件
                </a-button>
              </div>
            </DashBtn>
          </a-form-model>
        </div>
      </template>
      <template slot="form">
        <DashBtn class="dash-or-btn">
          <div style="margin-left:44px">
            <a-button type="dashed" @click="OrCondition">
              <a-icon type="plus" />或条件
            </a-button>
          </div>
        </DashBtn>
      </template>
      <template slot="btn">
        <a-button @click="visible = false">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitCondition">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal :title="'选择负责人'" :visible="principalVisible" :cancelFn="cancelPrincipal" class="principal-dialog dialog-modal">
      <div class="principal-content">
        <div class="left">
          <div class="title-content">
            <div class="title">选中的负责人</div>
            <a-button type="link" @click="clearPrincipal">清空</a-button>
          </div>
          <ul>
            <li v-for="item of principalAll" :key="item.ele+item.index">
              <div class="name">{{item.value}}</div>
              <a-button type="link" @click="deletePrincipal(item)">删除</a-button>
            </li>
          </ul>
        </div>
        <div class="right">
          <a-tabs v-model:activeKey="activePrincipal">
            <a-tab-pane key="1" tab="部门和人员">
              <a-tree-select
                show-search
                allowClear
                multiple
                :filterTreeNode="filterUserTree"
                v-model="treeValue"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '260px', overflow: 'auto' }"
                :tree-data="treeData"
                :replaceFields="userTreeFields"
                @change="onChange"
                placeholder="请选择"
              >
                <template slot-scope="text" slot="title">{{text.value}}</template>
              </a-tree-select>
              <div v-if="treeData.length<=0" class="empty">暂无部门和人员数据</div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="角色">
              <a-checkbox-group v-model:value="role" name="checkboxgroup" :options="roleOptions" @change="roleChange" />
              <div v-if="roleOptions.length<=0" class="empty">暂无角色数据</div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="职位/岗位">
              <div class="check-title">职位</div>
              <a-checkbox-group v-model:value="position" name="checkboxgroup" :options="positionOptions" @change="positionChange" />
              <div class="check-title">岗位</div>
              <a-checkbox-group v-model:value="post" name="checkboxgroup" :options="postOptions" @change="postChange" />
            </a-tab-pane>
            <a-tab-pane key="4" tab="指定主管">
              <a-radio-group v-model:value="charge" @change="chargeChange">
                <a-radio v-for="item of chargeOptions" :style="radioStyle" :value="item.value" :key="item.value">{{item.label}}</a-radio>
              </a-radio-group>
            </a-tab-pane>
            <a-tab-pane key="5" tab="业务单">
              <div class="check-title">基本字段</div>
              <a-checkbox-group v-model:value="bu" name="checkboxgroup" :options="buOptions" @change="buChange" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <template slot="btn">
        <a-button @click="cancelPrincipal">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitPrincipal">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal :title="'负责人为空'" :visible="principalNoneVisible" :cancelFn="cancelPrincipalNone" class="principal-dialog">
      <div class="principal-content">
        <div class="left">
          <div class="title-content">
            <div class="title">选中的负责人</div>
            <a-button type="link" @click="clearBear">清空</a-button>
          </div>
          <ul>
            <li v-for="item of toBear" :key="item">
              <div class="name">{{userTreeObj[item]}}</div>
              <a-button type="link" @click="deleteBear(item)">删除</a-button>
            </li>
          </ul>
        </div>
        <div class="right">
          <a-tabs v-model:activeKey="activePrincipalNone">
            <a-tab-pane key="1" tab="部门和人员">
              <a-tree-select
                show-search
                allowClear
                multiple
                :filterTreeNode="filterUserTree"
                v-model="toBear"
                :replaceFields="userTreeFields"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '260px', overflow: 'auto' }"
                :tree-data="userTreeData"
                treeIcon
                placeholder="请选择"
              >
                <template slot-scope="text" slot="title">
                  <a-icon type="smile" theme="twoTone" />
                  {{text.value}}
                </template>
              </a-tree-select>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <template slot="btn">
        <a-button @click="cancelPrincipalNone">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitPrincipalNone">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import { nanoid } from 'nanoid';
import dictionary from "@/utils/dictionary.js";
import { SelectProcessField, getOrganizeList, DetailNgform, deptDict, roleList } from "@/services/api";
import { formValidator } from "@/utils/clx-form-validator.js";
import _ from 'lodash';
import moment from 'moment'
export default {
  name: 'wrap',
  props: ["processNode", "flowPermission", "isTried", "tableId"],
  data() {
    return {
      time: undefined,
      radioAllvalue: undefined,
      labelCol: { span: 1 },
      wrapperCol: { span: 22 },
      drawerTitle: '申请人',
      placeholderList: ["申请人", "填写节点", "审批节点"],
      isInputList: [],
      // deptData:[],
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      userTreeFields: { value: 'key' },
      selectRest: true, //条件选择中下拉选择(select在表单设计重新修改之后，找不到对应值跳出循环时候使用)
      isInput: false,
      drawerVisible: false,
      visible: false,
      loading: false,
      principalVisible: false,
      principalNoneVisible: false,
      formInline: {
        name: ''
      },
      dictForm: {
        dictType: undefined,
        dictValue: undefined,
      },
      approvalType: '1',
      approvalTypeArr: [
        { value: '1', label: '或签(一名负责人通过或拒接即可)' },
        { value: '2', label: '会签(需所有审批人都通过才能进行下一级)' },
      ],
      formList: [],
      conditionId: '', //点击某个条件的id
      // drawerForm: {
      //     name:''
      // },
      applicant: '1',
      principalSelected: [[], [], [], [], [], []],
      savePrincipal: [[], [], [], [], [], []],
      principalAll: [],
      principalObj: {
        "0": "treeValue", //部门和人员
        "1": "role", //角色
        "2": "position", //岗位
        "3": "post", //职位
        "4": "charge", //指定主管
        "5": "bu", //业务单
      },
      principalStr: '',
      activeKey: '1',
      activePrincipal: '1',
      activePrincipalNone: '1',
      drawerType: '0',
      option1: [{
        value: '1',
        label: '所有人',
      }],
      judgementObj: {
        text: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
        ],
        organizeTree: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
        ],
        staffTree: [ //组织人员
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
        ],
        dictData: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
        ],
        date: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
          { value: '>', label: '大于' },
          { value: '>=', label: '大于等于' },
          { value: '<', label: '小于' },
          { value: '<=', label: '小于等于' },
        ],
        time: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
          { value: '>', label: '大于' },
          { value: '>=', label: '大于等于' },
          { value: '<', label: '小于' },
          { value: '<=', label: '小于等于' },
        ],
        datePicker: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
          { value: '>', label: '大于' },
          { value: '>=', label: '大于等于' },
          { value: '<', label: '小于' },
          { value: '<=', label: '小于等于' },
        ],
        select: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
        ],
        number: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
          { value: '>', label: '大于' },
          { value: '>=', label: '大于等于' },
          { value: '<', label: '小于' },
          { value: '<=', label: '小于等于' },
        ],
        date: [
          { value: '==', label: '等于' },
          { value: '!=', label: '不等于' },
          { value: '包含', label: '包含' },
          { value: '不包含', label: '不包含' },
          { value: '>', label: '大于' },
          { value: '>=', label: '大于等于' },
          { value: '<', label: '小于' },
          { value: '<=', label: '小于等于' },
        ],

      },
      formName: "",
      // formItem: {
      //     fieldCode:null,
      //     opinion: null,
      //     detail: '',
      // },
      tableData: [
        // {
        //     fieldName:"起草人",
        //     fieldCode:"11",
        //     fieldState:"3", //(1---可编辑；2---只读,3---隐藏)，
        //     editRadio: true, //(true--显示是否编辑的单选按钮,false---不显示是否编辑的单选按钮,没有editRadio字段默认为true)
        //     fieldType: "text", //text--文本；number--数字类型；date--日期，select--选择类
        // },
      ],
      recallChecked: true,
      backChecked: true,
      btnName: {
        submit: '',
        save: ''
      },
      role: [],
      position: [],
      post: [],
      bu: [],
      charge: '',
      tabValue: '1',
      // roleOptions:[],
      positionObj: {},
      // roleObj:{},
      postObj: {},
      chargeObj: {},
      // buObj: {},
      // userTreeObj: { //部分人员id对应名字
      //     // "1511979336146808832": "wadadadad",
      //     // "1511979338172657664": "test8/123456",
      //     // "1511979338172657665": "水电费"
      // },
      allObj: {
        "0": "userTreeObj", //部门和人员
        "1": "roleObj", //角色
        "2": "positionObj", //岗位
        "3": "postObj", //职位
        "4": "chargeObj", //指定主管
        "5": "buObj", //业务单
      },
      positionOptions: [
        // { label: '员工', value: '员工' },
        // { label: '科长', value: '科长' },
        // { label: '部长', value: '部长' },
        // { label: '中心长', value: '中心长' },
        // { label: '总经理', value: '总经理' },
      ],
      postOptions: [
        // { label: '安全员', value: '安全员' },
      ],
      // buOptions:[
      //     // { label: '起草人', value: '起草人' },
      //     // { label: '责任部门责任人', value: '责任部门责任人' },
      //     // { label: '隐患整改责任人', value: '隐患整改责任人' },
      //     // { label: '整改担当', value: '整改担当' },
      // ],
      chargeOptions: [
        // { label: '起草人', value: '起草人 ' },
        // { label: '起草人的一级主管', value: '起草人的一级主管' },
        // { label: '起草人的二级主管', value: '起草人的二级主管' },
        // { label: '起草人的三级主管', value: '起草人的三级主管' },
        // { label: '起草人的四级主管', value: '起草人的四级主管' },
        // { label: '起草人的五级主管', value: '起草人的五级主管' },
      ],
      radioStyle: {
        display: 'flex',
        height: '30px',
        alignItems: 'center',
      },
      treeValue: undefined,
      // treeData: [],
      // userTreeData:[],
      toBear: [],
      saveBear: [],
      dictTypeList: [],
      currentNodeData: [],
    }
  },
  created() {
    this.initDict();
    // this.getDeptDict();
    // this.getRoleList();
    // this.getDeptUserTree();
    // this.getOrganizeTree();
    // this.getProcessField();
    // this.getDetailNgform();
    // this.getCompanyUserTree();
  },
  mounted() {
    // console.log("modeWrap==================",this.userTreeObj);
  },
  computed: {
    addNodeType() {
      return this.$store.state.setting.addNodeType
    },
    // tabStatus() {
    //     return this.$store.state.setting.tabStatus
    // },
    dictGroup() {
      return this.$store.state.setting.dictGroup
    },
    processNodeData() {
      return this.$store.state.setting.processNodeData
    },
    flowPermission1() {
      return this.$store.state.setting.flowPermission
    },
    approverConfig1() {
      return this.$store.state.approverConfig
    },
    copyerConfig1() {
      return this.$store.state.copyerConfig
    },
    conditionsConfig1() {
      return this.$store.state.conditionsConfig
    },
    tempId() {
      return this.$store.state.setting.tempId; //表单id
    },
    dictTypeData() {
      return this.$store.state.setting.dictTypeData; //字典项
    },
    userTreeObj() {
      return this.$store.state.setting.userTreeDict;
    },
    tableDataInfo() {
      return this.$store.state.setting.tableData;
    },
    formNameInfo() {
      return this.$store.state.setting.formName;
    },
    buObj() {
      return this.$store.state.setting.buObj;
    },
    buOptions() {
      return this.$store.state.setting.buOptions;
    },
    treeData() {
      return this.$store.state.setting.treeData;
    },
    deptData() {
      return this.$store.state.setting.deptData;
    },
    userTreeData() {
      return this.$store.state.setting.userTreeData;
    },
    roleObj() {
      return this.$store.state.setting.roleObj;
    },
    roleOptions() {
      return this.$store.state.setting.roleOptions;
    },
    nodeRules() {
      let nodeRules = {
        fieldCode: [
          { required: true, message: '必填项', trigger: 'change' },
        ],
        opinion: [
          { required: true, message: '必填项', trigger: 'change' },
        ],
        detail: [
          { required: true, message: '必填项', trigger: 'change' },
        ],
        dictType: [
          { required: true, message: '必填项', trigger: 'change' },
        ],
        dictValue: [
          { required: true, message: '必填项', trigger: 'change' },
        ],
        headPeople: [
          { required: true, validator: this.peopleValidator, trigger: 'change' },
        ],
        nullHeadPeople: [
          { required: true, validator: this.nullPeopleValidator, trigger: 'change' },
        ],

      }
      return nodeRules
    },
  },
  watch: {
    flowPermission1(data) {
      if (data.flag && data.id === this._uid) {
        this.$emit('update:flowPermission', data.value)
      }
    },
    approverConfig1(data) {
      if (data.flag && data.id === this._uid) {
        this.$emit('update:processNode', data.value)
      }
    },
    copyerConfig1(data) {
      if (data.flag && data.id === this._uid) {
        this.$emit('update:processNode', data.value)
      }
    },
    conditionsConfig1(data) {
      console.log(data)
      if (data.flag && data.id === this._uid) {
        this.$emit('update:processNode', data.value)
      }
    },
    tableDataInfo: {
      handler(val) {
        this.tableData = val;
      },
      immediate: true,
      deep: true,
    },
    formNameInfo: {
      handler(val) {
        this.formName = val;
      },
      immediate: true,
      deep: true,
    },
    // 选中的负责人集合成一个数组
    principalSelected: {
      handler(value) {
        // console.log("vvvv===================",value);
        const pa = [];
        value.map((item, index) => {
          // console.log("index===",item,index);
          for (let ele of item) {
            const element = {
              index,
              ele,
              value: ele
            }
            const val = this.allObj[index]
            element.value = this[val][ele]
            pa.push(element)
          }
        })
        this.principalAll = pa;
      },
      immediate: true,
      deep: true
    },
    // tabStatus: {
    // 	handler(newV) {
    // 		if(newV==2) {
    // 			this.getProcessField();
    //             this.getDetailNgform();
    // 		}
    // 	},
    // 	immediate: true,
    // 	deep: true,
    // },
    // addNodeType: {
    //     handler(newV) {
    // 		console.log("tyyyyyyyyy",newV);
    // 	},
    // 	immediate: true,
    // 	deep: true,
    // }
  },
  methods: {
    abc(value, item) {
      console.log("abhhhh", value, item);
      console.log("addNodeType", this.addNodeType);
      if (this.addNodeType == 4 && item.type == 7) {
        this.$antMessage.error("条件节点下不可直接新增条件节点~");
        this.$nextTick(() => {
          this.$store.commit("setting/setNodeType", null)
        })
      } else {
        item.nextNode = value;
      }

    },
    // 初始化字典
    initDict() {
      const positionArr = dictionary('position'); //职位
      const jobs = dictionary('jobs'); //职位
      const headUser = dictionary('headUser'); //指定主管
      this.positionOptions = positionArr.map(ele => {
        const pp = {
          label: ele.value,
          value: ele.key
        }
        return pp
      })
      this.postOptions = jobs.map(ele => {
        const pp = {
          label: ele.value,
          value: ele.key
        }
        return pp
      })
      this.chargeOptions = headUser.map(ele => {
        const pp = {
          label: ele.value,
          value: ele.key
        }
        return pp
      })
      this.positionObj = {};
      this.postObj = {};
      this.chargeObj = {};
      for (let pa of positionArr) {
        this.positionObj[pa.key] = pa.value;
      }
      for (let pa of jobs) {
        this.postObj[pa.key] = pa.value;
      }
      for (let pa of headUser) {
        this.chargeObj[pa.key] = pa.value;
      }
      // console.log("positionOptions====",this.positionOptions,this.positionObj,this.postObj,this.chargeObj);
    },
    // 负责人字段校验
    peopleValidator(rule, value, callback) {
      let all = [];
      for (let pal of this.savePrincipal) {
        all = [...all, ...pal];
      }
      if (all.length <= 0) {
        return Promise.reject(`不能为空`)
      } else {
        callback()
      }
    },
    // 负责人为空校验
    nullPeopleValidator(rule, value, callback) {
      if (this.saveBear.length <= 0) {
        return Promise.reject(`不能为空`)
      } else {
        callback()
      }
    },
    // 根据字典项获取字典值
    dictTypeChange(value) {
      if (value) {
        const dictTypeList = this.dictTypeData.find(item => {
          return item.dictType == value
        })
        this.dictTypeList = dictTypeList.dictItem;
      }
      this.dictForm.dictValue = undefined;
    },
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // 点击某个节点
    nodeClick(node) {
      // console.log("66666666666666666666",node,this.processNode);
      // console.log("dictGroup",this.dictGroup,this.processNodeData);
      this.drawerVisible = true;

      if (node.type == 0) {
        this.drawerTitle = "申请人";
        this.drawerType = '0';
      } else if (node.type == 1) {
        this.drawerTitle = "填写节点";
        this.drawerType = '1';
      } else if (node.type == 2) {
        this.drawerTitle = "审批节点";
        this.drawerType = '2';
      }

      this.currentNodeData = this.processNodeData.find(item => {
        return item.nodeId == node.id
      })
      console.log("currentNodeData", this.currentNodeData, this.dictGroup);
      if (this.currentNodeData) {
        // 给节点抽屉赋值
        this.dictForm = this.currentNodeData.dictForm;
        if (this.drawerType == '0') {
          this.applicant = this.currentNodeData.applicantStatus;
          this.btnName.submit = this.currentNodeData.buttonOneText;
          this.btnName.save = this.currentNodeData.buttonTwoText;
          this.recallChecked = this.currentNodeData.revokeStatus;
        } else if (this.drawerType == '1') {
          this.btnName.submit = this.currentNodeData.buttonOneText;
          this.backChecked = this.currentNodeData.revokeStatus;
          this.savePrincipal = this.currentNodeData.headPeople;
          this.saveBear = this.currentNodeData.nullHeadPeople;

        } else if (this.drawerType == '2') {
          this.btnName.submit = this.currentNodeData.buttonOneText;
          this.btnName.save = this.currentNodeData.buttonTwoText;
          this.savePrincipal = this.currentNodeData.headPeople;
          this.saveBear = this.currentNodeData.nullHeadPeople;
          this.approvalType = this.currentNodeData.approveType;
        }

        if (!this.dictForm.dictValue) {
          this.dictTypeChange(this.dictForm.dictType);
        } else {
          const dictTypeList = this.dictTypeData.find(item => {
            return item.dictType == this.dictForm.dictType
          })
          this.dictTypeList = dictTypeList.dictItem;
        }
      } else {
        this.dictForm.dictType = this.dictGroup; //给基础设置的字典组赋值
        this.dictTypeChange(this.dictGroup);
      }

      if (this.currentNodeData && this.currentNodeData.fieldJson) {
        this.tableData = this.currentNodeData.fieldJson;
      } else {
        const params = {
          nodeId: this.processNode.id,
          tempId: this.tempId,
        }
        // 获取节点的字段权限值
        SelectProcessField(params).then(res => {
          // console.log("res=====node================",res);
          if (res.code == 20000) {
            const data = res.data;
            this.tableData = JSON.parse(data.tableData);
            this.formName = data.formName;
            if (this.tableData && this.tableData.length >= 1) {
              const radioValue = this.tableData[0].fieldState;
              this.changeEditRadio(radioValue);
            }
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 字段权限全选
    changeRadioAll(value) {
      const state = value.target.value
      this.tableData.forEach(element => {
        element.fieldState = state;
      });
    },
    // 表单字段下每个字段的选择
    changeEditRadio(radioValue) {
      const all = this.tableData.every(ele => {
        return ele.fieldState == radioValue;
      })
      if (all) {
        this.radioAllvalue = radioValue;
      } else {
        this.radioAllvalue = undefined;
      }
    },
    // 获取字段权限的初始化数据
    getProcessField() {
      const params = {
        // nodeId: this.processNode.id,
        tempId: this.tempId,
      }
      // 获取节点的字段权限值
      SelectProcessField(params).then(res => {
        if (res.code == 20000) {
          const data = res.data;
          this.tableData = JSON.parse(data.tableData);
          this.formName = data.formName;
        }
      }).catch(err => {
        console.log(err);
      })

    },
    // date 2022-02-22
    dateChange(value, ind, index) {
      this.formList[ind][index].detail = moment(value).format('YYYY-MM-DD');
    },
    // datePicker 2022-02-22 11:11:11
    datePickerChange(value, ind, index) {
      this.formList[ind][index].detail = moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
    // time 11:11
    timeChange(value, ind, index) {
      this.time = moment(value).format('YYYY-MM-DD HH:mm');
      this.formList[ind][index].detail = this.time.split(" ")[1];
    },
    // 条件设置字段选择
    fieldChange(value, ind, index) {
      console.log("=========================", value, ind, index);
      const obj = this.fieldData(value);
      console.log("jjjjj------", obj);
      if (obj.fieldType == "dictData") {
        if (!obj.dictKey) {
          this.formList[ind][index].judgement = [];
          this.formList[ind][index].opinion = undefined;
          this.formList[ind][index].detail = '';
          this.$antMessage.error("该字段未配置相应的字典值数据")
          return
        }
        const dictTypeList = this.dictTypeData.find(item => {
          return item.dictType == obj.dictKey;
        })
        this.formList[ind][index].dictDataList = dictTypeList.dictItem;
      } else if (obj.fieldType == "select") {
        this.formList[ind][index].selectList = obj.dictKey ? JSON.parse(obj.dictKey) : []
      }

      this.formList[ind][index].detail = undefined;
      this.formList[ind][index].judgement = [];
      this.$nextTick(() => {
        this.formList[ind][index].fieldType = obj.fieldType;
        this.formList[ind][index].judgement = this.judgementObj[obj.fieldType];
        this.formList[ind][index].opinion = undefined;
      })
    },
    // 根据id筛选整条数据
    fieldData(id) {
      return this.tableData.find((item) => {
        return item.fieldCode == id;
      });
    },
    // 根据id筛选整条数据
    fieldDetailData(id) {
      const data = this.tableData.find((item) => {
        return item.fieldCode == id;
      });
      if (data.dictKey) {
        return JSON.parse(data.dictKey)
      } else {
        return []
      }
    },
    // 部分人员切换
    onChange(value) {
      this.treeValue = value;
      this.principalSelected.splice(0, 1, value);
    },
    // 角色切换
    roleChange(value) {
      this.principalSelected.splice(1, 1, value);
    },
    // 职位多选切换
    positionChange(value) {
      this.principalSelected.splice(2, 1, value);
    },
    // 岗位多选切换
    postChange(value) {
      this.principalSelected.splice(3, 1, value);
    },
    // 指定主管切换
    chargeChange(value) {
      this.principalSelected.splice(4, 1, [value.target.value]);
    },
    // 业务单切换
    buChange(value) {
      this.principalSelected.splice(5, 1, value);
    },
    // 条件设置弹框显示
    nodeCondition(node) {
      console.log("条件。。vvv===", node);
      this.conditionId = node.id;
      // this.formList = node.formList?_.cloneDeep(node.formList):cond;
      if (node.formList) {
        this.formList = _.cloneDeep(node.formList);
      } else {
        const cond = [[{
          id: nanoid().replace(/[0-9]/g, '').replace(/_/g, "").replace(/-/g, ''), //条件id，前端生成
          andOr: "", //且或条件
          fieldCode: undefined, //下拉字段选择，string类型
          opinion: undefined, //选择项，string类型
          detail: undefined, //input输入框
          judgement: [], //根据不同的下拉字段，生成的判定方法，方便前端for循环使用
          fieldType: 'text',
        }]]
        this.formList = cond;
      }
      this.visible = true;
    },
    onClose() {
      console.log("iiiii");
      this.drawerVisible = false;
    },
    // 关闭选项
    cancelFn() {
      this.visible = false;
    },
    // 抽屉-确定
    confirmDrawer() {
      if (this.drawerType == '1' || this.drawerType == '2') {
        //负责人和负责人为空的校验
        if (!formValidator.formAll(this, 'principalForm')) {
          return
        }
      }
      // 未切换到基础设置tab项时候dictForm找不到，值为underfined
      if (this.$refs.dictForm) {
        let all = false;
        this.$refs.dictForm.validate((valid) => {
          all = Boolean(valid);
        })
        if (!all) {
          return
        }
      }
      if (!this.dictForm.dictValue) {
        this.$antMessage.error("该节点下有必填项为空")
        return
      }

      let nodeDetail = {
        type: this.processNode.type, //节点类型
        applicantStatus: this.drawerType == '0' ? this.applicant : '', //申请人类型
        revokeStatus: this.drawerType == '0' ? this.recallChecked : this.drawerType == '1' ? this.backChecked : '', //是否允许撤回
        buttonOneText: this.btnName.submit,//提交/通过按钮文案
        buttonTwoText: this.drawerType == '0' ? this.btnName.save : this.drawerType == '2' ? this.btnName.save : '',//保存/驳回按钮文案
        approveType: this.drawerType == '2' ? this.approvalType : '',//审批类型.1或签,2会签
        fieldJson: this.tableData,//数据权限
        nodeName: this.processNode.nodeName,
        nodeId: this.processNode.id,
        dictForm: _.cloneDeep(this.dictForm),
        headPeople: this.savePrincipal, //负责人列表
        nullHeadPeople: this.saveBear //负责人为空的数据
      };
      console.log('nodeDetail', nodeDetail);
      this.$bus.$emit("nodeDrawer", nodeDetail)

      if (this.drawerType == '0') {
        this.processNode.nodeContent = '所有人';
      } else {
        let str = '';
        this.savePrincipal.map((item, index) => {
          for (let ele of item) {
            const val = this.allObj[index]
            str = str + this[val][ele] + ';'
          }
        })
        this.principalStr = str;
        this.processNode.nodeContent = str;
      }
      const params = {
        nodeId: this.processNode.id,
        tableData: this.tableData,
      }
      this.drawerVisible = false;
    },
    // 且条件
    AndCondition(ind, index) {
      // console.log("且条件。。。。。",ind,index,this.formList);
      const cond = {
        id: nanoid().replace(/[0-9]/g, '').replace(/_/g, "").replace(/-/g, ''), //条件id，前端生成
        andOr: "&&", //且或条件
        fieldCode: undefined, //下拉字段选择，string类型
        opinion: undefined, //选择项，string类型
        detail: undefined, //input输入框
        judgement: [], //根据不同的下拉字段，生成的判定方法，方便前端for循环使用
        fieldType: "text" //字段类型
      };
      this.formList[ind].push(cond);
      // this.formList.push(cond);
    },
    // 或条件
    OrCondition() {
      const cond = [{
        id: nanoid().replace(/[0-9]/g, '').replace(/_/g, "").replace(/-/g, ''),
        andOr: "||",
        fieldCode: undefined,
        opinion: undefined,
        detail: undefined,
        judgement: [],
        fieldType: "text",
      }];
      this.formList.push(cond);
      // console.log("添加了一个或。。。",this.formList);
    },
    // 删除某个条件
    deleteCondition(ind, index) {
      console.log(ind, index, this.formList[ind]);
      const andOr = this.formList[ind][index].andOr;
      const nextList = this.formList[ind][index + 1];
      // 如果删除的是或数据，而且其下面还有数据，则将下面的数据改为或
      if (andOr == '||' && nextList) {
        if (nextList.andOr == '&&') {
          this.formList[ind][index + 1].andOr = '||'
        }
      }
      if (this.formList[ind].length <= 1) {
        this.formList.splice(ind, 1);
      } else {
        this.formList[ind].splice(index, 1);
      }
    },
    focus() {
      console.log('focus');
    },

    handleChange(value) {
      console.log(`selected ${value}`);
    },
    // 点击负责人-选择人员
    principalClick() {
      // console.log("选择负责人。。。。",this.userTreeObj);
      this.principalSelected = JSON.parse(JSON.stringify(this.savePrincipal));
      this.principalVisible = true;
      this.treeValue = this.principalSelected[0];
      this.role = this.principalSelected[1];
      this.position = this.principalSelected[2];
      this.post = this.principalSelected[3];
      this.charge = this.principalSelected.length == 0 ? "" : this.principalSelected[4].length == 0 ? '' : this.principalSelected[4][0];
      this.bu = this.principalSelected[5];
    },
    // 点击负责人
    principalNone() {
      this.toBear = this.saveBear;
      this.principalNoneVisible = true;
    },
    // 条件设置弹框-确定
    submitCondition() {
      console.log("条件确定。。。。。", this.processNode, this.formList);
      // 动态表单必填项的校验
      let all = [];
      for (let ind = 0; ind < this.formList.length; ind++) {
        const ele = this.formList[ind];
        for (let index = 0; index < ele.length; index++) {
          const ru = 'ruleForm' + ind + index;
          this.$refs[ru][0].validate((valid) => {
            all.push(Boolean(valid))
          })

        }
        // const ru = 'ruleForm' + ind;
        // this.$refs[ru][0].validate((valid) => {
        //     all.push(Boolean(valid))
        // })
      }
      for (let item of all) {
        if (!item) {
          return
        }
      }
      const formListAll = [].concat(...this.formList); //展开数组里面的数组
      console.log("formListAll===", formListAll);
      let condition = '(';
      let expression = '('; //后端表达式
      // this.formList.map(ele=>{
      formListAll.map(ele => {
        const obj = this.fieldData(ele.fieldCode);
        console.log("obj==", obj);
        if (obj) {
          // const andOr = ele.andOr?ele.andOr:'';
          const andOr = ele.andOr ? ele.andOr == '&&' ? "&&" : ')||(' : '';
          if (obj.fieldType == 'select') {
            const dictArr = JSON.parse(obj.dictKey);
            const kv = dictArr.find(item => {
              return item.value == ele.detail
            })
            if (!kv) {
              this.$antMessage.error(ele.detail + "未匹配到对应的值，请重新选择");
              this.selectRest = false;
              return
            } else {
              this.selectRest = true;
            }
            const detail = kv.label
            condition = condition + andOr + this.fieldData(ele.fieldCode).fieldName + ele.opinion + detail + ';'
          } else if (obj.fieldType == 'staffTree') {
            const array = ele.detail;
            let nameDetail = '';
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              const name = this.userTreeObj[element];
              console.log(name, element);
              nameDetail = nameDetail + name + ';';
            }
            condition = condition + andOr + this.fieldData(ele.fieldCode).fieldName + ele.opinion + nameDetail + ';'
          } else if (obj.fieldType == 'organizeTree') {
            const element = ele.detail;
            let nameDetail = '';
            let name = this.userTreeObj[element]
            nameDetail = nameDetail + name + ';';
            condition = condition + andOr + this.fieldData(ele.fieldCode).fieldName + ele.opinion + nameDetail + ';'
          }
          else if (obj.fieldType == 'dictData') {
            const labelObj = ele.dictDataList.find(val => {
              return val.dictValue == ele.detail
            })
            condition = condition + andOr + this.fieldData(ele.fieldCode).fieldName + ele.opinion + labelObj.dictValue + ';'
          } else {
            condition = condition + andOr + this.fieldData(ele.fieldCode).fieldName + ele.opinion + ele.detail + ';'
          }
          expression = expression + andOr + ele.fieldCode + ele.opinion + "'" + ele.detail + "'" + ';'
        }
      })
      if (!this.selectRest) return;
      this.processNode.branchNodes.forEach(element => {
        if (element.id == this.conditionId) {
          element.formList = _.cloneDeep(this.formList);
          element.conditionExpression = expression + ')'; //后端需要的字段格式
          element.condition = condition + ')'; //前端用于回显数据
        }
      });
      this.visible = false;
      this.formList = [];
    },
    // 选择负责人弹框-确定
    submitPrincipal() {
      console.log("hhhh=====", this.principalSelected, this.tabValue);
      this.tabValue = this.activePrincipal
      this.savePrincipal = JSON.parse(JSON.stringify(this.principalSelected));
      this.principalVisible = false;
    },
    submitPrincipalNone() {
      console.log("负责人为空。。。", this.toBear);
      this.saveBear = JSON.parse(JSON.stringify(this.toBear));
      this.principalNoneVisible = false;
    },
    // 取消
    cancelPrincipal() {
      this.principalVisible = false;
    },
    // 取消
    cancelPrincipalNone() {
      this.principalNoneVisible = false;
    },
    // 删除
    deleteBear(item) {
      this.toBear = this.toBear.filter(ele => {
        return ele != item;
      })
    },
    // 删除选择负责人弹框中选中的负责人
    deletePrincipal(item) {
      // console.log("gggggg=====",item,this.principalObj[item.index]);
      if (item.index == "4") {
        this.charge = '';
      } else {
        const tabValue = this.principalObj[item.index];
        // console.log(this[tabValue],'uuuuuuu');
        this[tabValue] = this[tabValue].filter(element => {
          return element != item.ele;
        })
      }
      // console.log("kkkk",this.principalSelected);
      const ind = this.principalSelected[item.index].indexOf(item.ele);
      this.principalSelected[item.index].splice(ind, 1);
    },
    // 清空
    clearBear() {
      this.toBear = [];
    },
    // 清空
    clearPrincipal() {
      this.treeValue = [];
      this.role = [];
      this.position = [];
      this.post = [];
      this.bu = [];
      this.charge = '';
      this.principalSelected = [[], [], [], [], [], []],
        this.principalAll = [];
    },
    clickEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, true)
      } else {
        this.isInput = true;
      }
    },
    blurEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, false)
        this.processNode.branchNodes[index].nodeName = this.processNode.branchNodes[index].nodeName ? this.processNode.branchNodes[index].nodeName : "条件"
      } else {
        this.isInput = false;
        this.processNode.nodeName = this.processNode.nodeName ? this.processNode.nodeName : this.placeholderList[this.processNode.type]
      }
    },
    delNode(processNode) {
      console.log("kkkkkk====", processNode);
      this.$emit("update:processNode", this.processNode.nextNode);
      this.$store.commit("setting/delNodeProcessId", processNode.id)
    },
    parall() {
      let len = this.processNode.branchNodes.length + 1
      this.processNode.branchNodes.push({
        //"nodeName": "条件" + len,
        "type": 4,
        "nodeType": "parallel",
        "nextNode": null
      });
      this.$emit("update:processNode", this.processNode);
    },
    addTerm() {
      let len = this.processNode.branchNodes.length + 1
      this.processNode.branchNodes.push({
        "nodeName": "条件" + len,
        "id": nanoid().replace(/[0-9]/g, '').replace(/_/g, "").replace(/-/g, ''),
        // "type": 3,
        "type": 7,
        "nextNode": null,
      });
      this.$emit("update:processNode", this.processNode);
    },
    delTerm(index) {
      console.log("term==========", index);
      this.processNode.branchNodes.splice(index, 1)
      this.processNode.branchNodes.map((item, index) => {
        item.priorityLevel = index + 1
        item.nodeName = `条件${index + 1}`
      });
      this.$emit("update:processNode", this.processNode);
      if (this.processNode.branchNodes.length == 1) {
        if (this.processNode.nextNode) {
          if (this.processNode.branchNodes[0].nextNode) {
            this.reData(this.processNode.branchNodes[0].nextNode, this.processNode.nextNode)
          } else {
            this.processNode.branchNodes[0].nextNode = this.processNode.nextNode
          }
        }
        this.$emit("update:processNode", this.processNode.branchNodes[0].nextNode);
      }
    },
    reData(data, addData) {
      if (!data.nextNode) {
        data.nextNode = addData
      } else {
        this.reData(data.nextNode, addData)
      }
    },
    setPerson(priorityLevel) {
      var { type } = this.processNode;
      if (type == 0) {
        this.$store.commit('updatePromoter', true)
        this.$store.commit('updateFlowPermission', {
          value: this.flowPermission,
          flag: false,
          id: this._uid
        })
      } else if (type == 1) {
        this.$store.commit('updateApprover', true)
        this.$store.commit('updateApproverConfig', {
          value: {
            ...JSON.parse(JSON.stringify(this.processNode)),
            ...{ settype: this.processNode.settype ? this.processNode.settype : 1 }
          },
          flag: false,
          id: this._uid
        })
      } else if (type == 2) {
        this.$store.commit('updateCopyer', true)
        this.$store.commit('updateCopyerConfig', {
          value: JSON.parse(JSON.stringify(this.processNode)),
          flag: false,
          id: this._uid
        })
      } else {
        this.$store.commit('updateCondition', true)
        this.$store.commit('updateConditionsConfig', {
          value: JSON.parse(JSON.stringify(this.processNode)),
          priorityLevel,
          flag: false,
          id: this._uid
        })
      }
    },
    arrTransfer(index, type = 1) {//向左-1,向右1
      this.processNode.branchNodes[index] = this.processNode.branchNodes.splice(index + type, 1, this.processNode.branchNodes[index])[0];
      this.processNode.branchNodes.map((item, index) => {
        item.priorityLevel = index + 1
      })
      this.$emit("update:processNode", this.processNode);
    }
  }
}
</script>
<style lang='less' scoped>
.ant-drawer-open {
  z-index: 999;
}
/deep/ .ant-drawer-header {
  padding: 16px 20px;
}
.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}
.promoter_person .el-dialog__body {
  padding: 10px 20px 14px 20px;
}
.selected_list {
  margin-bottom: 20px;
  line-height: 30px;
}
.selected_list span {
  margin-right: 10px;
  padding: 3px 6px 3px 9px;
  line-height: 12px;
  white-space: nowrap;
  border-radius: 2px;
  border: 1px solid rgba(220, 220, 220, 1);
}
.selected_list img {
  margin-left: 5px;
  width: 7px;
  height: 7px;
  cursor: pointer;
}

.form-auth-table {
  font-size: 14px;
  .auth-table-header {
    background: #fafafa;
    line-height: 40px;
    color: #000;
    ::v-deep .ant-radio-group {
      .radio1 {
        margin-right: 11px;
      }
      .radio2 {
        margin-right: 23px;
      }
      .radio3 {
        margin-right: -10px;
      }
    }
  }
  .row {
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 8px 12px;
    border-bottom: 1px solid #efefef;
    &:hover {
      background: #f5f7fa;
    }
    .label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .required {
        color: #f2725e;
      }
    }
    .radio-group {
      flex: 2;
      display: flex;
      justify-content: space-between;
    }
  }
  ::v-deep .auth-table-body {
    .row {
      padding-right: 36px;
    }
  }
}
.recall {
  display: flex;
  justify-content: space-between;
}
.notes {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  display: inherit;
}
.applicant {
  font-size: 14px;
  color: #181818;
}
.approval-type {
  ::v-deep .ant-form-item {
    width: 100%;
    .ant-form-item-control-wrapper {
      width: 63%;
      margin-left: 10px;
      .ant-select-selection {
        border: 1px solid #d9d9d9;
      }
    }
  }
}
.btn-content {
  margin-top: 10px;
  .btn {
    margin-top: 10px;
    ::v-deep .ant-btn {
      margin-right: 10px;
    }
    ::v-deep .ant-form-item {
      padding-bottom: 10px;
    }
    ::v-deep .ant-col {
      width: 100%;
    }
  }
}
.tab-content {
  margin-top: 24px;
  ::v-deep .ant-tabs-nav {
    width: 100%;
    & > div:nth-child(1) {
      width: 100%;
      height: 38px;
      display: flex;
      justify-content: space-between;
      .ant-tabs-tab {
        width: 50%;
        height: 36px;
        font-size: 14px;
        color: #666;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f6f7ff;
        border: 1px solid #eee;
        box-sizing: border-box;
        border-radius: 4px;
        margin: 0 !important;
      }
      .ant-tabs-tab-active {
        color: #0067cc;
        border: 1px solid #66a4e1;
        text-shadow: unset !important;
      }
      & > div:nth-child(1) {
        border-top-right-radius: 0;
      }
      & > div:nth-child(1) {
        border-bottom-right-radius: 0;
      }
      & > div:nth-child(2) {
        border-bottom-left-radius: 0;
      }
      & > div:nth-child(2) {
        border-top-left-radius: 0;
      }
    }

    .ant-tabs-ink-bar {
      display: none !important;
    }
  }
  ::v-deep .ant-tabs-bar {
    border-bottom: none !important;
  }
}
.write-approval {
  width: 100%;
  ::v-deep .ant-form {
    .ant-form-item {
      margin-right: 0;
      padding-bottom: 0;
    }
    & > .ant-form-item:nth-child(1) {
      margin-right: 4px;
    }
    .ant-form-item-label {
      label::after {
        margin-right: 2px;
      }
    }
    .ant-btn-primary {
      padding: 0 13px !important;
    }
  }
}

.dialog-modal {
  ::v-deep .ant-modal {
    width: 900px !important;
  }
}

.principal-content {
  width: 100%;
  display: flex;
  justify-content: left;
  min-height: 240px;
  .left {
    width: 30%;
    .title-content {
      height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      .title {
        font-size: 14px;
        color: #000;
      }
    }
    ul {
      li {
        font-size: 14px;
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .right {
    width: 70%;
    padding: 0 5px;
    box-sizing: border-box;
    border-left: 1px solid #eee;
    ::v-deep .ant-checkbox-group-item {
      display: block;
      margin-bottom: 5px;
    }
    .check-title {
      color: #000;
      margin-bottom: 8px;
    }
    .empty {
      text-align: center;
    }
  }
}
.principal-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 0 !important;
  }
  ::v-deep .model-content {
    padding: 0 20px !important;
  }
}
.settlement-condition {
  ::v-deep .model-content {
    padding: 0 28px !important;
  }
  ::v-deep .model-content-form {
    padding: 0 28px !important;
  }
  ::v-deep .ant-form-item-control-wrapper {
    padding-left: 4px;
  }
  ::v-deep .ant-input-number {
    width: 100%;
    height: 38px;
    .ant-input-number-input {
      height: 38px;
    }
  }
  ::v-deep .ant-select-selection--multiple {
    overflow-y: auto;
  }
  ::v-deep .ant-form-item {
    padding-bottom: 20px;
  }
  .condition-form {
    background: #f9f9f9;
    padding: 10px 0 0 0;
  }
  .dash-btn {
    margin: 0 -6px 0;
    background: #f9f9f9;
    padding-bottom: 10px;
  }
  .dash-or-btn {
    margin: 10px -6px 0;
  }
}
.form-text {
  height: 38px;
  line-height: 38px;
}
</style>
