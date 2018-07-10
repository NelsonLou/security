<template>
<div id='role'>
  <el-card class="box-card">
    <!--工具条-->
    <div slot="header" class="card-header">
      <el-button v-if='permission_List.roleAdd.status' @click="handleAdd" type="primary" icon="plus" class="header-right">添加</el-button>
    </div>

    <!-- 列表 -->
    <wk-table-base ref="wk-table" :columns="data.columns" @query="getData">
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <!-- 操作按钮 -->
          <el-button v-if='permission_List.roleEdit.status' @click="handleEdit(scope.row, 1)" type="primary" size="small" icon="edit">编辑</el-button>
          <el-button v-if='permission_List.permissionRoleAdd.status' @click="handleEdit(scope.row, 2)" type="primary" size="small" icon="setting">权限</el-button>
          <!-- <el-button @click="handleDel(scope.row)" type="danger" size="small" icon="delete">删除</el-button> -->
  			</template>
      </el-table-column>
    </wk-table-base>

    <!--编辑添加对话框-->
    <el-dialog :visible.sync="dialogVisible" :title="formType === 0 ? '添加角色' : formType === 1 ? '编辑角色' : '设置权限'" size="small">
      <!-- 表单 角色 -->
      <div v-if="formType !== 2">
        <wk-form-base :key="editFormKey" ref="wk-form" :form-item="data.editItem" :form-rule="data.editRule" @submit="editSave" @query="getData" labelWidth="130px">
          <!-- 表单按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
            <!-- <el-button @click="resetForm">重置</el-button> -->
          </el-form-item>
        </wk-form-base>
      </div>
      <!-- 表单 权限 -->
      <div v-else>
        <el-form v-loading.body="permissLoading" label-width="130px" style="max-width:100%">
          <el-checkbox-group v-model="hasPermissionList">
            <div v-for="(title,indexP) in permissionList" :key="title.id" class="selectGrp">
              <el-checkbox :label="title.id" :indeterminate="title.isIndeterminate" @change="checkedChange(title.name)" class="selectFir">{{title.display_name}}</el-checkbox>
              <div v-for="(setting,indexC) in title.child" :key="setting.id">
                <el-checkbox :label="setting.id" :indeterminate="setting.isIndeterminate" @change="checkedChange(setting.name)" class="selectSec">{{setting.display_name}}</el-checkbox>
                <div class="checkboxGroup" style="padding:0 0 0 95px">
                  <el-checkbox v-for="option in setting.child" :label="option.id" @change="checkedChange(option.name)" :key="option.id" class="selectThi">{{option.display_name}}</el-checkbox>
                </div>
              </div>
            </div>
          </el-checkbox-group>
          <el-form-item style="margin:20px 100px 0 0;text-align:center">
            <el-button @click="submitForm" :loading="submitLoading" type="primary">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import data from './Data/roles'

