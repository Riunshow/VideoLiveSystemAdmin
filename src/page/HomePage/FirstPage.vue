<template>
  <div id="homepage_chart" v-loading="loading">
    <div class="head">
      <el-date-picker
        v-model="selectDate"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        :editable="false"
        @change="datePicker"
      >
      </el-date-picker>
    </div>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
  </div>
</template>

<script>
  import LineChart from './components/LineChart'
  import moment from 'moment'

  export default {
    components: {
      LineChart
    },
    data() {
      return {
        lineChartData: {
          visitData: [],
          liveData: [],
          timeData: []
        },
        loading: false,
        selectDate: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        minDate: '',
        maxDate: '',
        isShowDay: true, // 按天展示 || 按月展示
      };
    },
    async created() {
      await this.todayVisit()
      this.selectDate = [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)]
      await this.datePicker(this.selectDate)
    },
    methods: {
      // 日期选择
      async datePicker(e) {
        if (e) {
          this.minDate = moment(e[0]).format()
          this.maxDate = moment(e[1]).format()
          if (moment(this.minDate).format('MM') !== moment(this.maxDate).format('MM')) {
            this.isShowDay = false
          }else {
            this.isShowDay = true
          }
          await this.getAllCount() 
        }
      },
      // 今日访问
      async todayVisit() {
        const result = await this.$request('/api/home/todayVisit', 'GET', {})
      },
      // 获取时间段内数据
      async getAllCount() {
        this.lineChartData = {
          visitData: [],
          liveData: [],
          timeData: []
        },
        this.loading = true
        const result = await this.$request('/api/home/count', 'POST', {
          minDate: this.minDate, 
          maxDate: this.maxDate,
          isShowDay: this.isShowDay
        })
        if (result.success) {
          if (this.isShowDay) {
            result.data.map(x => {
              this.lineChartData.visitData.push(x.todayVisit)
              this.lineChartData.liveData.push(x.liveCount)
              this.lineChartData.timeData.push(moment(x.created_at).format('MM-DD HH:mm'))
            })
          }else {
            let tmpArr = []
            
            for (let i = 0; i < result.data.length; i++) {
              const DD = moment(result.data[i].created_at).format('MM')
              if (i > 0 && DD == moment(result.data[i - 1].created_at).format('MM')) {
                tmpArr.map(x => {
                  if (x.month == DD) {
                    x.visitData += result.data[i].todayVisit
                    x.liveData += result.data[i].liveCount
                  }
                })
              }else {
                let tmpObj = {
                  month: DD,
                  year: moment(result.data[i].created_at).format('YYYY'),
                  visitData: result.data[i].todayVisit,
                  liveData: result.data[i].liveCount
                }
                tmpArr.push(tmpObj)
              }
            }
            tmpArr.map(x => {
              this.lineChartData.visitData.push(x.visitData)
              this.lineChartData.liveData.push(x.liveData)
              this.lineChartData.timeData.push(x.year + '年' + x.month + '月')
            })
            
          }

        }
        this.loading = false
      },
    }
  }

</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  .el-date-picker, .el-switch {
    margin: 0 15px;
  }
}
</style>


