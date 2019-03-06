<template>
  <v-container>
    <v-progress-circular v-if="!receipts" :size="70" :width="7" color="primary" indeterminate/>
    <div v-else-if="receipts.length === 0">No receipts</div>
    <div>
      <ReceiptCard v-for="receipt in receipts" :key="receipt.id" :receipt="receipt"/>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ReceiptCard from '@/components/ReceiptCard.vue';

export default {
  name: 'receipts',
  components: {
    ReceiptCard,
  },
  computed: {
    ...mapState(['receipts']),
  },
  watch: {
    receipts: console.log,
  },
};
</script>
