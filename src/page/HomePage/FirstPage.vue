<template>
  <div id="homepage_chart">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
  </div>
</template>

<script>
  import LineChart from './components/LineChart'

  export default {
    components: {
      LineChart
    },
    data() {
      return {
        lineChartData: {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          actualData: [120, 82, 91, 154, 162, 140, 145],
          timeData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
      };
    },
    async created() {
      await this.getAllCount()
      await this.todayVisit()
    },
    methods: {
      async todayVisit() {
        const result = await this.$request('/api/home/todayVisit', 'GET', {})
      },
      async getAllCount() {
        const result = await this.$request('/api/home/count', 'GET', {})
        console.log(result)
        if (result.success) {

        }

      },
    }
  }

</script>

<style lang="scss" scoped>

</style>
