<template>
  <div>
    <DoughnutChart
      v-if="chartData"
      :chart-data="chartData"
      :options="{responsive: true}"
    />
  </div>
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
      colors: [
        this.$vuetify.theme.primary,
        this.$vuetify.theme.error,
        this.$vuetify.theme.secondary,
        this.$vuetify.theme.success,
        this.$vuetify.theme.warning,
        this.$vuetify.theme.accent,
      ],
    };
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
