<template>
  <v-container>
    <v-progress-circular v-if="!receipts || receipts.length === 0"
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div>
      <div v-for="receipt in receipts" :key="receipt.id">
        <img :src="receipt.downloadUrl" alt="No img for you" height="200" />
        <span v-if="!receipt.result || receipt.result.state === 'pending'">
          Pending
          <v-progress-circular indeterminate/>
        </span>
        <span v-else-if="receipt.result.state === 'unreadable'">
          unreadable
        </span>
        <div v-else>
          <div>
            {{receipt.result.data.header
            .filter(h => h !== receipt.result.data.address.street
            && h !== receipt.result.data.address.city)
            .join(', ')}}
          </div>
          <div>
            <v-icon>location_on</v-icon>
            {{receipt.result.data.address.street}}, {{receipt.result.data.address.city}}
          </div>
          <div>
            <v-icon>attach_money</v-icon>
            {{receipt.result.data.amount | currency }}
          </div>
          <div>
            <v-icon v-if="receipt.result.data.paymentMethod === 'CASH'">money</v-icon>
            <v-icon v-else>credit_card</v-icon>
            {{receipt.result.data.paymentMethod}}
          </div>
          <div>
            <v-icon>av_timer</v-icon>
            {{receipt.result.data.date | humanReadableTime }}
            {{receipt.result.data.time}}
          </div>
          {{receipt.result}}
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'receipts',
  computed: {
    ...mapState(['receipts']),
  },
};
</script>

<style scoped>

</style>
