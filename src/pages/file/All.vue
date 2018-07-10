<template>
<div id="all">
  <el-card class="box-card">
    <!--工具条-->
    <div slot="header" class="card-header">
      <wk-new-form-base inline ref="wk-search" :form-item="data.searchItem" @query="getData">
        <!-- 搜索按钮 -->
        <el-select placeholder="请选择筛选条件" v-model="status" @change="statusSelect">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="整改发送"></el-option>
          <el-option value="1" label="整改中"></el-option>
          <el-option value="2" label="整改回执"></el-option>
          <el-option value="3" label="再次整改发送"></el-option>
          <el-option value="6" label="再次整改已回执"></el-option>
          <el-option value="4" label="审核通过"></el-option>
          <el-option value="5" label="超时"></el-option>
        </el-select>
        <el-select placeholder="请选择筛选条件" v-model="readstatus" @change="readSelect">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="未读"></el-option>
          <el-option value="1" label="已读"></el-option>
        </el-select>
        <el-form-item>
          <el-button @click="searchForm" icon="search" type="primary">搜索</el-button>
        </el-form-item>
        <!-- <el-button @click="handleAdd" icon="plus" type="success" class="header-right" v-if="permission.reportAdd.status">添加</el-button> -->
      </wk-new-form-base>
    </div>


    <!-- 列表 -->
    <wk-table-base ref="wk-list" :columns="data.columns" @query="getData" check-box batch-remove @batch-remove="handleBatchDel">
      <el-table-column label="操作" width="270" fixed="right">
        <template slot-scope="scope">
          <!-- 操作按钮 -->
  				<el-button @click="handleDetail(scope.$index, scope.row)" size="small" icon="document" type="success" v-if="scope.row.is_read === 1">已读</el-button>
  				<el-button @click="handleDetail(scope.$index, scope.row)" size="small" icon="document" type="danger" v-if="scope.row.is_read === 0">未读</el-button>
  				<el-button @click="handleEdit(scope.$index, scope.row)" size="small" icon="edit" type="primary" v-if="permission.reportEdit.status">编辑</el-button>
  				<el-button v-if="scope.row.status !== 4 && permission.reportSuccess.status" @click="handleVerfiy(scope.$index, scope.row)" size="small" icon="check" type="warning">审核</el-button>
  			</template>
      </el-table-column>
    </wk-table-base>

    <!--编辑添加对话框-->
    <el-dialog :visible.sync="editFormVisible" :title="editTitle ? '公文详情' : '添加公文'" @close='resetStatus'>
       <el-col style="padding-left:12px;padding-bottom: 10px;border-bottom: 1px solid #ccc;color: #20a0ff;margin-bottom: 20px">基本信息</el-col>
        <wk-new-form-base :key="editFormKey" ref="wk-edit" :form-item="data.editItem" :form-rule="data.gongwenRule" @submit="editSave" @query="getData" @patch="getInfo" style="margin-top: 20px">
            <!-- 表单按钮 -->
          <el-form-item v-show="isEdit">
              <el-button type="primary" @click="submitForm">确定</el-button>
          </el-form-item>
        </wk-new-form-base>
        <el-col style="padding-left:12px;padding-bottom: 10px;border-bottom: 1px solid #ccc;color: #20a0ff">回执信息</el-col>
        <div>
          <el-steps style="margin-top: 80px" direction="vertical" :active="1" :space="60" v-show="reportList.length > 0">
            <div  v-for="(item, index) in reportList" @click="showReportDetail(item)" style="position: relative">
             <el-step style="vertical-align: text-bottom; cursor: pointer" :title="item.report_info" :description="item.updated_at"></el-step>
             <div style="height: 46px;width:100px;color: #ff4949; position: absolute;top: 0; right: 0;font-size: 14px;line-height: 46px;" v-if="item.is_read === 0">状态: 未读</div>
             <div style="height: 46px;width:100px;color: #42d885; position: absolute;top: 0; right: 0;font-size: 14px;line-height: 46px;" v-if="item.is_read === 1">状态: 已读</div>
            </div>
           </el-steps>
           <div style="text-align: center;padding: 20px;margin-top: 40px" v-show="reportList.length === 0">暂无任何内容</div>
           <el-button style="margin: 20px 0 20px 0" size="small" icon="" type="primary" @click="addReport" v-if="showAdd">添加回执</el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="editReportVisible" :title="ReportTitle ? '添加回执' : '查看回执'">
      <wk-new-form-base ref="wk-report" :form-item="data.report" :form-rule="data.ReportRule" :key="editRepostKey" @submit='reportSave'>
        <el-form-item v-if="ReportTitle || permission.receiptAdd.status">
            <el-button type="primary" @click="ReportSubmit">确定</el-button>
        </el-form-item>
      </wk-new-form-base>
    </el-dialog>

    <el-dialog :visible.sync="VerifyReport" title='审核意见'>
      <wk-new-form-base ref="wk-verifyReport" :form-item="data.verifyreport" :key="VerifyReportKey" :form-rule="data.VerifyRule" @submit="verify" @query="getData">
        <el-form-item>
            <el-button type="primary" @click="VerifySubmit">确定</el-button>
        </el-form-item>
      </wk-new-form-base>
    </el-dialog>
  </el-card>
