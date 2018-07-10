<template>
  <div class="guide" id='guide' :style="'background: url(' + bgpic + ') no-repeat center center;background-size: cover;height: 100%'">
    <wkHeader></wkHeader>
    <div class="maincontent">
      <div class="title">
        <img :src="titlepic" alt="">
      </div>

      <div class="guidelist">
        <div class="line1">
          <div class="guidebox">
            <router-link :to="{path: 'onDuty'}" :style="'background: url(' + common1 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
          <div class="guidebox">
            <router-link :to="{path: 'owner'}" :style="'background: url(' + common2 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
          <div class="guidebox">
            <router-link :to="{path: 'todo'}" :style="'background: url(' + common4 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
          <div class="guidebox">
            <router-link :to="{path: 'network'}" :style="'background: url(' + common3 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
          <div class="guidebox">
            <router-link :to="{path: 'log'}" :style="'background: url(' + common6 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
          <div class="guidebox">
            <router-link :to="{path: 'file'}" :style="'background: url(' + common5 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
        </div>

        <div class="line2">
          <div class="guidebox">
            <router-link :to="{path: 'rbac'}" :style="'background: url(' + common7 + ') no-repeat center center;background-size: cover;'"></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import bgpic from '@/assets/bgc-pic.jpg'
import title from '@/assets/navtitle.png'
import wkHeader from '@/components/Header'
import common1 from '@/assets/common1.png'
import common2 from '@/assets/common2.png'
import common3 from '@/assets/common3.png'
import common4 from '@/assets/common4.png'
import common5 from '@/assets/common5.png'
import common6 from '@/assets/common6.png'
import common7 from '@/assets/common7.png'
export default {
  name: 'guide',
  data: () => ({
    bgpic: bgpic,
    titlepic: title,
    common1: common1,
    common2: common2,
    common3: common3,
    common4: common4,
    common5: common5,
    common6: common6,
    common7: common7
  }),
  components: {
    wkHeader
  },
  mounted() {
    const menu = JSON.parse(localStorage.getItem('menu'))
    if (!menu) {
      this.$store.dispatch('handleMenu')
    }
  }
}
</script>
<style lang='scss'>
  html{height: 100%}
  body{min-height: 100%;height: 100%;min-width: 900px;}
  #app{height: 100%}
  #guide {
    #header{
      background: none !important;
      border-bottom: none !important
    }
    .maincontent{
      width: 880px;
      margin: 0 auto;
      .guidelist{
          .guidebox{
            width: 362px;
            height: 61px;
            display: inline-block;
            margin-top: 49px;
            a{
              height: 100%;
              width: 100%;
              display: inline-block;
            }
          }
          .guidebox:nth-child(odd) {
            margin-right: 140px;
            // float: left;
          }
          .guidebox:nth-child(even) {
            // float: right;
          }
        .line2{
          text-align: center;
          .guidebox{
            margin-right: 0
          }
        }
      }
    }
    .title{
      padding-top: 59px;
      margin: 0 auto;
      text-align: center;
      margin-bottom: 20px;
      &>img{

      }
    }
  }
</style>
