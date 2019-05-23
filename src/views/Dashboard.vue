<template>
  <div>
    <v-btn
      @click="drillUp"
      :disabled="drillLevel === 0"
    >Drill Up</v-btn>
    <BarChart
      :chart-data="chartData"
      v-if="chartData"
      @drill="drillDown"
    />
  </div>
</template>
<script>
import BarChart from '@/components/dashboard/BarChart.vue';
import { aggregateTotalOverTimePeriod } from '@/functions';

function label(period) {
  switch (period) {
    case 'yearly':
      // return r => r.year;
      return row => new Date(row.year, 0, 1);
    case 'monthly':
      // return row => `${row.month}/${row.year}`;
      return row => new Date(row.year, row.month - 1, 1);
    case 'daily':
      // return row => row.day;
      return row => new Date(row.year, row.month - 1, row.day);
    case 'hourly':
      // return row => row.hour;
      return row => new Date(row.year, row.month - 1, row.day, row.hour);
    default:
      return '';
  }
}

const startEndFor = {
  monthly(row) {
    return [`${row.year}-01-01`, `${row.year}-12-31`];
  },
  daily(row) {
    return [
      `${row.year}-${row.month}-01`,
      `${row.year}-${row.month}-${new Date(row.year, row.month, 0).getDate()}`,
    ];
  },
  hourly(row) {
    const day = `${row.year}-${row.month}-${row.day}`;
    return [day, `${day} 23:59:59.999999`];
  },
};

const unitForPeriod = {
  yearly: 'year',
  monthly: 'month',
  daily: 'day',
  hourly: 'hour',
};

export default {
  name: 'Dashboard',
  components: {
    BarChart,
  },
  data() {
    return {
      rows: null,
      chartData: null,
      drillLevel: 1,
      drillLevels: ['yearly', 'monthly', 'daily', 'hourly'],
      start: '2018-05-01',
      end: '2019-05-01',
    };
  },
  methods: {
    drillUp() {},
    async drillDown(e) {
      if (this.drillLevel === this.drillLevels.length - 1) {
        return;
      }
      this.drillLevel += 1;
      const drillSource = this.rows[e.index];
      [this.start, this.end] = startEndFor[this.drillLevels[this.drillLevel]](
        drillSource
      );
      await this.update();
    },
    async update() {
      const req = {
        period: this.drillLevels[this.drillLevel],
        start: this.start,
        end: this.end,
      };
      console.log('requesting', req);

      const result = await aggregateTotalOverTimePeriod(req);
      this.rows = result.data;
      console.log('result', this.rows);

      this.chartData = {
        $unit: unitForPeriod[this.drillLevels[this.drillLevel]],
        labels: result.data.map(label(this.drillLevels[this.drillLevel])),
        datasets: [
          {
            label: 'Expenses',
            backgroundColor: '#f87979',
            data: result.data.map(r => r.total),
          },
        ],
      };
    },
  },
  async mounted() {
    await this.update();
  },
};
</script>
<style scoped>
.dashboard-item {
  border: 2px solid black;
}
</style>
