<script>
import { Bar } from 'vue-chartjs';
import { DateTime } from 'luxon';

const tooltipFormats = {
  year: 'yyyy',
  month: 'MM/yyyy',
  day: 'MM/dd/yyyy',
  hour: 'MM/dd/yyyy HH',
};

/* eslint no-underscore-dangle: "off" */
export default {
  extends: Bar,
  props: ['chartData', 'tooltipLabel'],
  computed: {
    options() {
      const vm = this;
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title([tooltipItem], data) {
              const date = data.labels[tooltipItem.index];
              return DateTime.fromJSDate(date).toFormat(
                tooltipFormats[data.$unit]
              );
            },
            label(tooltipItem) {
              return vm.tooltipLabel(tooltipItem.value);
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: this.chartData.$unit,
                round: this.chartData.$unit,
              },
            },
          ],
        },
        onClick: e => {
          // eslint-disable-next-line
          if (!this.$data || !this.$data._chart) {
            // no drill if no chart is rendered
            return;
          }
          // eslint-disable-next-line
          const [active] = this.$data._chart.getElementAtEvent(e);
          if (!active) {
            return; // no drill if clicked outside bars
          }
          const target = {
            // eslint-disable-next-line
            label: active._chart.data.labels[active._index],
            // eslint-disable-next-line
            index: active._index,
          };

          this.$emit('drill', target);
        },
      };
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData() {
      // eslint-disable-next-line
      const chart = this.$data._chart;
      chart.data = this.chartData;
      const timeOptions = chart.options.scales.xAxes[0].time;
      timeOptions.unit = this.chartData.$unit;
      timeOptions.round = this.chartData.$unit;
      chart.update();
    },
  },
};
</script>
