<template>
<div id="file">
  <el-card>
    <!-- 搜索 -->
    <div style="margin-bottom: 15px;width:400px;">
      <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
        <el-select v-model="searchTitle" slot="prepend" placeholder="请选择" style="width:100px">
          <el-option label="用户名" value="1"></el-option>
          <el-option label="登录IP" value="2"></el-option>
          <el-option label="操作内容" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="search" @click='getData'></el-button>
      </el-input>
    </div>
    <!-- 数据列表 -->
    <el-table class="table" :data="listData" v-loading.body="tableLoading">
      <el-table-column prop="admin_name" label="登录账号" min-width="180">
      </el-table-column>
      <el-table-column prop="operate_ip" label="登录IP" min-width="180">
      </el-table-column>
      <el-table-column prop="operate_time" label="操作时间" min-width="180">
      </el-table-column>
      <el-table-column prop="operate_result" label="操作结果" min-width="180">
      </el-table-column>
      <el-table-column prop="operate_target" label="操作内容" min-width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if='permission_List.logDetail.status' @click="handleInfo(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="getData" :current-page.sync="page" @current-change="getData" :page-size="10" layout="prev, pager, next, jumper, total" :total="total">
      </el-pagination>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <el-form label-width="80px" v-loading='dialogLoading'>
        <el-form-item label="登录账号:">
          <span v-model="formData.admin_name"></span>
          <el-input :disabled="true" v-model="formData.admin_name"></el-input>
        </el-form-item>
        <el-form-item label="操作时间:">
          <el-input :disabled="true" v-model="formData.operate_time"></el-input>
        </el-form-item>
        <el-form-item label="操作内容:">
          <el-input :disabled="true" v-model="formData.operate_target"></el-input>
        </el-form-item>
        <el-form-item label="操作IP:">
          <el-input :disabled="true" v-model="formData.operate_ip"></el-input>
        </el-form-item>
        <el-form-item label="操作结果:">
          <el-input :disabled="true" v-model="formData.operate_result"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'file',
  data: () => ({
    listData: [],
    tableLoading: '',
    page: 1,
    dialogVisible: false,
    formData: {},
    total: 10,
    search: '',
    searchTitle: '',
    dialogLoading: false
  }),
  mounted() {
    this.getData()
  },
  methods: {
    // 获取列表/翻页/搜索
    getData() {
      this.tableLoading = true
      var para = {}
      if (this.search === '') {
        para = {
          page: this.page,
          limit: this.$api.config.limit
        }
      } else if (this.searchTitle === '1') {
        para = {
          page: this.page,
          limit: this.$api.config.limit,
          admin_name: this.search
        }
      } else if (this.searchTitle === '2') {
        para = {
          page: this.page,
          limit: this.$api.config.limit,
          operate_ip: this.search
        }
      } else if (this.searchTitle === '3') {
        para = {
          page: this.page,
          limit: this.$api.config.limit,
          operate_target: this.search
        }
      }
      this.axios.get(this.$api.log.logList, {
        params: para
      }).then(res => {
        this.listData = res.data.data.admin_list
        this.total = res.data.data.total
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.tableLoading = false
      })
      this.tableLoading = false
    },
    // 详情
    handleInfo(row) {
      this.dialogVisible = true
      this.dialogLoading = true
      const para = {
        log_id: row.log_id
      }
      this.axios.get(this.$api.log.logDetail, {
        params: para
      }).then(res => {
        this.formData = res.data.data.log_detail
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.dialogLoading = false
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
<style lang="scss" scoped>
#file {
    .block {
        float: right;
        margin-bottom: 20px;
        margin-top: 20px;
    }
}
</style>
