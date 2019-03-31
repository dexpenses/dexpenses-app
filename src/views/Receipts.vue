<template>
  <v-container>
    <v-subheader>
      We're gonna need your help with these...
    </v-subheader>
    <v-container>
      <ReceiptCard
        v-for="receipt in openReceipts"
        :key="receipt.id"
        :receipt="receipt"
      />
    </v-container>
    <v-subheader>
      Your Receipts
    </v-subheader>
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
    ...mapState(['openReceipts', 'receipts']),
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
