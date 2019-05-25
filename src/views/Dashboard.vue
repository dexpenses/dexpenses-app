<template>
  <div>
    <!-- <ExpensesOverTime /> -->
    <TagCloud style="height: 500px; width: 800px;" />
  </div>
</template>
<script>
import ExpensesOverTime from '@/components/dashboard/ExpensesOverTime.vue';
import TagCloud from '@/components/dashboard/TagCloud.vue';

export default {
  name: 'Dashboard',
  components: {
    ExpensesOverTime,
    TagCloud,
  },
};
</script>
<style scoped>
</style>
