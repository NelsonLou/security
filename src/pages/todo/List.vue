<template>
<div class="todo">
  <div id="all" v-if="activeTodo == 'all'">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <div class="company-name">
          <el-input v-model="search.company_name" placeholder="请输入单位名称"></el-input>
        </div>
        <div class="status">
          <el-select v-model="search.status" placeholder="请选择状态">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="risk-level">
          <el-select v-model="search.risk_level" placeholder="请选择风险等级">
            <el-option v-for="item in risk_levels" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-btn">
          <el-button type="primary" icon="search" @click="getData">搜索</el-button>
        </div>
      </div>

      <el-table v-loading="loading" ref="multipleTable" :data="todoList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="report_id" label="事务编号"></el-table-column>
        <el-table-column prop="company_name" label="单位名称"></el-table-column>
        <el-table-column prop="status_name" label="处理状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="admin_url" label="扫描网址"></el-table-column>
        <el-table-column prop="risk_level_name" label="风险等级"></el-table-column>
        <el-table-column prop="created_at" label="开始时间"></el-table-column>
        <el-table-column prop="deal_time" label="截至时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
          <!-- 操作按钮 -->
            <el-button @click="read(scope.$index, scope.row)" size="small"  type="primary">查看</el-button>
  			</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </el-card>
  </div>

  <div id="already" v-if="activeTodo == 'already'">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <div class="company-name">
          <el-input v-model="search.company_name" placeholder="请输入单位名称"></el-input>
        </div>
        <div class="status">
          <el-select v-model="search.status" placeholder="请选择状态">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="risk-level">
          <el-select v-model="search.risk_level" placeholder="请选择风险等级">
            <el-option v-for="item in risk_levels" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-btn">
          <el-button type="primary" icon="search" @click="getData">搜索</el-button>
        </div>
      </div>
      <el-table v-loading="loading" ref="multipleTable" :data="todoList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="report_id" label="事务编号"></el-table-column>
        <el-table-column prop="company_name" label="单位名称"></el-table-column>
        <el-table-column prop="status_name" label="处理状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="admin_url" label="扫描网址"></el-table-column>
        <el-table-column prop="risk_level_name" label="风险等级"></el-table-column>
        <el-table-column prop="created_at" label="开始时间"></el-table-column>
        <el-table-column prop="deal_time" label="截至时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
          <!-- 操作按钮 -->
            <el-button @click="read(scope.$index, scope.row)" size="small"  type="primary">查看</el-button>
  			</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </el-card>
  </div>

  <div id="untreated" v-if="activeTodo == 'untreated'">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <div class="company-name">
          <el-input v-model="search.company_name" placeholder="请输入单位名称"></el-input>
        </div>
        <div class="status">
          <el-select v-model="search.status" placeholder="请选择状态">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="risk-level">
          <el-select v-model="search.risk_level" placeholder="请选择风险等级">
            <el-option v-for="item in risk_levels" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-btn">
          <el-button type="primary" icon="search" @click="getData">搜索</el-button>
        </div>
      </div>
      <el-table v-loading="loading" ref="multipleTable" :data="todoList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="report_id" label="事务编号"></el-table-column>
        <el-table-column prop="company_name" label="单位名称"></el-table-column>
        <el-table-column prop="status_name" label="处理状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="admin_url" label="扫描网址"></el-table-column>
        <el-table-column prop="risk_level_name" label="风险等级"></el-table-column>
        <el-table-column prop="created_at" label="开始时间"></el-table-column>
        <el-table-column prop="deal_time" label="截至时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
          <!-- 操作按钮 -->
  				<el-button @click="read(scope.$index, scope.row)" size="small"  type="primary">查看</el-button>
  			</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </el-card>
  </div>

</div>
</template>
<script>
import {
  mapState
} from 'vuex'

export default {
  name: 'list',
  data: () => ({
    data: '',
    loading: false,
    todoList: [],
    limit: 10,
    page: 1,
    total: 0,
    search: {
      company_name: '',
      status: '',
      risk_level: ''
    },
    status: [{
      value: '0',
      label: '整改发送'
    }, {
      value: '1',
      label: '整改中'
    }, {
      value: '2',
      label: '整改回执'
    }, {
      value: '3',
      label: '再次整改发送'
    }, {
      value: '4',
      label: '审核通过'
    }, {
      value: '5',
      label: '已超时'
    }, {
      value: '6',
      label: '再次整改回执'
    }],
    risk_levels: [{
      value: '1',
      label: '绝对安全'
    }, {
      value: '2',
      label: '比较安全'
    }, {
      value: '3',
      label: '相对危险'
    }, {
      value: '4',
      label: '绝对危险'
    }]
  }),
  mounted() {
    this.getData()
  },
  computed: {
    ...mapState({
      activeTodo: state => state.app.activeTodo
    })
  },
  methods: {
    getData() {
      this.loading = true
      if (this.activeTodo === 'all') {
        this.axios.get('report-affairall', {
            params: {
              status: 1,
              limit: this.limit,
              keyword: this.search.company_name,
              sta: this.search.status,
              risk_level: this.search.risk_level
            }
          })
          .then(res => {
            this.total = res.data.data.count
            this.todoList = res.data.data.list
            this.loading = false
          })
      } else if (this.activeTodo === 'already') {
        this.axios.get('report-finishedall', {
            params: {
              status: 2,
              limit: this.limit,
              keyword: this.search.company_name,
              sta: this.search.status,
              risk_level: this.search.risk_level
            }
          })
          .then(res => {
            this.total = res.data.data.count
            this.todoList = res.data.data.list
            this.loading = false
          })
      } else if (this.activeTodo === 'untreated') {
        this.axios.get('report-unfinishedall', {
            params: {
              status: 3,
              limit: this.limit,
              keyword: this.search.company_name,
              sta: this.search.status,
              risk_level: this.search.risk_level
            }
          })
          .then(res => {
            this.total = res.data.data.count
            this.todoList = res.data.data.list
            this.loading = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    read(index, row) {
      this.$router.push({
        path: '/file/all',
        query: {
          id: row.report_id
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getData()
    }
  },
  watch: {
    activeTodo(todo) {
      if (todo) {
        this.search.company_name = ''
        this.search.status = ''
        this.search.risk_level = ''
        this.getData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.company-name {
    display: inline-block;
    width: 200px;
}
.status {
    display: inline-block;
    width: 200px;
    margin-left: 5px;
}
.risk-level {
    display: inline-block;
    width: 200px;
    margin-left: 5px;
}
.search-btn {
    display: inline-block;
    width: 200px;
    margin-left: 5px;
}
#all {
    border: none;
    margin-top: -18px;
    .pagination {
        right: 35px;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
#already {
    margin-top: -18px;
    .pagination {
        right: 35px;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
#untreated {
    margin-top: -18px;
    .pagination {
        right: 35px;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
