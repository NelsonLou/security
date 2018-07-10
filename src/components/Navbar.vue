<template>
<div class="navbar">
  <div class="mail">
    <el-badge :value="unreadcount" :max="99" class="item">
      <el-button size="small" icon="message" @click="message" style="color:#fff;border-radius: 50%;background: #3E92F2;border:none;padding: 12px;"></el-button>
    </el-badge>
  </div>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="(item, index) in menu.menu" :key = "item.path" :label="item.name" :name="item.path">
      <div class="nav-child">
        <div class="todo" v-show="item.path === '/todo'">
          <el-badge class="item">
            <span class="toggle" style="margin-left: 20px;" v-bind:style="{ color: allColor }" @click="toggle('all', 'allColor')">全部事务</span>
          </el-badge>
          <el-badge class="item">
            <span class="toggle" v-bind:style="{ color: alreadyColor }" @click="toggle('already', 'alreadyColor')">已处理事务</span>
          </el-badge>
          <el-badge :value="unfinshedcount" :max="99" class="item">
            <span class="toggle" v-bind:style="{ color: untreatedColor }" @click="toggle('untreated', 'untreatedColor')">未处理事物</span>
          </el-badge>
        </div>
        <el-menu v-show="item.path !== '/todo'" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <el-menu-item  v-show="item.children && item.path !== '/todo'"  v-for="(i, index) in item.children" :key = "i.path" :index="i.path"><router-link :to='i.path'>{{ i.name }}</router-link></el-menu-item>
          <el-menu-item  v-show="!item.children"  :index="item.path"><router-link :to='item.path'>{{ item.name }}</router-link></el-menu-item>
        </el-menu>
      </div>
    </el-tab-pane>
  </el-tabs>
  <div v-show="unfinshedcount != 0" class="count1" :style="{ left: left }">{{ unfinshedcount }}</div>
</div>
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'navbar',
  data () {
    return {
      activeName: '',
      activeIndex: '',
      allColor: '#20a0ff',
      alreadyColor: '#48576a',
      untreatedColor: '#48576a',
      left: '0px'
    }
  },
  computed: {
    ...mapGetters({
      'menu': 'getMenu',
      'menuOpened': 'getMenuOpened',
      'menuActive': 'getMenuActive',
      'unreadcount': 'getUnreadcount',
      'unfinshedcount': 'getUnfinshedcount'
    })
  },
  mounted() {
    this.$store.dispatch('getUnreadcount')
    this.$store.dispatch('getUnfinshedcount')
    const menu = JSON.parse(localStorage.getItem('menu'))
    for (let i in menu.menu) {
      if (menu.menu[i].path === '/todo') {
        this.left = 96 * (parseInt(i) + 1) + 'px'
      }
    }
    if (!menu) {
      this.$store.dispatch('handleMenu')
    }
    this.activeName = this.$route.matched[0].path
    this.activeIndex = this.$route.matched[1].path
  },
  methods: {
    ...mapActions(['handleOpenChildMenu', 'handleCloseChildMenu', 'handleActiveMenu']),
    handleClick(tab, event) {
      this.$router.push(tab.name)
      this.activeIndex = this.$route.matched[1].path
    },
    message() {
      this.$router.push('/message')
      this.activeIndex = '/message'
    },
    toggle(todo, color) {
      this.allColor = '#48576a'
      this.alreadyColor = '#48576a'
      this.untreatedColor = '#48576a'
      this[color] = '#20a0ff'
      this.$store.state.app.activeTodo = todo
    }
  },
  watch: {
    '$route': function() {
      this.activeName = this.$route.matched[0].path
      this.activeIndex = this.$route.matched[1].path
    }
  }
}
</script>
<style lang='scss'>
.mail{
  .el-badge__content.is-fixed.is-dot{
    right: 10px;
    top: 4px;
  }
}
</style>
<style lang="scss">
.navbar {
  a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.navbar{
  .el-tabs__item.is-active{
    color: #fff;
  }
  .el-tabs__header {
    margin: 0 !important;
    background-color: #022D58;
  }
  .el-tabs__content {
    // background: #F8F8F8;
    background-color: #EEF5FD;
  }
  .el-tabs__content.el-menu--horizontal .el-menu-item {
    border: none;
  }
  .el-tabs__item {
    height: 60px;
    line-height: 60px;
    color: #A4B0E0;
  }
  .el-tabs__item:hover {
    color: #fff;
  }
  .el-menu--horizontal>.el-menu-item:hover{
    border: none;
    color: #20a0ff;
  }
  .el-menu--horizontal .el-menu-item {
    border: none;
  }
  .el-tabs__item {
    font-size: 16px;
  }
  .el-tabs__header {
    padding-left: 20px;
  }
  .nav-child {
    background: #f8f8f8;
    margin-left: 20px;
    margin-top: 15px;
    height: 62px;
    margin-right: 20px;
    .el-menu{
      border: 1px solid #e6e5e5;
    }
  }
}

.mail {
  position: absolute;
  margin-top: 12px;
  top: 5px;
  right: 165px;
}

.count1 {
  background-color: #ff4949;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  width: 16px;
  height: 16px;
  line-height: 15px;
  border: 1px solid #fff;
  position: absolute;
  top: 80px;
  text-align: center;
}
.todo {
  padding-top: 18px;
  height: 46px;
}

.toggle {
  display: inline-block;
  font-size: 14px;
  height: 46px;
  margin-left: 35px;
  cursor: pointer;
}

.toggle:hover {
  color: #20a0ff
}
</style>