export default {
  name: 'Role',
  data: () => ({
    data,
    // 筛选关键字
    filters: {},
    // 列表加载
    permissLoading: false,
    submitLoading: false,
    // 是否显示编辑对话框
    dialogVisible: false,
    formType: 0,
    editFormKey: 1,
    rowId: 0,
    r_level: 0,
    // 编辑权限
    hasPermissionList: [],
    permissionList: []
  }),
  mounted() {
    this.getData()
  },
  methods: {
    // 获取角色列表
    getData(obj) {
      if (obj) {
        this.filters = obj
      }
      // 请求参数
      const para = Object.assign({}, this.filters)
      // 调用组件获取数据
      this.$refs['wk-table'].query(this.$api.setting.roleList, para, 'role_list')
    },
    // 打开角色添加
    handleAdd() {
      this.formType = 0
      this.dialogVisible = true
      this.editFormKey = Date.parse(new Date()) / 1000
    },
    // 打开角色关闭
    handleClose() {
      this.dialogVisible = false
    },
    // 打开编辑对话框
    handleEdit(row, type) {
      this.editFormKey = Date.parse(new Date()) / 1000
      this.rowId = row.id
      this.r_level = row.r_level
      this.formType = type
      const para = {
        role_id: row.id
      }
      if (type === 1) {
        this.dialogVisible = true
        this.$nextTick(() => {
          // 调用组件获取数据
          this.$refs['wk-form'].query(this.$api.setting.roleDetail, para, 'role_info')
        })
      } else {
        this.dialogVisible = true
        this.permissLoading = true
        this.axios.get(this.$api.setting.permissionRoleDetail, {
          params: para
        }).then(res => {
          this.permissLoading = false
          if (res.data.code === 1) {
            let data = res.data.data
            this.hasPermissionList = data.has_permission_list
            this.permissionList = data.permission_list
            for (let i = 0; i < this.permissionList.length; i++) {
              this.$set(this.permissionList[i], 'isIndeterminate', false)
              let child = this.permissionList[i].child
              for (let j = 0; j < child.length; j++) {
                this.$set(child[j], 'isIndeterminate', false)
              }
            }
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 提交编辑
    submitForm() {
      var para = {}
      if (this.formType !== 2) {
        this.$refs['wk-form'].submit()
      } else {
        // 编辑权限
        this.submitLoading = true
        // 将不确定项的id加入到已选id中
        var pList = this.permissionList
        var child = []
        for (let i = 0; i < pList.length; i++) {
          child = pList[i].child
          if (pList[i].isIndeterminate === true) {
            this.hasPermissionList.push(pList[i].id)
          }
          for (let j = 0; j < child.length; j++) {
            if (child[j].isIndeterminate === true) {
              this.hasPermissionList.push(child[j].id)
            }
          }
        }
        const ids = this.hasPermissionList.map(item => item).toString()
        para = {
          role_id: this.rowId,
          permission_id: ids,
          r_level: this.r_level
        }
        this.axios.post(this.$api.setting.permissionRoleAdd, para).then(res => {
          this.submitLoading = false
          this.dialogVisible = false
          if (res.data.code === 1) {
            this.$message.success(res.data.msg)
            this.getData()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(error => {
          console.log(error)
        }).then(() => {
          this.submitLoading = false
          this.dialogVisible = false
        })
      }
    },
    // 编辑保存角色
    editSave(obj) {
      this.dialogVisible = false
      // 判断编辑或添加接口
      const url = obj.id ? this.$api.setting.roleEdit : this.$api.setting.roleAdd
      // 添加请求参数
      const para = {
        name: obj.name,
        display_name: obj.display_name,
        r_level: obj.r_level,
        description: obj.description
      }
      console.log(para)
      // 编辑请求参数
      if (obj.id) {
        para.role_id = obj.id
      }
      // 调用组件提交数据
      this.$refs['wk-form'].save(url, para)
    },
    // 重置表单
    // resetForm() {
    //   this.$refs['wk-form'].reset()
    // },
    // 删除角色
    handleDel(row) {
      // 请求参数
      const para = {
        role_id: row.id
      }
      // 调用组件删除数据
      this.$refs['wk-table'].delete(this.$api.setting.roleDelete, para)
    },
    // 批量删除
    // handleBatchDel(obj) {
    //   const ids = obj.map(item => item.id).toString()
    //   const para = {
    //     role_id: ids
    //   }
    //   this.$refs['wk-table'].delete(this.$api.setting.roleDelete, para, 'batch')
    // },
    // 权限选择
    // 判断某个层级是否全选
    isCheckAll(cList) {
      let checked = this.hasPermissionList
      let exist = 0
      for (let i = 0; i < cList.length; i++) {
        for (let j = 0; j < checked.length; j++) {
          if (cList[i].id === checked[j]) {
            exist++
          }
        }
      }
      if (exist === cList.length) {
        return true
      }
      return false
    },
    // 判断某个层级是否全选
    isCheckSome(cList) {
      let checked = this.hasPermissionList
      for (let i = 0; i < cList.length; i++) {
        for (let j = 0; j < checked.length; j++) {
          if (cList[i].id === checked[j]) {
            return true
          }
        }
      }
      return false
    },
    // 判断某个层级是否部分不确定
    isIndetSome(cList) {
      for (let i = 0; i < cList.length; i++) {
        if (cList[i].isIndeterminate === true) {
          return true
        }
      }
      return false
    },
    // 判断某项是否被选中
    isChecked(opt) {
      let checked = this.hasPermissionList
      for (let i = 0; i < checked.length; i++) {
        if (opt === checked[i]) {
          return true
        }
      }
      return false
    },
    // 选中全部
    checkAll(cList) {
      let checked = this.hasPermissionList
      let exist = false
      for (let i = 0; i < cList.length; i++) {
        exist = false
        for (let j = 0; j < checked.length; j++) {
          if (cList[i].id === checked[j]) {
            exist = true
          }
        }
        if (!exist) {
          checked.push(cList[i].id)
        }
      }
    },
    // 取消全选
    cancelAll(cList) {
      let checked = this.hasPermissionList
      for (let i = 0; i < cList.length; i++) {
        for (let j = 0; j < checked.length; j++) {
          if (cList[i].id === checked[j]) {
            checked.splice(j, 1)
            break
          }
        }
      }
    },
    // 选中父类
    checkParent(opt) {
      let checked = this.hasPermissionList
      let exist = false
      for (let i = 0; i < checked.length; i++) {
        if (opt === checked[i]) {
          exist = true
        }
      }
      if (!exist) {
        checked.push(opt)
      }
    },
    // 取消父类选中
    cancleParent(opt) {
      let checked = this.hasPermissionList
      for (let i = 0; i < checked.length; i++) {
        if (opt === checked[i]) {
          checked.splice(i, 1)
          break
        }
      }
    },
    // 权限 三级多选逻辑
    checkedChange(name) {
      var pList = this.permissionList
      var child = []
      var grandChild = []
      // 第一级
      for (let i = 0; i < pList.length; i++) {
        child = pList[i].child
        if (pList[i].name === name) {
          pList[i].isIndeterminate = false
          if (this.isChecked(pList[i].id)) {
            this.checkAll(child)
            for (let k = 0; k < child.length; k++) {
              child[k].isIndeterminate = false
              this.checkAll(child[k].child)
            }
          } else {
            this.cancelAll(child)
            for (let k = 0; k < child.length; k++) {
              this.cancelAll(child[k].child)
            }
          }
          break
        }
        // 第二级
        for (let j = 0; j < child.length; j++) {
          grandChild = child[j].child
          if (child[j].name === name) {
            pList[i].isIndeterminate = false
            child[j].isIndeterminate = false
            if (this.isChecked(child[j].id)) {
              this.checkAll(grandChild)
            } else {
              this.cancelAll(grandChild)
            }
            if (this.isCheckAll(child)) {
              this.checkParent(pList[i].id)
            } else {
              this.cancleParent(pList[i].id)
              if (this.isCheckSome(child) || this.isIndetSome(child)) {
                pList[i].isIndeterminate = true
              }
            }
            break
          }
          // 第三级
          for (var m = 0; m < grandChild.length; m++) {
            if (grandChild[m].name === name) {
              pList[i].isIndeterminate = false
              child[j].isIndeterminate = false
              if (this.isCheckAll(grandChild)) {
                pList[i].isIndeterminate = true
                this.checkParent(child[j].id)
              } else {
                this.cancleParent(child[j].id)
                if (this.isCheckSome(grandChild)) {
                  child[j].isIndeterminate = true
                  pList[i].isIndeterminate = true
                } else if (this.isCheckSome(child) || this.isIndetSome(child)) {
                  pList[i].isIndeterminate = true
                }
              }
              if (this.isCheckAll(child)) {
                this.checkParent(pList[i].id)
              } else {
                this.cancleParent(pList[i].id)
                if (this.isCheckSome(child)) {
                  pList[i].isIndeterminate = true
                }
              }
              break
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      permission_List: state => state.app.permission_list
    })
  }
}
</script>

<style lang="scss">
#role {
    .selectGrp {
        border-top: solid 1px #eee;
        padding: 20px 0;
    }
    .selectFir {
        margin: 10px 0 0 15px;
        font-weight: 800;
    }
    .selectFir span:nth-of-type(2) {
        font-size: 18px;
    }
    .selectSec {
        margin: 10px 0;
        padding-left: 55px;
        font-weight: 800;
        font-size: 18px;
    }
    .selectSec span:nth-of-type(2) {
        font-size: 15px;
    }
    .selectThi {
        width: 163px;
        margin: 0 0 10px;
    }
}
</style>
