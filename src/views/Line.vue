<script>
import { Bar, mixins } from 'vue-chartjs';
import { aggregateTotalOverTimePeriod } from '@/functions';

export default {
  extends: Bar,
  mixins: [mixins.reactiveData],
  data() {
    return {
      chartdata: {
        datacollection: {
          labels: ['January', 'February'],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [40, 20],
            },
          ],
        },
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: e => {
          // eslint-disable-next-line
          const [active] = this.$data._chart.getElementAtEvent(e);
          // console.log(e);
          // eslint-disable-next-line
          console.log(active._chart.data.labels[active._index]);
        },
      },
    };
  },

  async mounted() {
    // this.renderChart(this.chartdata.datacollection, this.options);
    const result = await aggregateTotalOverTimePeriod({
      period: 'monthly',
      start: '2018-05-01',
      end: '2019-05-01',
    });
    console.log(result);
    this.renderChart(
      {
        labels: result.data.map(row => `${row.month}/${row.year}`),
        datasets: [
          {
            label: 'Monthly expenses',
            backgroundColor: '#f87979',
            data: result.data.map(r => r.total),
          },
        ],
      },
      this.options
    );
  },
};
</script>
