<template>
  <DoughnutChart
    v-if="chartData"
    :chart-data="chartData"
    :options="{responsive: true, maintainAspectRatio: false}"
  />
</template>
<script>
import firebase from 'firebase/app';
import DoughnutChart from '@/components/dashboard/DoughnutChart.vue';

export default {
  props: {
    func: String,
    data: Object,
  },
  components: { DoughnutChart },
  data() {
    return {
      chartData: null,
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
    const { data } = await firebase.functions().httpsCallable(this.func)(
      this.data || {}
    );
    this.chartData = {
      datasets: [
        {
          data: data.map(row => Object.values(row)[1]),
          backgroundColor: this.colors, // TODO: maybe it is not enough
        },
      ],
      labels: data.map(row => Object.values(row)[0]),
    };
  },
};
</script>
