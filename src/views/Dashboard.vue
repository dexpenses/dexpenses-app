<template>
  <div>
    <!-- <ExpensesOverTime /> -->
    <!-- <TagCloud style="height: 500px; width: 800px;" /> -->
    <DoughnutAggregation func="aggregateByPaymentMethod" />
  </div>
</template>
<script>
import ExpensesOverTime from '@/components/dashboard/ExpensesOverTime.vue';
import TagCloud from '@/components/dashboard/TagCloud.vue';
import DoughnutAggregation from '@/components/dashboard/DoughnutAggregation.vue';

export default {
  name: 'Dashboard',
  components: {
    ExpensesOverTime,
    TagCloud,
    DoughnutAggregation,
  },
  data() {
    return {
      Chart,
    };
  },
  mounted() {
    console.log(this.$vuetify.theme);
  },
};
</script>
<style scoped>
</style>
