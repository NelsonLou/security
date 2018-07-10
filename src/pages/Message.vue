<template>
<div id="users">
  <el-card class="box-card">
    <!--工具条-->
    <div slot="header" class="card-header">
      <div class="sender-name">
        <el-input v-model="searchPara.sender" placeholder="请输入发信人"></el-input>
      </div>
      <div class="status">
        <el-select v-model="searchPara.status" placeholder="请选择状态">
          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.label">
          </el-option>
        </el-select>
      </div>
      <div class="search-btn">
        <el-button type="primary" icon="search" @click="getData">搜索</el-button>
      </div>

      <el-button type="primary" class="header-right" @click="sendMail">发送站内信</el-button>
    </div>

    <!-- 列表 -->
    <el-table v-loading="loading" ref="multipleTable" :data="columns" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="sender_name" label="发信人" width="200"></el-table-column>
      <el-table-column prop="status_name" label="状态" width="200"></el-table-column>
      <el-table-column prop="inmail_title" label="主题" width="400"></el-table-column>
      <el-table-column prop="inmail_content" label="内容摘要" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_at" label="发送时间" width="200"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <!-- 操作按钮 -->
  				<el-button @click="readMail(scope.$index, scope.row)" size="small"  type="primary">查看</el-button>
  			</template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="remove">删除</el-button>
    </div>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!--发送站内信对话框-->
    <el-dialog title="发送站内信" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="收件人" :label-width="formLabelWidth" prop="sender">
          <el-select v-model="form.sender" filterable placeholder="请选择收件人">
            <el-option v-for="item in companys" :key="item.admin_id" :label="item.company_name" :value="item.company_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题" :label-width="formLabelWidth" prop="theme">
          <el-input v-model="form.theme"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="send('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看站内信 -->
    <el-dialog :title="'发信人: ' + inmailDetail.sender_name" :visible.sync="readStatus" width="30%" center @close="getData">
      <p>主题：{{ inmailDetail.inmail_title }}</p>
      <p>内容：{{ inmailDetail.inmail_content }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getData">取 消</el-button>
        <el-button type="primary" @click="getData">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</div>
</template>
<script>
export default {
  name: 'users',
  data: () => ({
    loading: false,
    currentPage1: 1,
    total: 0,
    dialogFormVisible: false,
    delete_columns: [],
    delete_para: [],
    read_columns: [],
    read_para: [],
    limit: 10,
    page: 1,
    readStatus: false,
    inmailDetail: {
      sender_name: '',
      inmail_title: '',
      inmail_content: ''
    },
    form: {
      theme: '',
      content: '',
      sender: ''
    },
    searchPara: {
      sender: '',
      status: ''
    },
    status: [{
      value: '1',
      label: '已读'
    }, {
      value: '2',
      label: '未读'
    }],
    formLabelWidth: '100px',
    companys: [],
    rules: {
      sender: [{
        required: true,
        message: '请选择收件人',
        trigger: 'blur'
      }],
      theme: [{
        required: true,
        message: '请填写主题',
        trigger: 'blur'
      }],
      content: [{
        required: true,
        message: '请填写内容',
        trigger: 'blur'
      }]
    },
    columns: [],
    multipleSelection: [],
    // 搜索表单元素
    searchItem: [{
      eleType: 'search',
      value: 'keyword',
      plh: '请输入账号或昵称'
    }],
    // 编辑对话框是否显示
    editFormVisible: false
  }),
  mounted() {
    // 获取初始列表
    this.getData()
    this.getCompanys()
  },
  methods: {
    // 获取列表数据
    getData() {
      this.$store.dispatch('getUnreadcount')
      this.readStatus = false
      this.loading = true
      this.axios.get('inmail-list', {
          params: {
            limit: this.limit,
            page: this.page,
            keyword: this.searchPara.sender,
            status: this.searchPara.status
          }
        })
        .then(res => {
          this.columns = res.data.data.list
          this.total = res.data.data.count
          this.loading = false
        })
    },
    getCompanys() {
      this.axios.get('inmail-searchuser').then(res => {
        this.companys = res.data.list
      })
    },
    handleSelectionChange(sels) {
      this.delete_columns = sels
      this.read_columns = sels
    },
    handleCurrentChange(val) {
      this.page = val
      this.getData()
    },
    send(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.get('inmail-searchuser', {
            params: {
              company_name: this.form.sender
            }
          }).then(res => {
            this.axios.post('inmail-add', {
                receiver_id: res.data.list[0].admin_id,
                inmail_title: this.form.theme,
                inmail_content: this.form.content
              })
              .then(res => {
                this.$message.success(res.data.msg)
                this.dialogFormVisible = false
                this.getData()
              })
          })
        } else {
          return false
        }
      })
    },
    remove() {
      this.delete_para = []
      if (this.delete_columns.length === 0) {
        this.$message('您还未选中需要删除的站内信')
      } else {
        for (var i = 0; i < this.delete_columns.length; i++) {
          this.delete_para.push(this.delete_columns[i].inmail_id)
        }
        this.axios.post('inmail-delete', {
            inmail_id: this.delete_para.toString()
          })
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.msg)
              this.getData()
            }
          })
          .catch(err => {
            console.log('报错：' + err)
          })
      }
    },
    read() {
      this.read_para = []
      for (var i = 0; i < this.read_columns.length; i++) {
        this.read_para.push(this.read_columns[i].inmail_id)
      }
      this.axios.post('inmail-editstatus', {
          inmail_id: this.read_para.toString()
        })
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.msg)
            this.getData()
          }
        })
    },
    sendMail() {
      this.form.theme = ''
      this.form.content = ''
      this.form.sender = ''
      this.dialogFormVisible = true
    },
    readMail(index, row) {
      this.readStatus = true
      this.axios.get('inmail-detail', {
          params: {
            inmail_id: row.inmail_id
          }
        })
        .then(res => {
          this.inmailDetail = res.data.data.detail
        })
      this.axios.post('inmail-editstatus', {
          inmail_id: row.inmail_id
        })
        .then(res => {})
    }
  }
}
</script>

<style scoped>
.sender-name {
  display: inline-block;
  width: 200px;
}

.status {
  display: inline-block;
  width: 200px;
  margin-left: 5px;
}

.search-btn {
  display: inline-block;
  width: 200px;
  margin-left: 5px;
}

.pagination {
  width: 370px;
  position: absolute;
  right: 35px;
  margin-top: -30px;
  display: flex;
  justify-content: flex-end;
}
</style>