</div>
</template>
<script>
import { mapState } from 'vuex'
import data from './data/all.js'
export default {
  name: 'all',
  data: () => ({
    data: data,
    // 筛选关键字
    filters: {},
    // 编辑对话框是否显示
    editFormVisible: false,
    editReportVisible: false,
    VerifyReport: false,
    editTitle: true,
    ReportTitle: true,
    editFormKey: 0,
    editRepostKey: 0,
    VerifyReportKey: 0,
    activeTab: 'first',
    reportId: '',
    receiptId: '',
    // 是否是编辑状态
    isEdit: false,
    // 回执记录
    reportList: [],
    isadd: true,
    status: '',
    readstatus: '',
    // 添加时不能加回执
    addAndrecepit: false,
    detailLoading: false
  }),
  computed: {
    ...mapState({
      permission: state => state.app.permission_list,
      user: state => state.app.user
    }),
    showAdd() {
      if (this.user.admin_id !== 1) {
        return true
      } else {
        return this.isadd
      }
    }
  },
  mounted() {
    // 获取初始列表
    let reportid = this.$route.query.id
    if (reportid) {
      this.detailLoading = true
      let row = {
        report_id: reportid
      }
      let index = {}
      this.handleDetail(index, row)
    }
    this.axios.get(this.$api.file.listRead)
    .then(res => {})
    .catch(res => {})
    this.getData()
  },
  methods: {
    // 获取列表数据
    getData(obj) {
      let baseref = this.$refs['wk-list']
      if (!baseref) {
        window.location.reload()
      }
      if (obj) {
        this.filters = obj
      }
      // 请求参数
      if (this.status === '') {
        this.filters.status = ''
      }
      // 请求参数
      if (this.readstatus === '') {
        this.filters.readstatus = ''
      }
      const para = Object.assign({}, this.filters)
      // 调用组件获取数据
      this.$refs['wk-list'].query(this.$api.file.allReport, para, 'report_list', this.detailLoading)
    },
    // 删除用户详情
    handleDel(index, row) {
      // 请求参数
      const para = {
        admin_id: row.admin_id
      }
      // 调用组件删除数据
      this.$refs['wk-list'].delete(this.$api.setting.userDel, para)
    },
    // 批量删除用户列表
    handleBatchDel(obj) {
      // 已选列表id
      const ids = obj.map(item => item.admin_id).toString()
      // 请求参数
      const para = {
        admin_id: ids
      }
      // 调用组件删除数据
      this.$refs['wk-list'].delete(this.$api.setting.userBatchRemove, para, 'batch')
    },
    // 获取新增数据
    handleAdd() {
      let that = this
      this.dialogVisible()
      this.editTitle = false
      this.isEdit = true
      this.isadd = false
      // this.$nextTick(() => {
        // 调用组件获取数据
        // this.$refs['wk-edit'].patch(this.$api.setting.roleListAll)
        setTimeout(() => {
          that.getToUser()
          let formdata = that.$refs['wk-edit'].formItem
          // this.$refs['wk-edit'].formItem[7]['filelist'] = []
          for (let i in formdata) {
            that.$refs['wk-edit'].formItem[i].disabled = false
          }
          that.$refs['wk-edit'].formItem[8].disabled = true
          that.$refs['wk-edit'].formItem[9].disabled = true
          this.$refs['wk-edit'].formItem[10].per = true
        }, 1000)
      // })
    },
    getToUser() {
      this.axios.get(this.$api.setting.usersAll)
      .then(res => {
        let code = res.data.code
        let data = res.data.data
        if (data) {
          for (let i in data) {
            data[i]['value'] = data[i]['admin_id']
            data[i]['label'] = data[i]['company_name']
          }
        }
        if (code === 1) {
          let formItem = this.$refs['wk-edit'].formItem
          for (let i in formItem) {
            if (formItem[i]['value'] === 'to_admin_id') {
              this.$refs['wk-edit'].formItem[i].options = data
            }
          }
        }
      }).catch(res => {
        console.log(res)
      })
    },
    dialogVisible() {
      this.editFormVisible = true
      this.editFormKey = Date.parse(new Date()) / 1000
    },
    dialogReportVisible() {
      this.editReportVisible = true
      this.editRepostKey = Date.parse(new Date()) / 1000
    },
    dialogVerifyReportVisible() {
      this.VerifyReport = true
      this.editVerifyRepostKey = Date.parse(new Date()) / 1000
    },
    addReport() {
      this.ReportTitle = true
      this.dialogReportVisible()
      this.$nextTick(() => {
        this.receiptId = ''
        this.$refs['wk-report'].reset()
        this.$refs['wk-report'].formItem[1]['filelist'] = []
      })
    },
    // 获取补充数据
    getInfo(obj) {
      // 角色列表
      this.data.editItem[0].options = obj.role_list.map(item => {
        return {
          value: item.id,
          label: item.display_name
        }
      })
      // 性别
      obj.admin_sex = obj.admin_sex.toString()
      // 新增数据
      this.$refs['wk-edit'].merge(obj)
    },
    // 获取编辑数据
    handleEdit(index, row) {
      let that = this
      this.dialogVisible()
      this.editTitle = true
      this.isEdit = true
      this.isadd = true
      this.reportId = row.report_id
      this.reportList = []
      this.showReportList()
      // this.$nextTick(() => {
        // 请求参数
        // const para = {
        //   report_id: row.report_id
        // }
        // 调用组件获取数据
        // this.$refs['wk-edit'].query(this.$api.file.allDetail, para, 'info')
        setTimeout(() => {
          that.commonGetDetail(row.report_id)
          that.getToUser()
          that.reportId = row.report_id
          let formdata = that.$refs['wk-edit'].formItem
          for (let i in formdata) {
            that.$refs['wk-edit'].formItem[i].disabled = false
          }
          that.$refs['wk-edit'].formItem[8].disabled = true
          that.$refs['wk-edit'].formItem[9].disabled = true
          this.$refs['wk-edit'].formItem[10].per = true
        }, 200)
      // })
    },
    commonGetDetail(id) {
      this.axios.get(this.$api.file.allDetail, {
        params: {
          report_id: id
        }
      }).then(res => {
        let code = res.data.code
        let data = res.data.data
        let filesinfo = data['info'].files_info
        if (code === 1) {
          this.$refs['wk-edit'].formItem[10]['filelist'] = []
          for (let i in filesinfo) {
            let temp = {name: filesinfo[i]['file_name'], url: filesinfo[i]['file_path']}
            this.$refs['wk-edit'].formItem[10]['filelist'].push(temp)
          }
          this.$refs['wk-edit'].formData = data['info']
        }
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取编辑数据
    handleDetail(index, row) {
      this.dialogVisible()
      this.editTitle = true
      this.isEdit = false
      this.isadd = false
      this.reportId = row.report_id
      this.reportList = []
      this.showReportList()
      this.$nextTick(() => {
        // 请求参数
        // const para = {
        //   report_id: row.report_id
        // }
        this.commonGetDetail(row.report_id)
        this.getToUser()
        // 调用组件获取数据
        // this.$refs['wk-edit'].query(this.$api.file.allDetail, para, 'info')
        let formdata = this.$refs['wk-edit'].formItem
        for (let i in formdata) {
          this.$refs['wk-edit'].formItem[i].disabled = true
        }
        console.log(this.$refs['wk-edit'])
        this.$refs['wk-edit'].formItem[10].per = false
      })
    },
    // 加载回执信息
    showReportList() {
      // let that = this
      this.axios.get(this.$api.file.allDetail, {
        params: {
          report_id: this.reportId
        }
      })
      .then(res => {
        let code = res.data.code
        let data = res.data.data.info.report_list
        if (code === 1) {
          this.reportList = data
        }
      }).catch(res => {
        console.log(res)
      })
    },
    showReportDetail(item) {
      this.ReportTitle = false
      this.dialogReportVisible()
      this.receiptId = item.receipt_id
      this.$nextTick(() => {
        let filesinfo = item.files_info
        this.$refs['wk-report'].formItem[1]['filelist'] = []
        for (let i in filesinfo) {
          if (filesinfo[i]['file_name'] !== '') {
            let temp = {name: filesinfo[i]['file_name'], url: filesinfo[i]['file_path']}
            this.$refs['wk-report'].formItem[1]['filelist'].push(temp)
          }
        }
        this.$refs['wk-report'].formData['report_info'] = item.report_info
        this.$refs['wk-report'].formData['admin_id'] = item.admin_id

        // 上传阅读情况
        this.axios.post(this.$api.file.receiptRead, {
          receipt_id: item.receipt_id
        })
        .then(res => {
        }).catch(res => {
          console.log(res)
        })
      })
    },
    // 公文审核
    handleVerfiy(index, row) {
      this.dialogVerifyReportVisible()
      this.$nextTick(() => {
        this.$refs['wk-verifyReport'].reset()
        this.$refs['wk-verifyReport'].formData['report_id'] = row.report_id
      })
    },
    // 编辑保存用户详情
    editSave(obj) {
      this.editFormVisible = false
      // 判断编辑或添加接口
      const edit = obj.report_id ? this.$api.file.reportEdit : this.$api.file.reportAdd
      // 已选角色id
      // const ids = obj.has_role_list.map(item => item).toString()
      // 添加请求参数
      const para = {
        report_id: obj.report_id,
        report_title: obj.report_title,
        report_name: obj.report_name,
        report_type: obj.report_type,
        to_admin_id: obj.to_admin_id,
        file_path: obj.file_path,
        file_name: obj.file_name,
        deal_opinion: obj.deal_opinion,
        status: obj.status,
        company_name: obj.company_name,
        scan_times: obj.scan_times,
        deal_time: obj.deal_time,
        risk_level: obj.risk_level
      }
      // 编辑请求参数
      if (obj.admin_id) {
        para.report_id = obj.report_id
      }
      // 调用组件提交数据
      this.$refs['wk-edit'].save(edit, para)
    },
    verify(obj) {
      const para = {
        report_id: obj.report_id,
        deal_opinion: obj.deal_opinion
      }
      this.$refs['wk-verifyReport'].save(this.$api.file.reportDeal, para)
      setTimeout(() => {
        this.VerifyReport = false
        this.$store.dispatch('getUnfinshedcount')
      }, 1000)
    },
    reportSave(obj) {
      let user = this.user
      let adminid = user.admin_id
      if (obj.admin_id) {
        if (adminid !== obj.admin_id) {
          this.$message.error('抱歉，您不能编辑他人公文')
          return false
        }
      }
      obj.report_id = this.reportId
      obj.receipt_id = this.receiptId
      const para = {
        report_id: obj.report_id,
        receipt_id: obj.receipt_id,
        file_name: obj.file_name,
        file_path: obj.file_path,
        report_info: obj.report_info
      }
      let receiptApi = this.receiptId === '' ? this.$api.file.receiptAdd : this.$api.file.receiptEdit
      this.$refs['wk-report'].save(receiptApi, para)
      setTimeout(() => {
        this.editFormVisible = false
        this.editReportVisible = false
        // window.location.reload()
      }, 1000)
    },
    // 提交表单
    submitForm() {
      this.$refs['wk-edit'].submit()
    },
    // 审核表单提交
    ReportSubmit() {
      this.$refs['wk-report'].submit()
    },
    // 回执提交
    VerifySubmit() {
      this.$refs['wk-verifyReport'].submit()
    },
    // 重置表单
    // resetForm() {
    //   this.$refs['wk-edit'].reset()
    // },
    // 搜索表单
    searchForm() {
      this.$refs['wk-search'].search()
    },
    filterForm() {
      this.$refs['wk-search'].filter()
    },
    statusSelect() {
      this.$refs['wk-search'].formData['status'] = this.status
    },
    readSelect() {
      this.$refs['wk-search'].formData['is_read'] = this.readstatus
    },
    resetStatus() {
      this.reportList = []
      this.activeTab = 'first'
      this.$refs['wk-edit'].reset()
      this.$refs['wk-edit'].formItem[10]['filelist'] = []
      this.getData()
      if (this.detailLoading) {
        this.$router.push({path: '/file'})
      }
    },
    showToDoDetail() {
      console.log(111)
    }
  }
}
</script>
<style lang="scss">
#all{
  border:1px solid #e6e5e5;
}
</style>
<style lang="scss" scoped>
#all {}
</style>
