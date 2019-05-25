<template>
  <div>
    <v-breadcrumbs
      divider=">"
      :items="drillBreadcrumbItems"
    >
      <template v-slot:item="props">
        <a
          @click="jumpTo(props.item)"
          :class="[props.item.last && 'disabled']"
        >{{ props.item.text.toUpperCase() }}</a>
      </template>
    </v-breadcrumbs>
    <div
      class="chart-container"
      :class="{loading}"
    >
      <BarChart
        :chart-data="chartData"
        v-if="chartData"
        @drill="drillDown"
      />
      <v-progress-circular
        v-if="loading"
        class="loader"
        indeterminate
        color="primary"
      ></v-progress-circular>

    </div>
  </div>
</template>
<script>
import BarChart from '@/components/dashboard/BarChart.vue';
import { aggregateTotalOverTimePeriod } from '@/functions';
import { dateRange } from '@/util/dates';
import { DateTime } from 'luxon';

function label(period) {
  switch (period) {
    case 'yearly':
      return row => new Date(row.year, 0, 1);
    case 'monthly':
      return row => new Date(row.year, row.month - 1, 1);
    case 'daily':
      return row => new Date(row.year, row.month - 1, row.day);
    case 'hourly':
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

const breadcrumbFor = {
  monthly(start) {
    const [y] = start.split('-');
    return `${y}`;
  },
  daily(start) {
    const [y, m] = start.split('-');
    return `${m}/${y}`;
  },
  hourly(start) {
    const [, , d] = start.split('-');
    return `${d}`;
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
      loading: false,
      rows: null,
      chartData: null,
      drillLevel: 1,
      drillLevels: ['yearly', 'monthly', 'daily', 'hourly'],
      start: '2018-05-01',
      end: '2019-05-01',
      drillBreadcrumbs: [
        {
          text: 'Overall',
          start: '1970-01-01',
          end: DateTime.local()
            .plus({ years: 1 })
            .toSQLDate(),
        },
        {
          text: 'Last year',
          start: '2018-05-01',
          end: '2019-05-01',
        },
      ],
    };
  },
  computed: {
    drillBreadcrumbItems() {
      return this.drillBreadcrumbs.map((bc, index, a) => ({
        ...bc,
        index,
        last: index === a.length - 1,
      }));
    },
  },
  methods: {
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
      const breadcrumb = breadcrumbFor[this.drillLevels[this.drillLevel]](
        this.start,
        this.end
      );
      this.drillBreadcrumbs.push({
        text: breadcrumb,
        start: this.start,
        end: this.end,
      });
    },
    async jumpTo(level) {
      if (level.last) {
        return;
      }
      this.drillBreadcrumbs.splice(
        level.index + 1,
        this.drillBreadcrumbs.length
      );
      this.start = level.start;
      this.end = level.end;
      this.drillLevel = level.index;
      await this.update();
    },
    async update() {
      this.loading = true;

      const unit = unitForPeriod[this.drillLevels[this.drillLevel]];
      const from = DateTime.fromSQL(this.start);
      const to = DateTime.fromSQL(this.end);
      const dates = dateRange(unit, from, to);
      this.chartData = this.newChartData({
        labels: dates,
        data: Array(dates.length).fill(0),
      }); // TODO: estimate axis height?
      const req = {
        period: this.drillLevels[this.drillLevel],
        start: this.start,
        end: this.end,
      };
      console.log('requesting', req);

      const result = await aggregateTotalOverTimePeriod(req);
      this.rows = result.data;
      console.log('result', this.rows);

      this.chartData = this.newChartData({
        labels: result.data.map(label(this.drillLevels[this.drillLevel])),
        data: result.data.map(r => r.total),
      });
      this.loading = false;
    },
    newChartData({ labels, data }) {
      return {
        $unit: unitForPeriod[this.drillLevels[this.drillLevel]],
        labels,
        datasets: [
          {
            label: 'Expenses',
            backgroundColor: this.$vuetify.theme.primary,
            data,
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
.chart-container {
  position: relative;
}
.chart-container.loading::before {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  background: white;
  opacity: 0.7;
}
.chart-container.loading .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
