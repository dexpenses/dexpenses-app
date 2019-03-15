<template>
  <v-container>
    <v-progress-circular
      v-if="!receipts"
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    />
    <div v-else-if="receipts.length === 0">No receipts</div>
    <div>
      <ReceiptCard
        v-for="receipt in receipts"
        :key="receipt.id"
        :receipt="receipt"
      />
    </div>
    <Observer @intersect="intersected" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ReceiptCard from '@/components/ReceiptCard.vue';
import Observer from '@/components/Observer.vue';

export default {
  name: 'receipts',
  components: {
    ReceiptCard,
    Observer,
  },
  computed: {
    ...mapState('receipts', ['receipts']),
  },
  methods: {
    intersected() {
      console.log('Got it! We intersected!');
    },
  },
};
</script>
