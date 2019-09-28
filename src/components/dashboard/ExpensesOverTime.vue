<template>
  <div>
    <div class="header">
      <h2>{{title}}</h2>
    </div>
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
        :style="{height: '100%', position: 'relative'}"
        :chart-data="chartData"
        v-if="chartData"
        @drill="drillDown"
        :tooltip-label="v => nf.format(v)"
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
import firebase from 'firebase/app';
import { DateTime } from 'luxon';
import BarChart from '@/components/charts/BarChart.vue';
import { dateRange } from '@/util/dates';
import FormattableMixin from './FormattableMixin';

function label(period) {
  switch (period) {
    case 'year':
      return ([row]) => new Date(row.year, 0, 1);
    case 'month':
      return ([row]) => new Date(row.year, row.month - 1, 1);
    case 'day':
      return ([row]) => new Date(row.year, row.month - 1, row.day);
    case 'hour':
      return ([row]) => new Date(row.year, row.month - 1, row.day, row.hour);
    default:
      return '';
  }
}
const startEndFor = {
  month([row]) {
    return [`${row.year}-01-01`, `${row.year}-12-31`];
  },
  day([row]) {
    return [
      DateTime.fromObject({
        year: row.year,
        month: row.month,
      }).toISO(),
      DateTime.fromObject({
        year: row.year,
        month: row.month + 1,
      })
        .minus({ milliseconds: 1 })
        .toISO(),
    ];
  },
  hour([row]) {
    const day = DateTime.fromObject({
      year: row.year,
      month: row.month,
      day: row.day,
    });
    return [day.toISO(), day.plus({ days: 1, milliseconds: -1 }).toISO()];
  },
};

const breadcrumbFor = {
  month(start) {
    const [y] = start.split('-');
    return `${y}`;
  },
  day(start) {
    const [y, m] = start.split('-');
    return `${m}/${y}`;
  },
  hour(start) {
    return `${DateTime.fromISO(start).day}`;
  },
};

export default {
  mixins: [FormattableMixin],
  name: 'ExpensesOverTime',
  props: {
    title: {
      type: String,
      default: 'Expenses over time',
    },
    format: {
      type: Object,
      default() {
        return {
          style: 'currency',
          currency: 'EUR',
        };
      },
    },
  },
  components: {
    BarChart,
  },
  data() {
    return {
      loading: false,
      rows: null,
      chartData: null,
      drillLevel: 1,
      drillLevels: ['year', 'month', 'day', 'hour'],
      start: DateTime.local()
        .minus({ years: 1 })
        .toISO(),
      end: DateTime.local().toISO(),
      drillBreadcrumbs: [
        {
          text: 'Overall',
          start: '1970-01-01',
          end: DateTime.local()
            .plus({ years: 1 })
            .toISO(),
        },
        {
          text: 'Last year',
          start: DateTime.local()
            .plus({ years: -1 })
            .toISO(),
          end: DateTime.local().toISO(),
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
      if (!this.chartData) {
        // render dummy chart to display loading animation
        const unit = this.drillLevels[this.drillLevel];
        const from = DateTime.fromISO(this.start);
        const to = DateTime.fromISO(this.end);
        const dates = dateRange(unit, from, to);
        this.chartData = this.newChartData({
          labels: dates,
          data: Array(dates.length).fill(0),
        }); // TODO: estimate axis height?
      }
      const req = {
        period: this.drillLevels[this.drillLevel],
        start: this.start,
        end: this.end,
      };
      const result = await firebase.functions().httpsCallable('query')({
        name: 'aggregateTotalOverTimePeriod',
        params: req,
      });
      this.rows = result.data;

      this.chartData = this.newChartData({
        labels: result.data.map(label(this.drillLevels[this.drillLevel])),
        data: result.data.map(([, total]) => total),
      });
      this.loading = false;
    },
    newChartData({ labels, data }) {
      return {
        $unit: this.drillLevels[this.drillLevel],
        labels,
        datasets: [
          {
            label: 'Expenses',
            backgroundColor: (this.$vuetify.theme.isDark
              ? this.$vuetify.theme.themes.dark
              : this.$vuetify.theme.themes.light
            ).primary,
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
.header {
  padding: 0.2em;
}
.chart-container {
  position: relative;
  height: calc(100% - 37px - 57px);
  width: 100%;
}
.chart-container.loading::before {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  background: white;
  opacity: 0.7;
  z-index: 50;
}
.chart-container.loading .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 51;
}
</style>
