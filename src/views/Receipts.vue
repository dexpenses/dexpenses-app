<template>
  <v-container>
    <v-progress-circular v-if="!keywords || keywords.length === 0"
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <ul>
      <li v-for="keyword in keywords" :key="keyword.id">{{keyword}}</li>
    </ul>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'receipts',
  computed: {
    ...mapState(['keywords']),
  },
};
</script>

<style scoped>

</style>
