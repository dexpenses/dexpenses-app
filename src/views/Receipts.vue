<template>
  <v-container>
    <template v-if="loading.openReceipts || openReceipts.length > 0">
      <v-subheader>
        We're gonna need your help with these...
      </v-subheader>
      <v-container v-if="!loading.openReceipts">
        <ReceiptCard
          v-for="receipt in openReceipts"
          :key="receipt.id"
          :receipt="receipt"
        />
      </v-container>
      <v-container v-else>
        <v-progress-circular indeterminate />
      </v-container>
    </template>
    <v-subheader>
      Your Receipts
    </v-subheader>
    <v-container>
      <v-progress-circular
        indeterminate
        v-if="loading.receipts"
      />
      <div v-else-if="receipts.length === 0">No receipts</div>
      <div v-else>
        <ReceiptCard
          v-for="receipt in receipts"
          :key="receipt.id"
          :receipt="receipt"
        />
      </div>
    </v-container>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ReceiptCard from '@/components/ReceiptCard.vue';

const { mapActions, mapState } = createNamespacedHelpers('receipts');

export default {
  name: 'receipts',
  components: {
    ReceiptCard,
  },
  data() {
    return {
      first: true,
    };
  },
  computed: {
    ...mapState(['openReceipts', 'receipts', 'loading']),
  },
  methods: {
    ...mapActions(['loadReceipts', 'loadOpenReceipts', 'unbindReceipts']),
  },
  mounted() {
    this.loadOpenReceipts();
    this.loadReceipts();
  },
  destroyed() {
    this.unbindReceipts();
  },
};
</script>
