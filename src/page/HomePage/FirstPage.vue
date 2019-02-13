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
        isShowStatus: 1, // 1 按月展示 2 按天展示 3 按小时展示
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

          const minMonth = moment(this.minDate).format('MM')
          const maxMonth = moment(this.maxDate).format('MM')

          const minDay = moment(this.minDate).format('DD')
          const maxDay = moment(this.maxDate).format('DD')

          const minHMS = moment(this.minDate).format('hh:mm:ss')
          const maxHMS = moment(this.maxDate).format('hh:mm:ss')


          if (minMonth !== maxMonth) {
            this.isShowStatus = 1
          }else if ( (minDay == maxDay -1 && (minHMS == '12:00:00' || maxHMS == '12:00:00')) || minDay == maxDay ) {
            this.isShowStatus = 3            
          }else{
            this.isShowStatus = 2
          }
          await this.getAllCount() 
        }
      },
      // 今日访问
      async todayVisit() {
        const result = await this.$request('/api/home/todayVisit', 'GET', {})
      },
      // 获取时间段内数据
      // 如果两个时间段不在一个月，则按月展示
      // 如果两个时间段在一个月，但是并不是 从 一天的 0 - 第二天的 0，则按天展示，否则按小时展示
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
        })
        if (result.success) {
          if (this.isShowStatus == 3) {
            result.data.map(x => {
              this.lineChartData.visitData.push(x.todayVisit)
              this.lineChartData.liveData.push(x.liveCount)
              this.lineChartData.timeData.push(moment(x.created_at).format('MM-DD HH:mm'))
            })
          }else if (this.isShowStatus == 1){
            let tmpArr = []
            
            for (let i = 0; i < result.data.length; i++) {
              const MM = moment(result.data[i].created_at).format('MM')
              const DD = moment(result.data[i].created_at).format('DD')

              if (i > 0 && MM == moment(result.data[i - 1].created_at).format('MM')) {
                tmpArr.map(x => {
                  if (x.month == MM) {
                    x.visitData = x.day == DD ? result.data[i].todayVisit > result.data[i - 1].todayVisit ? x.visitData - result.data[i - 1].todayVisit + result.data[i].todayVisit: x.visitData: x.visitData + result.data[i].todayVisit
                    x.liveData += result.data[i].liveCount
                    x.day = DD
                  }
                })
              }else {
                let tmpObj = {
                  day: DD,
                  month: MM,
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
            
          }else if (this.isShowStatus == 2) {
            let tmpArr = []
            
            for (let i = 0; i < result.data.length; i++) {
              const DD = moment(result.data[i].created_at).format('DD')
              if (i > 0 && DD == moment(result.data[i - 1].created_at).format('DD')) {
                tmpArr.map(x => {
                  if (x.day == DD) {
                    x.visitData = result.data[i].todayVisit
                    x.liveData = x.liveData > result.data[i].liveCount ? x.liveData : result.data[i].liveCount
                  }
                })
              }else {
                let tmpObj = {
                  day: DD,
                  month: moment(result.data[i].created_at).format('MM'),
                  visitData: result.data[i].todayVisit,
                  liveData: result.data[i].liveCount
                }
                tmpArr.push(tmpObj)
              }
            }
            tmpArr.map(x => {
              this.lineChartData.visitData.push(x.visitData)
              this.lineChartData.liveData.push(x.liveData)
              this.lineChartData.timeData.push(x.month + '月' + x.day + '日')
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


