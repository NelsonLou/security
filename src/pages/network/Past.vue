<template>
<div id="past">
  <el-card class="box-card">
    <!--工具条  -->
    <div v-show="isShow" slot="header" class="card-header">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="keyword" placeholder="请输入标题">
            <el-button slot="append" icon="search" @click="getUsers" type="primary">搜索</el-button>
          </el-input>
        </el-form-item>
        <el-button v-if="permission_list.noticeAdd.status" icon="plus" type="primary" @click="isAdd = true" class="header-right">添加</el-button>
      </el-form>
    </div>

    <!-- 列表 -->
    <div style="position: relative;">
      <div v-show="isShow">
        <el-table v-loading.body="listLoading" :data="news" highlight-current-row border>
          <el-table-column prop="notice_title" label="标题" width="300"></el-table-column>
          <el-table-column prop="notice_content" label="内容"></el-table-column>
          <el-table-column prop="created_at" label="发布时间" width="180"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
                <el-button size="small" @click="seeUser(scope.$index, scope.row)">查看</el-button>
                <el-button size="small" v-if="permission_list.noticeEdit.status" @click="edit(scope.$index, scope.row)" icon="edit" type="primary">修改</el-button>
                <!-- <el-button @click="getDelete" size="small" icon="delete" type="danger">删除</el-button> -->
              </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 公告查看 -->
      <div v-show="!isShow" class="noticeBox">
        <div class="noticeBox-hear" :data="message">
          <span style=" font-size: 16px; color: #263645;">{{message.notice_title}}</span>
          <span style="font-size: 12px; margin-left: 3%; font-size: 11px; color: #9b9292">{{message.admin_nick}}&#32于&#32{{message.created_at}}&#32发布</span>
        </div>
        <textarea style=" background: #eef6fd; display: block; margin: 0 auto; width: 95%;border: none; resize: none;outline:none; font-size: 13px; color: #828282;" name="" id="" cols="30" rows="10" readonly>{{message.notice_content}}</textarea>
        <el-button @click="isShow = true" style=" width: 100px; margin-left: 93%;margin-bottom: 10px;" size="medium" type="primary">返回</el-button>
      </div>
    </div>

    <!-- 公告修改 -->
    <el-dialog title="修改公告内容" :visible.sync="isEdit">
      <el-form>
        <el-form-item label="公告标题">
          <el-input type="textarea" v-model="arr.notice_title" auto-complete="off"></el-input>
        </el-form-item>
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="arr.notice_content">
        </el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button @click="getEdit" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加公告 -->
    <el-dialog title="添加公告" :visible.sync="isAdd">
      <el-form>
        <el-form-item label="公告标题">
          <el-input v-model="addTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请输入内容" v-model="addContent">
        </el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button @click="getAdd" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加公告 -->
    <el-dialog title="添加公告" :visible.sync="isAdd">
      <el-form>
        <el-form-item label="公告标题">
          <el-input v-model="addTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-input type="textarea" autosize placeholder="请输入内容" v-model="addContent">
        </el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button @click="getAdd" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!--分页-->
    <div v-show="isShow" class="toolbar">
      <el-pagination :page-size="limit" :total="total" @current-change="handleCurrentChange" style="float:right"></el-pagination>
    </div>
  </el-card>
</div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'past',
  data: () => ({
    arr: [],
    keyword: '',
    news: [],
    message: [],
    limit: 10,
    page: 1,
    total: 0,
    listLoading: false,
    isShow: true,
    isEdit: false,
    isAdd: false,
    addTitle: '',
    addContent: ''
  }),
  mounted() {
    this.getUsers()
    console.log(this.$store.state.app.permission_list.noticeAdd.status)
  },
  computed: {
    ...mapState({
      permission_list: state => state.app.permission_list
    }),
    noticeTitle() {
      return row => row.notice_content.substring(0, 18) + '...'
    },
    noticeDetail() {
      return row => row.notice_content.substring(0, 50) + '...'
    }
  },
  methods: {
    // 查看用户
    seeUser(index, row) {
      const para = {
        notice_id: row.notice_id
      }
      this.getMessage(para)
      // console.log(para)
    },
    getUsers() {
      const para = {
        page: this.page,
        limit: this.limit,
        keyword: this.keyword

      }
      this.axios.get('notice-list', {
        params: para
      }).then(res => {
        const {
          code,
          data
        } = res.data
        if (code === 1) {
          let list = data.notice_list
          this.total = data.total
          this.news = list
        } else {
          console.log('请求失败')
        }
      })
    },
    getMessage(para) {
      this.axios.get('notice-detail', {
        params: para
      }).then(res => {
        // console.log(res)
        const {
          code,
          data
        } = res.data
        if (code === 1) {
          this.message = data.notice_detail
          this.isShow = false
        } else {
          console.log('请求失败')
        }
      })
    },
    // 公告修改
    edit(index, row) {
      this.isEdit = true
      this.arr = row
    },
    getEdit() {
      var _this = this
      this.axios.post('notice-edit', {
          notice_id: this.arr.notice_id,
          notice_title: this.arr.notice_title,
          notice_content: this.arr.notice_content
        })
        .then(function(res) {
          console.log('成功：' + res)
          _this.isEdit = false
          _this.getUsers()
        })
        .catch(function(err) {
          console.log('报错：' + err)
        })
    },
    // 公告添加
    getAdd() {
      var _this = this
      this.axios.post('notice-add', {
          notice_title: this.addTitle,
          notice_content: this.addContent
        })
        .then(function(res) {
          _this.isAdd = false
          _this.getUsers()
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    // 公告删除
    getDelete() {
      this.axios.post('notice-delete', {
          notice_id: this.arr.notice_id
        })
        .then(function(res) {
          console.log(res)
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    // 用户分页列表
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    }
  }
}
</script>
<style lang='scss'>
#past {
    .el-table .cell {
        white-space: nowrap !important;
    }
}
</style>
<style lang="scss" scoped>
.noticeBox {
    margin: 20px auto;
    width: 95%;
    background: #eef6fd;
    border: 1px solid lightgray;
    .noticeBox-hear {
        width: 95%;
        height: 30px;
        margin: 10px auto;
        border-bottom: 1px dashed lightgray;
    }
}
</style>
