<template>
<div id="layout">
  <wk-header></wk-header>
  <!-- 侧边栏 -->
  <wk-navbar></wk-navbar>
  <!-- 内容区 -->
  <div id="content">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
  <!-- <wk-footer></wk-footer> -->
</div>
</template>
<script>
import WkHeader from '@/components/Header'
import WkNavbar from '@/components/Navbar'

export default {
  name: 'layout',
  components: {
    // WkFooter,
    WkHeader,
    WkNavbar
  }
}
</script>
<style lang="scss" scoped>
#content {
    overflow: auto;
    height: calc(100vh);
    padding: 15px 20px 20px 20px;
    background-color: #EEF5FD;
    .breadcrumb {
        margin-bottom: 20px;
    }
}
</style>
