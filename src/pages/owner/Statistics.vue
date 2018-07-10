<template>
<div id="statistics">
  <el-card class="box-card">
    <div class="map">
      <el-button @click="map" autofocus style="margin-bottom:10px;">查看今日统计</el-button>
      <el-button @click="column" style="margin-bottom:10px;">查看本周统计</el-button>
      <el-button @click="months" style="margin-bottom:10px;">查看本月统计</el-button>
      <el-button @click="year" style="margin-bottom:10px;">查看本年统计</el-button>
      <div class="" v-show="data">
        <div class="title">
          <h2 v-show="status == 'map'">今日扫描次数：{{ data.today_scan_count }}</h2>
          <h2 v-show="status == 'column'">本周扫描次数：{{ data.week_scan_count }}</h2>
          <h2 v-show="status == 'months'">本月扫描次数：{{ data.week_scan_count }}</h2>
          <h2 v-show="status == 'year'">本年扫描次数：{{ data.week_scan_count }}</h2>
        </div>
        <div id="main" style="height: 600px;"></div>
      </div>
    </div>
    <div v-show="data == ''" style="height: 650px">
      <h2 style="text-align: center;line-height: 450px; color: #333">暂无扫描记录！</h2>
    </div>
  </el-card>
</div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'statistics',
  data: () => ({
    data: {},
    shuju: 'map',
    status: 'map'
  }),
  mounted() {
    this.axios.get('clientinfo-count').then(res => {
      console.log(res.data.data)
      if (res.data.data.today_scan_count === 0) {
        this.data = ''
      } else {
        this.data = res.data.data
        this.map()
      }
    })
  },
  methods: {
    map() {
      this.status = 'map'
      let dom = document.getElementById('main')
      let myChart = echarts.init(dom)
      let option
      option = {
        legend: {
          orient: 'vertical',
          x: 'left',
          data: [
            `今日高风险: ${this.data.today_scan_count_high}`,
            `今日中风险: ${this.data.today_scan_count_middle}`,
            `今日低风险: ${this.data.today_scan_count_low}`,
            `今日无风险: ${this.data.today_scan_count_safe}`
          ]
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
              value: this.data.today_scan_count_high,
              name: `今日高风险: ${this.data.today_scan_count_high}`
            },
            {
              value: this.data.today_scan_count_middle,
              name: `今日中风险: ${this.data.today_scan_count_middle}`
            },
            {
              value: this.data.today_scan_count_low,
              name: `今日低风险: ${this.data.today_scan_count_low}`
            },
            {
              value: this.data.today_scan_count_safe,
              name: `今日无风险: ${this.data.today_scan_count_safe}`
            }
          ]
        }]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    column() {
      this.status = 'column'
      // 基于准备好的dom，初始化echarts实例
      let Chart = echarts.init(document.getElementById('main'))

      // 指定图表的配置项和数据
      let options = {
        tooltip: {},
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: [
            this.data.week_scan_count_every_day.Mon,
            this.data.week_scan_count_every_day.Tue,
            this.data.week_scan_count_every_day.Wed,
            this.data.week_scan_count_every_day.Turs,
            this.data.week_scan_count_every_day.Fir,
            this.data.week_scan_count_every_day.Sat,
            this.data.week_scan_count_every_day.Sun
          ]
        }]
      }

      // 使用刚指定的配置项和数据显示图表。
      Chart.setOption(options)
    },
    months() {
      this.status = 'months'
      // 基于准备好的dom，初始化echarts实例
      let Chart = echarts.init(document.getElementById('main'))

      let xData = []
      let sData = []
      for (let key in this.data.month_scan_count_every_day) {
        xData.push(key)
        sData.push(this.data.month_scan_count_every_day[key])
      }

      // 指定图表的配置项和数据
      let options = {
        tooltip: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: sData
        }]
      }

      // 使用刚指定的配置项和数据显示图表。
      Chart.setOption(options)
    },
    year() {
      this.status = 'year'
      // 基于准备好的dom，初始化echarts实例
      let Chart = echarts.init(document.getElementById('main'))

      let xData = []
      let sData = []
      for (let key in this.data.year_scan_count_every_day) {
        xData.push(key)
        sData.push(this.data.year_scan_count_every_day[key])
      }

      // 指定图表的配置项和数据
      let options = {
        tooltip: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: sData
        }]
      }

      // 使用刚指定的配置项和数据显示图表。
      Chart.setOption(options)
    }
  }
}
</script>
<style lang="scss" scoped>
#statistics {
    #main {
        margin: 0 auto;
    }
    .title {
        position: absolute;
        text-align: center;
        left: 0;
        right: 0;
        margin: auto;
    }
}
</style>
