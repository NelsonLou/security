<template>
<div id="not-found">
  <h1 class="nf-title">哎呀..</h1>
  <h1 class="nf-title">您无权操作</h1>
  <h1 class="count">404！</h1>
  <h1 class="nf-count">{{count}}秒后即将跳转</h1>
</div>
</template>
<script>
export default {
  name: 'not-found',
  data: () => ({
    count: 3
  }),
  mounted() {
    this.delayAndRedirect()
  },
  methods: {
    delayAndRedirect() {
      let that = this
      setInterval(() => {
        this.count -= 1
      }, 1000)
      setTimeout(() => {
        // that.$store.dispatch('handleResetMenu') // 重置菜单
        that.$router.push('/guide') // 路由指向首页
      }, 3000)
    }
  }
}
</script>
<style lang="scss" scoped>
#not-found {
    overflow: hidden;
    text-align: center;
    .nf-title {
        color: coral;
        font-size: 30px;
    }
    .nf-count {
        color: green;
        font-size: 30px;
    }
    .count {
        color: red;
        font-size: 48px;
    }
}
</style>
