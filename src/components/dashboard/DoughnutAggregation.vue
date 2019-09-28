<template>
  <DoughnutChart
    v-if="chartData"
    :chart-data="chartData"
    :options="options"
  />
</template>
<script>
import firebase from 'firebase/app';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import FormattableMixin from './FormattableMixin';

export default {
  mixins: [FormattableMixin],
  props: {
    func: String,
    data: Object,
  },
  components: { DoughnutChart },
  data() {
    const self = this;
    return {
      chartData: null,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const value =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return self.nf.format(value);
            },
          },
        },
      },
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.isDark
        ? this.$vuetify.theme.themes.dark
        : this.$vuetify.theme.themes.light;
    },
    colors() {
      return [
        this.theme.primary,
        this.theme.error,
        this.theme.secondary,
        this.theme.success,
        this.theme.warning,
        this.theme.accent,
      ];
    },
  },
  async mounted() {
    const { data } = await firebase.functions().httpsCallable('query')({
      name: this.func,
      params: this.data || {},
    });
    this.chartData = {
      datasets: [
        {
          data: data.map(({ value }) => value),
          backgroundColor: this.colors, // TODO: maybe it is not enough
        },
      ],
      labels: data.map(({ key }) => key),
    };
  },
};
</script>
