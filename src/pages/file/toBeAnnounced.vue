<template>
  <div class="tobeannounced">
    <el-card class="box-card">
      <!--工具条-->
      <div slot="header" class="card-header">
        <wk-new-form-base inline ref="wk-search" :form-item="data.searchItem" @query="getData">
          <!-- 搜索按钮 -->
          <el-select placeholder="请选择筛选条件" v-model="is_examine" @change="statusSelect">
            <el-option value="0" label="待审核"></el-option>
            <el-option value="1" label="审核通过"></el-option>
            <el-option value="2" label="审核未通过"></el-option>
            <el-option value="" label="全部"></el-option>
          </el-select>
          <el-form-item>
            <el-button @click="searchForm" icon="search" type="primary">搜索</el-button>
          </el-form-item>
          <el-button @click="handleAdd" icon="plus" type="success" class="header-right">添加</el-button>
        </wk-new-form-base>
      </div>
      <!-- 列表 -->
      <wk-table-base ref="wk-list" :columns="data.columns" @query="getData" check-box batch-remove>
        <el-table-column label="操作" width="270" fixed="right">
          <template slot-scope="scope">
            <!-- 操作按钮 -->
    				<el-button @click="handleDetail(scope.$index, scope.row)" size="small" icon="document" type="success" >查看</el-button>
    				<el-button v-if="scope.row.is_examine === 0 && permission.reportEditByExamine.status" @click="handleEdit(scope.$index, scope.row)" size="small" icon="edit" type="primary" >编辑</el-button>
    				<el-button v-if="scope.row.is_examine === 0 && permission.reportExamineEdit.status" @click="handleVerfiy(scope.$index, scope.row)" size="small" icon="check" type="warning">发布</el-button>
    			</template>
        </el-table-column>
      </wk-table-base>

      <!--编辑添加对话框-->
      <el-dialog :visible.sync="editFormVisible" :title="editTitle ? '公文详情' : '添加公文'" @close='resetStatus'>
       <el-col style="padding-left:12px;padding-bottom: 10px;margin-bottom: 20px;border-bottom: 1px solid #ccc;color: #20a0ff">基本信息</el-col>
          <wk-new-form-base :key="editFormKey" ref="wk-edit" :form-item="data.editItem" :form-rule="data.gongwenRule" @submit="editSave" @query="getData" @patch="" style="margin-top: 20px">
              <!-- 表单按钮 -->
            <el-form-item v-show="isEdit">
                <el-button type="primary" @click="submitForm">确定</el-button>
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
import data from './data/tobeannounced.js'
import { mapState } from 'vuex'
export default {
  name: 'tobeannounced',
  data: () => ({
    data: data,
    editFormVisible: false,
    VerifyReport: false,
    filters: {},
    // 公文编辑框标题显示
    editTitle: false,
    editFormKey: 0,
    VerifyReportKey: 0,
    // 编辑状态
    isEdit: true,
    // 审核ID
    examine_id: -1,
    // 审核状态
    is_examine: '0'
  }),
  mounted() {
    this.getData()
    this.getData()
  },
  computed: {
    ...mapState({
      permission: state => state.app.permission_list,
      user: state => state.app.user
    })
  },
  methods: {
    // 获取列表信息
    getData(obj) {
      let baseref = this.$refs['wk-list']
      if (!baseref) {
        window.location.reload()
      }
      if (obj) {
        this.filters = obj
      }
      const para = Object.assign({}, this.filters)
      // 请求参数
      if (this.is_examine === '0') {
        this.filters.is_examine = 0
        para.is_examine = 0
      }
      // 调用组件获取数据
      this.$refs['wk-list'].query(this.$api.file.reportVerifyList, para, 'report_examine_list', this.detailLoading)
    },
    // 搜索列表信息
    searchForm() {
      this.$refs['wk-search'].search()
    },
    // 编辑公文
    handleEdit(index, row) {
      this.dialogVisible()
      this.editTitle = true
      this.isEdit = true
      this.isadd = false
      this.reportId = row.report_id
      this.examine_id = row.examine_id
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
        if (row.is_examine === 0) {
          for (let i in formdata) {
            this.$refs['wk-edit'].formItem[i].disabled = false
          }
          this.$refs['wk-edit'].formItem[8].disabled = true
          this.$refs['wk-edit'].formItem[9].disabled = true
          this.$refs['wk-edit'].formItem[10].per = true
        } else {
          for (let i in formdata) {
            this.$refs['wk-edit'].formItem[i].disabled = true
          }
          this.$refs['wk-edit'].formItem[10].per = false
        }
      })
    },
    commonGetDetail(id) {
      this.axios.get(this.$api.file.allDetailYw, {
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
    // 添加公文
    handleAdd(index, row) {
      let that = this
      this.dialogVisible()
      this.editTitle = false
      this.isEdit = true
      this.isadd = false
      this.$nextTick(() => {
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
      })
    },
    // 获取业主列表
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
    // 查看公文详情
    handleDetail(index, row) {
      this.dialogVisible()
      this.editTitle = true
      this.isEdit = false
      this.isadd = false
      this.reportId = row.report_id
      // this.reportList = []
      // this.showReportList()
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
        this.$refs['wk-edit'].formItem[10].per = false
      })
    },
    // 审核公文
    handleVerfiy(index, row) {
      this.dialogVerifyVisible()
      this.$nextTick(() => {
        this.$refs['wk-verifyReport'].reset()
        this.$refs['wk-verifyReport'].formData['examine_id'] = row.examine_id
      })
    },
    // 编辑框显示
    dialogVisible() {
      this.editFormVisible = true
      this.editFormKey = Date.parse(new Date()) / 1000
    },
    // 审核框显示
    dialogVerifyVisible() {
      this.VerifyReport = true
      this.VerifyReportKey = Date.parse(new Date()) / 1000
    },
    // 保存公文
    submitForm() {
      this.$refs['wk-edit'].submit()
    },
    // 审核调用方法
    verify(obj) {
      const para = {
        examine_id: obj.examine_id,
        examine_info: obj.examine_info,
        is_examine: obj.is_examine
      }
      this.$refs['wk-verifyReport'].save(this.$api.file.reportRelease, para)
      setTimeout(() => {
        this.VerifyReport = false
        this.$store.dispatch('getUnfinshedcount')
      }, 1000)
    },
    // 保存表单数据
    editSave(obj) {
      this.editFormVisible = false
      // 判断编辑或添加接口
      const edit = obj.report_id ? this.$api.file.reportEditByexamine : this.$api.file.reportAdd
      // 已选角色id
      // const ids = obj.has_role_list.map(item => item).toString()
      // 添加请求参数
      const para = {
        report_id: obj.report_id,
        examine_id: this.examine_id,
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
    // 公文审核
    VerifySubmit() {
      this.$refs['wk-verifyReport'].submit()
    },
    // 重围表单数据
    resetStatus() {
      this.reportList = []
      this.activeTab = 'first'
      this.$refs['wk-edit'].reset()
      this.$refs['wk-edit'].formItem[10]['filelist'] = []
      this.getData()
    },
    // 审核状态筛选
    statusSelect() {
      this.$refs['wk-search'].formData['is_examine'] = this.is_examine
    }
  }
}
</script>
<style lang='scss' scoped>
#tobeannounced{

}
</style>
