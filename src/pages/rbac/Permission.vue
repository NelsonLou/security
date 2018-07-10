<template>
<div class='permission'>
  <el-card>
    <div slot="header" class="card-header">
      <el-input class="treeSearch" placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <!-- <el-button v-if='permission_List.permissionAdd.status' icon='plus' @click="handleAdd(addOBJ.id, addOBJ.level, addOBJ.name)" type="primary" class="header-left" onloadedmetadata="">新增</el-button> -->
    </div>
    <!-- 列表 -->
    <div>
      <el-tree :default-expanded-keys='openKey' :filter-node-method="filterNode" ref="tree2" accordion style="border: none;width: 35%;font-size: 16px" :data='permissionList' :props="defaultProps" node-key="id" :render-content="renderContent" v-loading='loading'
        :highlight-current='myOBJ'>
      </el-tree>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog @close='cancel()' title="权限详情" :visible.sync='infoDialog'>
      <el-form ref="formData" :model="formData" style="margin: 0 auto" v-loading='loading' label-position='right' label-width="100px">
        <el-form-item label="标识名称:">
          <span>{{formData.name}}</span>
        </el-form-item>
        <el-form-item label="显示名称:">
          <span>{{formData.display_name}}</span>
        </el-form-item>
        <el-form-item label="所属权限组:">
          <span>{{formData.pName}}</span>
        </el-form-item>
        <el-form-item label="描述:">
          <span>{{formData.description}}</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{formData.created_at}}</span>
        </el-form-item>
        <el-form-item label="更新时间:">
          <span>{{formData.updated_at}}</span>
        </el-form-item>
        <el-form-item v-if='formData.level!==3' label="是否显示:" prop='show'>
          <span>{{changeshow}}</span>
        </el-form-item>
        <el-form-item v-if='formData.level!==3' label="路径:" prop='path'>
          <span>{{formData.path}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog @close='cancel()' :title="title" class="edit" :visible.sync='formDialog'>
      <el-form :key='editFormKey' ref="formData" :rules='formRules' :model="formData" style="margin: 0 auto" v-loading='loading' label-position='right' label-width="100px">
        <el-form-item v-if='isAdd' label="所属权限组:">
          <span>{{formData.pName}}</span>
        </el-form-item>
        <el-form-item label="标识名称:" prop='name'>
          <el-input v-model='formData.name'></el-input>
        </el-form-item>
        <el-form-item label="显示名称:" prop='display_name'>
          <el-input v-model='formData.display_name'></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" style="width: 320px" v-model='formData.description'></el-input>
        </el-form-item>
        <el-form-item v-if='formData.level!==3' label="是否显示:" prop='show'>
          <el-switch v-model="formData.show" on-value='1' off-value='0' on-text="是" off-text="否"></el-switch>
        </el-form-item>
        <el-form-item v-if='formData.level!==3' label="路径:" prop='path'>
          <el-input type="text" style="width: 320px" v-model='formData.path'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePost()">确 定</el-button>
          <el-button @click="cancel()" style="margin-left: 20px">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'permission',
  data: () => ({
    openKey: [],
    addOBJ: {
      id: 0,
      name: '顶级权限',
      level: 0
    },
    filterText: '',
    title: '',
    editFormKey: 0,
    myOBJ: true,
    permissionList: [], // 权限数据
    loading: false, // 数据缓冲
    isEdit: false, // 判断修改
    isInfo: false, // 判断详情
    isAdd: false, // 判断添加
    infoDialog: false, // 详情弹窗
    formDialog: false, // 编辑/添加 弹窗
    defaultProps: { // tree控件数据结构判断
      children: 'child',
      label: 'display_name'
    },
    formData: { // 添加用-传输
      pName: '',
      pid: '',
      permission_id: '',
      name: '',
      display_name: '',
      description: '',
      level: '',
      show: '',
      path: ''
    },
    cleanForm: {
      pName: '',
      pid: '',
      permission_id: '',
      name: '',
      display_name: '',
      description: '',
      level: '',
      show: '',
      path: ''
    },
    formRules: {
      name: [{
        required: true,
        message: '请输入权限名称',
        trigger: 'blur'
      }, {
        min: 2,
        max: 20,
        message: '长度在 2 到 20 个字符',
        trigger: 'blur'
      }],
      display_name: [{
        required: true,
        message: '请输入显示名称',
        trigger: 'blur'
      }, {
        min: 2,
        max: 20,
        message: '长度在 2 到 20 个字符',
        trigger: 'blur'
      }]
    }
  }),
  mounted() {
    this.getPermissionList()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.display_name.indexOf(value) !== -1
    },
    // 动态添加功能按钮
    renderContent(createElement, {
      node,
      data,
      store
    }) {
      var that = this
      return createElement('span', [
        createElement('span', node.label),
        createElement('span', {
          attrs: {
            style: 'margin-left:20px;color:#20a0ff;font-size:14px'
          },
          on: {
            click() {
              that.handleEdit(data, store)
            }
          }
        }, '编辑'),
        createElement('span', {
          attrs: {
            style: 'color:#20a0ff;margin-left:10px;font-size:14px'
          },
          on: {
            click() {
              that.handleinfo(data, store)
            }
          }
        }, '详情'),
        createElement('span', {
          attrs: {
            style: node.level === 3 ? 'margin-left: 10px;font-size: 14px;color: #4db3ff;display:none' : 'margin-left: 11px;font-size: 14px;color: #4db3ff;'
          },
          on: {
            click() {
              that.handleAdd(data.id, data.level, data.display_name)
            }
          }
        }, '添加')
      ])
    },
    // 获取列表
    getPermissionList() {
      this.loading = true
      this.axios.get(this.$api.setting.PList).then(res => {
        let list = res.data
        if (list.code === 1) {
          this.permissionList = list.data.permission_list
        } else {
          console.log('查询失败')
        }
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.loading = false
      })
    },
    // 获取权限详细信息
    getPermissionInfo(id) {
      this.loading = true
      this.axios.get(this.$api.setting.PDetail, {
        params: {
          permission_id: id
        }
      }).then(res => {
        let list = res.data
        if (list.code === 1) {
          this.formData = list.data.permission_info
          this.formData.show = this.formData.show.toString()
          this.formData.pId = 0
          if (this.isInfo === true) {
            this.infoDialog = true
          } else {
            this.formDialog = true
          }
          this.showPName()
        } else {
          console.log('查询失败')
        }
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.loading = false
      })
    },
    // 编辑
    handleEdit(data, store) {
      if (this.$store.state.app.permission_list.permissionEdit.status) {
        this.isInfo = false
        this.isAdd = false
        this.title = '权限编辑'
        this.isEdit = true
        this.getPermissionInfo(data.id)
        this.openKey[0] = data.id
      } else {

      }
    },
    // 详请
    handleinfo(data, store) {
      if (this.$store.state.app.permission_list.permissionDetail.status) {
        this.isEdit = false
        this.isAdd = false
        this.title = '权限详情'
        this.isInfo = true
        this.getPermissionInfo(data.id)
      } else {
        this.$message.error('您无权操作')
      }
    },
    // 添加
    handleAdd(id, level, name) {
      if (this.$store.state.app.permission_list.permissionDetail.status) {
        this.isAdd = false
        this.formData.pid = id
        this.formData.pName = name
        this.formData.level = level + 1
        this.openKey[0] = id
        this.title = '权限添加'
        this.isAdd = true
        this.formDialog = true
      } else {
        this.$message.error('您无权操作')
      }
    },
    // 添加传输
    handlePostAdd() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          const para = {
            pid: this.formData.pid,
            name: this.formData.name,
            display_name: this.formData.display_name,
            description: this.formData.description,
            level: this.formData.level,
            show: this.formData.show,
            path: this.formData.path
          }
          this.axios.post(this.$api.setting.PAdd, para).then(res => {
            let list = res.data
            if (list.code === 1) {
              this.$message.success(list.msg)
              this.getPermissionList()
              this.cancel()
            } else {
              this.$message.error(list.msg)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    // 修改传输
    handlePostEdit() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          const para = {
            permission_id: this.formData.id,
            pid: this.formData.pid,
            name: this.formData.name,
            display_name: this.formData.display_name,
            description: this.formData.description,
            level: this.formData.level,
            show: this.formData.show,
            path: this.formData.path
          }
          this.axios.post(this.$api.setting.PEdit, para).then(res => {
            let list = res.data
            if (list.code === 1) {
              this.getPermissionList()
              this.cancel()
              this.$message.success(list.msg)
            } else {
              this.$message.error(list.msg)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    // 表单传输
    handlePost() {
      if (this.isAdd) {
        this.handlePostAdd()
      } else {
        this.handlePostEdit()
      }
    },
    // 根据父级id获取父级名称
    showPName() {
      let breakup = 0
      for (let i = 0; i < this.permissionList.length; i++) {
        if (breakup === 1) {
          break
        }
        if (this.permissionList[i].child.length !== 0) {
          for (let y = 0; y < this.permissionList[i].child.length; y++) {
            if (breakup === 1) {
              break
            }
            if (this.formData.pid === this.permissionList[i].child[y].id) {
              this.formData.pName = this.permissionList[i].child[y].display_name
              breakup = 1
            }
          }
        }
        if (this.formData.pid === this.permissionList[i].id && this.permissionList[i].child.length !== 0) {
          this.formData.pName = this.permissionList[i].display_name
          breakup = 1
        }
      }
      if (this.formData.pid === 0) {
        this.formData.pName = '顶级权限'
      }
    },
    // 关闭
    cancel() {
      this.formDialog = false
      this.infoDialog = false
      this.editFormKey = Date.parse(new Date()) / 1000
      this.formData = Object.assign({}, this.cleanForm)
    }
  },
  computed: {
    changeshow() {
      return this.formData.show === '1' ? '是' : this.formData.show === '0' ? '否' : '未知'
    },
    ...mapState({
      permission_List: state => state.app.permission_list
    })
  }
}
</script>
<style lang="scss" scoped>
.treeSearch {
    width: 200px;
    margin-left: 20px;
}
.selectDiv {
    width: 50%;
}
.selectB {
    margin-top: 10px;
}
</style>
