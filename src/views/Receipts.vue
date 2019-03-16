<template>
  <v-container>
    <ReceiptCard
      v-for="receipt in openReceipts"
      :key="receipt.id"
      :receipt="receipt"
    />
    <p>
      ===============================
    </p>
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
    <v-progress-circular
      indeterminate
      v-if="loading"
    />
    <p v-if="endReached">End reached</p>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ReceiptCard from '@/components/ReceiptCard.vue';
import Observer from '@/components/Observer.vue';

const { mapActions, mapState } = createNamespacedHelpers('receipts');

export default {
  name: 'receipts',
  components: {
    ReceiptCard,
    Observer,
  },
  data() {
    return {
      first: true,
    };
  },
  computed: {
    ...mapState(['openReceipts', 'receipts', 'loading', 'endReached']),
  },
  methods: {
    ...mapActions(['loadReceipts', 'loadOpenReceipts']),
    intersected() {
      if (this.first) {
        this.first = false;
        return;
      }
      this.loadReceipts();
    },
  },
};
</script>
