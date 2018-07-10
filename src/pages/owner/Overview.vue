<template>
<div id="all">
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <div class="search">
        <el-input v-model="keyword" placeholder="请输入单位名称"></el-input>
      </div>
      <div class="search-btn">
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
    </div>

    <el-table v-loading="loading" ref="multipleTable" :data="dataList" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="info_id" label="序号"></el-table-column>
      <el-table-column prop="company_name" label="单位名称"></el-table-column>
      <el-table-column prop="scan_times_count" label="扫描总次数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="admin_url" label="网址"></el-table-column>
      <el-table-column prop="risk_level_name" label="风险等级"></el-table-column>
      <el-table-column prop="created_at" label="开始时间"></el-table-column>
      <el-table-column prop="updated_at" label="结束时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <!-- 操作按钮 -->
          <el-button @click="edit(scope.$index, scope.row)" size="small"  type="primary">查看</el-button>
          <!-- <el-button @click="del(scope.$index, scope.row)" size="small"  type="primary">删除</el-button> -->
  			</template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>

    <el-dialog title="业主详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="序号：" :label-width="formLabelWidth" prop="admin_id">
          <el-input v-model="form.admin_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="扫描总次数：" :label-width="formLabelWidth" prop="scan_times">
          <el-input v-model="form.scan_times_count" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="网址：" :label-width="formLabelWidth" prop="admin_url">
          <el-input v-model="form.admin_url" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="风险等级：" :label-width="formLabelWidth" prop="risk_level">
          <el-select v-model="form.risk_level" :disabled="true">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称：" :label-width="formLabelWidth" prop="company_name">
          <el-input v-model="form.company_name" :disabled="true"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</div>
</template>
<script>
export default {
  name: 'all',
  data: () => ({
    form: {
      admin_id: '',
      scan_times_count: '',
      admin_url: '',
      risk_level: '',
      company_name: ''
    },
    loading: false,
    dataList: [],
    limit: 10,
    page: 1,
    total: 0,
    keyword: '',
    dialogFormVisible: false,
    options: [{
      value: '1',
      label: '绝对安全'
    }, {
      value: '2',
      label: '比较安全'
    }, {
      value: '3',
      label: '相对安全'
    }, {
      value: '4',
      label: '绝对危险'
    }],
    formLabelWidth: '100px',
    rules: {
      admin_id: [{
        required: true,
        message: '请填写序号',
        trigger: 'blur'
      }],
      scan_times: [{
        required: true,
        message: '请填写扫描次数',
        trigger: 'blur'
      }],
      admin_url: [{
        required: true,
        message: '请填写网址',
        trigger: 'blur'
      }],
      risk_level: [{
        required: true,
        message: '请填写风险等级',
        trigger: 'blur'
      }],
      company_name: [{
        required: true,
        message: '请填写单位名称',
        trigger: 'blur'
      }]
    }
  }),
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.axios.get('clientinfo-list', {
        params: {
          limit: this.limit
        }
      }).then(res => {
        this.total = res.data.data.count
        this.dataList = res.data.data.list
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getData()
    },
    edit(index, row) {
      this.dialogFormVisible = true
      this.form = row
      this.form.admin_id = this.form.admin_id.toString()
      this.form.scan_times = this.form.scan_times.toString()
      this.form.risk_level = this.form.risk_level.toString()
    },
    del(index, row) {
      this.axios.post('clientinfo-delete', {
        admin_id: row.admin_id
      }).then(res => {
        this.$message.success(res.data.data.msg)
        this.getData()
      })
    },
    search() {
      this.loading = true
      this.axios.get('clientinfo-list', {
        params: {
          limit: this.limit,
          keyword: this.keyword
        }
      }).then(res => {
        this.total = res.data.data.count
        this.dataList = res.data.data.list
        this.loading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#all {
    .search {
        display: inline-block;
        width: 200px;
    }
    .search-btn {
        display: inline-block;
        width: 200px;
        margin-left: 5px;
    }
    .pagination {
        right: 35px;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
