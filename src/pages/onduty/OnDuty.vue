<template>
<div id="on-duty">
  <el-card class="duty-card-top">
    实时监控
  </el-card>
  <el-card class="duty-card-bottom" style="overflow-x: auto">
    当前值班
    <el-row :gutter="24" class="bottom-row">
      <el-col :span='4' class="col-left">
        <!-- 值班信息 -->
        <div class="person-table-normal" v-if='!personHave'>
          <span>当前无人值班!</span>
        </div>
        <div class="person-table" v-if='personHave'>
          <el-form label-width="80px" v-loading='formLoading'>
            <el-button @click='personChange(0)' v-if='showButtonL' icon='arrow-left' size='mini' class="person-buttonL"></el-button>
            <el-button @click='personChange(1)' v-if='showButtonR' icon='arrow-right' size='mini' class="person-buttonR"></el-button>
            <div class="form-person"></div>
            <el-form-item label="值班人:" class="form-item">
              <span>{{personList[personNum].admin_nick}}</span>
            </el-form-item>
            <el-form-item label="性别:" class="form-item">
              <span>{{personList[personNum].admin_sex}}</span>
            </el-form-item>
            <el-form-item label="职务:" class="form-item">
              <span>{{personList[personNum].position}}</span>
            </el-form-item>
            <el-form-item label="部门:" class="form-item">
              <span>{{personList[personNum].department}}</span>
            </el-form-item>
            <el-form-item label="值班开始:" class="form-item">
              <span>{{personList[personNum].time_begin}}</span>
            </el-form-item>
            <el-form-item label="值班结束:" class="form-item">
              <span>{{personList[personNum].time_end}}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span='20' class="table-right">
        <!-- 操作栏 -->
        <div class="common_part" v-if="!addPart">
          <el-button v-if='permission_List.scheduleAdd.status' type="primary" icon='plus' @click='addPart = true'>新增周排班</el-button>
          <el-button v-if='permission_List.scheduleList.status' @click='handleDataPassed(0)'>更多</el-button>
          <!-- 列表/已排班 -->
          <el-table class="table" border :data="listData" v-loading.body="tableLoading">
            <el-table-column :label="tableDate">
              <el-table-column prop="schedule_date" label="排班日期" min-width="50">
              </el-table-column>
              <el-table-column prop="admin_nick" label="值班人" min-width="50">
              </el-table-column>
              <el-table-column prop="time_begin" label="开始时间" width="200">
              </el-table-column>
              <el-table-column prop="time_end" label="结束时间" width="200">
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="200">
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    v-if='permission_List.scheduleEdit.status'
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button
                      v-if='permission_List.scheduleDelete.status'
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-button v-if='page===1&&permission_List.scheduleAddSingle.status===true' type='primary' size='mini' icon='plus' @click='handleAdd()'>添加本周班次</el-button>
          <el-button size='mini' icon='arrow-left' @click='getData(-1)'>上周</el-button>
          <el-button size='mini' @click='getData()'>本周</el-button>
          <el-button size='mini' icon='arrow-right' @click='getData(1)'>下周</el-button>
        </div>
        <!-- 新增排班 -->
        <div class="add_part" v-if="addPart">
          <div class="add_step1">
            <span>请选择排班周:</span>
            <el-date-picker @change='handleWeekDate()' v-model="schedule_week" type="week" format="yyyy 第 WW 周" placeholder="请选择值班周">
            </el-date-picker>
          </div>
          <div class="add_step2">
            <div class="" style="margin-top:10px;margin-bottom:10px;width:250px;">
            </div>
            <el-button type='primary' icon='plus' @click='handleAddWeekList()'>添加班次</el-button>
            <el-table class="table" :data="newListData" v-loading.body="tableLoading">
              <el-table-column prop="schedule_date" label="排班日期" min-width="180">
              </el-table-column>
              <el-table-column prop="admin_nick" label="值班人" min-width="180">
              </el-table-column>
              <el-table-column prop="time_begin" label="开始时间" min-width="180">
              </el-table-column>
              <el-table-column prop="time_end" label="结束时间" min-width="180">
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="180">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                <el-button
                type="danger"
                  size="mini"
                  @click="handleDeleteWeekList(scope.$index, scope.row)">删除</el-button>
              </template>
              </el-table-column>
            </el-table>
            <el-button icon='arrow-left' @click='handleAddWeekCancel()'>取消</el-button>
            <el-button type='primary' @click='handlePostList()'>确定</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <!-- 弹出框/列表 -->
  <el-dialog class="tableDialog" title="往期排班" :visible.sync="dialogTable">
    <el-date-picker v-model="month" type="month" placeholder="选择月" @change='handleDataPassed(2)'>
    </el-date-picker>

    <el-table v-loading='passLoading' class="table" :data="listDataPassed">
      <el-table-column prop="schedule_date" label="排班日期" min-width="180">
      </el-table-column>
      <el-table-column prop="admin_nick" label="值班人" min-width="100">
      </el-table-column>
      <el-table-column prop="time_begin" label="开始时间" min-width="180">
      </el-table-column>
      <el-table-column prop="time_end" label="结束时间" min-width="180">
      </el-table-column>
      <el-table-column prop="time_longth" label="时长" min-width="100">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleDataPassed(0)" :current-page.sync="passPage" @current-change="handleDataPassed(0)" :page-size="10" layout="prev, pager, next, jumper, total" :total="passTotal">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogTable = false">确定</el-button>
    </span>
  </el-dialog>
  <!-- 表单 -->
  <el-dialog title="修改班次" :visible.sync="dialogForm" :before-close="handleCancel">
    <el-form :model='formData' ref='formData' :rules='rules' label-width="100px">
      <!-- 用于修改 -->
      <el-form-item v-if='postType=="edit"' label="值班时间:" prop="schedule_date">
        <el-select :disabled='true' v-model="formData.schedule_date" placeholder="请选择">
          <el-option v-for="item in weekOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='postType=="edit"' label="值班人:" prop="admin_id">
        <el-select :disabled='true' v-model="formData.admin_id" filterable placeholder="请选择">
          <el-option v-for="item in userList" :key="item.admin_id" :label="item.admin_nick" :value="item.admin_id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- ++++++++ -->
      <el-form-item label="值班时间:" prop="schedule_date">
        <el-select v-model="formData.schedule_date" placeholder="请选择">
          <el-option v-for="item in weekOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="值班人:" prop="admin_id">
        <el-select v-model="formData.admin_id" filterable placeholder="请选择">
          <el-option v-for="item in userList" :key="item.admin_id" :label="item.admin_nick" :value="item.admin_id">
          </el-option>
        </el-select>
        <el-button v-if=' permission_List.adminAdd.status ' @click='goUser '>添加值班人</el-button>
      </el-form-item>
      <el-form-item label="开始时间:" prop="time_begin">
        <el-time-select style="width:220px;" placeholder="结束时间" v-model="formData.time_begin" :picker-options="{
     start: '00:00 ',
     step: '00:30 ',
     end: '24:00 '}">
        </el-time-select>
      </el-form-item>
      <el-form-item label="结束时间:" prop="time_end">
        <el-time-select style="width:220px;" placeholder="结束时间" v-model="formData.time_end" :picker-options="{
     start: '00:00 ',
     step: '00:30 ',
     end: '24:00 ',
     minTime: formData.time_begin}">
        </el-time-select>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model='formData.remark' type='textarea'>
        </el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="handlePost">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  data: () => ({
    postType: '',
    picker_options: { // 时间选择器
      selectableRange: '00:00:00 - 23:59:59'
    },
    formLoading: false,
    tableDate: '本周日期',
    showButtonR: false, // 值班人切换
    showButtonL: false, // 值班人切换
    addPart: false, // 批量排班显示
    page: 1, // 表格翻页
    passPage: 1, // 更多-表格反野
    passTotal: 10, // 更多-数据总量
    listData: [], // 表格数据
    listDataPassed: [], // 更多-表格数据
    tableLoading: false, // 表格-loading
    passLoading: false, // 更多表格loading
    userList: [], // 用户列表
    personList: [{
      admin_nick: '',
      admin_sex: '',
      department: '',
      position: '',
      time_begin: '',
      time_end: ''
    }], // 值班人列表
    personHave: true, // 是否存在值班人
    personNum: 0, // 切换值班人
    dialogTable: false, // 更多-弹窗
    dialogForm: false, // 批量新增弹窗
    month: new Date(), // 更多-筛选条件
    newListData: [], // 批量添加-周数据
    formData: { // table表单数据
      schedule_date: '',
      admin_id: '',
      allot_id: '',
      time_begin: '',
      time_end: '',
      remark: ''
    },
    schedule_week: '', // 批量增加-周时间
    rules: { // 表单验证
      schedule_date: [{
        required: true,
        message: '请选择值班时间',
        trigger: 'blur'
      }],
      admin_id: [{
        type: 'integer',
        required: true,
        message: '请输入值班人',
        trigger: 'change'
      }],
      time_begin: [{
        required: true,
        message: '请选择值班开始时间',
        trigger: 'change'
      }],
      time_end: [{
        required: true,
        message: '请选择值班结束时间',
        trigger: 'change'
      }]
    },
    weekOption: [{ // 表单选择
      value: '0',
      label: '周一'
    }, {
      value: '1',
      label: '周二'
    }, {
      value: '2',
      label: '周三'
    }, {
      value: '3',
      label: '周四'
    }, {
      value: '4',
      label: '周五'
    }, {
      value: '5',
      label: '周六'
    }, {
      value: '6',
      label: '周日'
    }]
  }),
  mounted() {
    this.Initialization()
  },
  methods: {
    // 初始化
    Initialization() {
      this.getData()
      this.getUserList()
      this.getPersonList()
    },
    // 获取角色列表
    getData(add) {
      this.tableLoading = true
      if (add === 1) {
        this.page = this.page + add
      } else if (add === -1) {
        this.page = this.page + add
      } else {
        this.page = 1
      }
      const para = {
        schedule_date: '',
        page: this.page
      }
      this.axios.get(this.$api.onDuty.SWeekList, {
        params: para
      }).then(res => {
        this.listData = res.data.data.list
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.tableLoading = false
      })
    },
    // 获取值班人信息
    getPersonList() {
      this.formLoading = true
      this.axios.get(this.$api.onDuty.SNow).then(res => {
        if (res.data.code === 10315) {
          this.personHave = false
        } else {
          this.personNum = 0
          this.personHave = true
          this.personList = res.data.data
          if (this.personList.length > 1) {
            this.showButtonR = true
          }
          for (var i = 0; i < this.personList.length; i++) {
            if (this.personList[i].admin_sex === 1) {
              this.personList[i].admin_sex = '男'
            } else {
              this.personList[i].admin_sex = '女'
            }
          }
          this.personLength = this.personList.length
        }
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.formLoading = false
      })
    },
    // 切换值班人
    personChange(num) {
      if (num === 1) {
        this.personNum++
          if (this.personNum >= this.personLength - 1) {
            this.showButtonL = true
            this.showButtonR = false
          }
      } else {
        this.personNum--
          if (this.personNum <= 0) {
            this.showButtonR = true
            this.showButtonL = false
          }
      }
    },
    // 获取用户
    getUserList() {
      this.axios.get(this.$api.onDuty.usersAll).then(res => {
        this.userList = res.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('此操作将删除该班次, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.axios.post(this.$api.onDuty.SDelete, {
          allot_id: row.allot_id,
          admin_id: row.admin_id
        }).then(res => {
          this.$message.success(res.data.msg)
        }).catch(error => {
          console.log(error)
        }).then(() => {
          this.getData()
          this.resetForm('formData')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改
    handleEdit(index, row) {
      this.postType = 'edit'
      this.dialogForm = true
      var b = row.time_begin.substring(11)
      var e = row.time_end.substring(11)
      var dateBegin = b.split(':')
      var dateEnd = e.split(':')
      this.formData = {
        schedule_date: row.schedule_date,
        admin_id: row.admin_id,
        allot_id: row.allot_id,
        time_begin: dateBegin[0] + ':' + dateBegin[1] + ':00',
        time_end: dateEnd[0] + ':' + dateEnd[1] + ':00',
        remark: row.remark
      }
    },
    // 添加
    handleAdd() {
      this.postType = 'add'
      this.dialogForm = true
    },
    // 批量增加部分+++++
    // 改变批量增加时间
    handleWeekDate() {
      this.newListData = []
      var year = this.schedule_week.getFullYear()
      var month = this.schedule_week.getMonth() + 1
      var day = this.schedule_week.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.schedule_week = year + '-' + month + '-' + day
    },
    // 添加单条数据
    handleAddWeekList() {
      if (this.schedule_week === '') {
        this.$message.error('请选择需要周')
      } else {
        this.dialogForm = true
        this.postType = 'list'
      }
    },
    // 删除单条数据
    handleDeleteWeekList(index, row) {
      this.newListData.splice(index, 1)
    },
    // 取消批量增加
    handleAddWeekCancel() {
      this.addPart = false
      this.schedule_week = ''
      this.newListData = []
    },
    // 批量传输
    handlePostList() {
      this.axios.post(this.$api.onDuty.SAdd, {
        schedule_begin: this.schedule_week,
        list: this.newListData
      }).then(res => {
        this.$message.success(res.data.msg)
        this.addPart = false
        this.newListData = []
        this.resetForm('formData')
        this.Initialization()
      }).catch(error => {
        console.log(error)
      })
    },
    // ++++++++++++++
    // 传输表单
    handlePost() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.dialogForm = false
          // 编辑传输
          if (this.postType === 'edit') {
            this.axios.post(this.$api.onDuty.SEdit, {
              allot_id: this.formData.allot_id,
              admin_id: this.formData.admin_id,
              schedule_date: this.formData.schedule_date,
              time_begin: this.formData.schedule_date + ' ' + this.formData.time_begin,
              time_end: this.formData.schedule_date + ' ' + this.formData.time_end,
              remark: this.formData.remark
            }).then(res => {
              this.$message.success(res.data.msg)
            }).catch(error => {
              console.log(error)
            }).then(() => {
              this.resetForm('formData')
              this.Initialization()
            })
          } else if (this.postType === 'add') { // 本周添加传输
            var d = new Date()
            this.axios.post(this.$api.onDuty.SAddSingle, {
              schedule_begin: this.getSchduleDate(d, this.formData.schedule_date),
              list: [{
                admin_id: this.formData.admin_id,
                time_begin: this.getSchduleDate(d, this.formData.schedule_date) + ' ' + this.formData.time_begin + ':00',
                time_end: this.getSchduleDate(d, this.formData.schedule_date) + ' ' + this.formData.time_end + ':00',
                remark: this.formData.remark
              }]
            }).then(res => {
              this.$message.success(res.data.msg)
            }).catch(error => {
              console.log(error)
            }).then(() => {
              this.resetForm('formData')
              this.Initialization()
            })
          } else if (this.postType === 'list') { // 添加单条数据
            var x = 0
            var key = 0
            for (var y = 0; y < this.newListData.length; y++) {
              x = new Date(this.schedule_week)
              x = x.getDay() - 1
              x = String(x)
              if (this.newListData[y].admin_id === this.formData.admin_id && x === this.formData.schedule_date) {
                key = 1
                break
              }
            }
            if (key === 1) {
              this.$message.error('值班人一天仅能安排一个班次')
            } else {
              var date = this.schedule_week.substring(0, 8)
              var week = Number(this.schedule_week.substring(8)) + Number(this.formData.schedule_date)
              if (week < 10) {
                date = date + '0' + week
              } else {
                date = date + week
              }
              this.formData.time_begin = this.formData.time_begin.replace(' ', '')
              this.formData.time_end = this.formData.time_end.replace(' ', '')
              var list = {
                admin_nick: '',
                admin_id: this.formData.admin_id,
                time_begin: date + ' ' + this.formData.time_begin + ':00',
                time_end: date + ' ' + this.formData.time_end + ':00',
                remark: this.formData.remark,
                schedule_date: date
              }
              for (var i = 0; i < this.userList.length; i++) {
                if (this.userList[i].admin_id === this.formData.admin_id) {
                  list.admin_nick = this.userList[i].admin_nick
                  break
                }
              }
              this.newListData.push(list)
              this.resetForm('formData')
            }
          }
        }
      })
    },
    // 关闭表单
    handleCancel() {
      this.resetForm('formData')
      this.dialogForm = false
    },
    // 获取往期排班
    handleDataPassed(num) {
      this.dialogTable = true
      this.passLoading = true
      var para = {
        limit: this.$api.config.limit,
        page: this.passPage,
        month: this.month.getMonth() + 1,
        year: this.month.getFullYear()
      }
      this.axios.get(this.$api.onDuty.Slist, {
        params: para
      }).then(res => {
        this.listDataPassed = res.data.data.list
        this.passTotal = res.data.data.total
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.passLoading = false
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formData = {
        schedule_date: '',
        admin_id: '',
        allot_id: '',
        time_begin: '',
        time_end: '',
        remark: ''
      }
    },
    // 获取日期
    getSchduleDate(date, weekDay) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var d = date.getDate()
      var w = date.getDay()
      var day = Number(d) - Number(w) + Number(weekDay) + 1
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      return year + '-' + month + '-' + day
    },
    // 跳转
    goUser() {
      this.$router.push({
        path: '/rbac/users'
      })
    }
  },
  computed: {
    ...mapState({
      permission_List: state => state.app.permission_list
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#on-duty {
    .left {
        float: left;
        margin-left: 5px;
        margin-bottom: 5px;
    }
    .duty-card-bottom {
        margin-top: 20px;
    }
    .person-table {
        border: 2px solid #666;
        border-radius: 10px;
        margin-top: 20px;
        width: 210px;
    }
    .person-table-normal {
        width: 200px;
        height: 300px;
        text-align: center;
        border: 2px solid #666;
        border-radius: 10px;
        margin-top: 20px;
        span {
            display: inline-block;
            margin-top: 100px;
        }
    }
    .form-item:first-child {
        margin-top: 10px;
    }
    .form-item {
        margin-top: -20px;
        width: 200px;
    }
    .form-person {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        border: 2px solid #666;
        margin: 10px auto 20px;
        background: url("../../assets/avator.jpg") no-repeat;
        background-size: 100%;
    }
    .person-buttonR {
        float: right;
        margin-right: 20px;
    }
    .person-buttonL {
        float: left;
        margin-left: 20px;
    }
    .table {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .time-span {
        margin-top: 10px;
        display: block;
    }
    .bottom-row {
        min-width: 1400px;
    }
}
</style>
