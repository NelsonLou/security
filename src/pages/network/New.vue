
<template>
<div id="new">
  <el-card class="box-card">
    <div>
      <div class="noticeBox" v-for="item in news">
         <div class="noticeBox-hear">
          <span style=" font-size: 16px; color: #263645；">{{ item.notice_title }}</span>
          <span style="font-size: 12px; margin-left: 3%; font-size: 11px; color: #9b9292">{{item.admin_nick}}&#32于&#32{{item.created_at}}&#32发布</span>
        </div> 
        <textarea style=" background: #eef6fd; display: block; margin: 0 auto; width: 95%;border: none; resize: none;outline:none; font-size: 13px; color: #828282;" name="" id="" cols="30" rows="10" readonly>{{item.notice_content}}</textarea>
      </div>
    </div>

  </el-card>
</div>
</template>
<script>
export default {
  name: 'new',
  data: () => ({
    news: []
  }),
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      const para = {

      }
      this.axios.get('notice-new', {
        params: para
      }).then(res => {
        const {
          code,
          data
        } = res.data
        if (code === 1) {
          this.news = data.notice_new
          console.log(data)
        } else {
          console.log('请求失败')
        }
      })
    }
  }
}
</script>
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
