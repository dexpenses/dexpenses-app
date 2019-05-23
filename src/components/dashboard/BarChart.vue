<script>
import { Bar } from 'vue-chartjs';

/* eslint-disable no-underscore-dangle: "off" */
export default {
  extends: Bar,
  props: ['chartData'],
  computed: {
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: this.chartData.$unit,
                round: this.chartData.$unit,
                // displayFormats: {
                //   day: 'MMM D'
                // }
              },
            },
          ],
        },
        onClick: e => {
          console.log('onClick');

          // eslint-disable-next-line
          const [active] = this.$data._chart.getElementAtEvent(e);
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
      console.log('options changed');
      // eslint-disable-next-line
      const chart = this.$data._chart;
      chart.data = this.chartData;
      const timeOptions = chart.options.scales.xAxes[0].time;
      timeOptions.unit = this.chartData.$unit;
      timeOptions.round = this.chartData.$unit;
      // TODO: we should adapt the tooltip value for given unit
      chart.update();
    },
  },
};
</script>
