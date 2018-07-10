<template>
<div id="app">
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
a {
    text-decoration: none;
}
body {
    margin: 0;
    font-family: 'Microsoft YaHei';
}
// Element UI 样式重置
#app {
    .el-card {
        border-style: none;
        box-shadow: none;
        .el-card__header {
            padding: 16px 20px;
            border-bottom-color: #f8f8f8;
        }
    }
    .card-header {
        overflow: hidden;
        .header-right {
            float: right;
        }
        .header-left {
            float: left;
        }
        .el-form-item {
            margin-bottom: 0;
        }
    }
    .el-form .el-input__inner {
        max-width: 320px;
    }
    .el-table th>.cell {
        text-align: center;
    }
    .el-table .cell {
        text-align: center;
    }
    // 过渡动画
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
}
// 自定义滚动条样式
::-webkit-scrollbar-track-piece {
    width: 8px;
    background-color: #f8f8f8;
}
::-webkit-scrollbar {
    width: 8px;
    height: 6px;
}
::-webkit-scrollbar-thumb {
    height: 50px;
    cursor: pointer;
    background-color: #e6e6e6;
}
.el-message {
    margin-top: 23%;
}
</style>
