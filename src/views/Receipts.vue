<template>
  <v-container>
    <FileUpload/>
    <v-progress-circular v-if="!receipts"
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-else-if="receipts.length === 0">
      No receipts
    </div>
    <div>
      <div class="receipt" v-for="receipt in receipts" :key="receipt.id">
        <v-img class="grey" :src="receipt.downloadUrl" alt="No img for you"
        height="200" width="200" max-width="200">
          <!-- <v-layout
                    slot="placeholder"
                    fill-height
                    align-center
                    justify-center
                    ma-0
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-layout> -->
        </v-img>
        <span v-if="!receipt.result || receipt.result.state === 'pending'">
          Pending
          <v-progress-circular indeterminate/>
        </span>
        <span v-else-if="receipt.result.state === 'unreadable'">
          unreadable
        </span>
        <div class="receipt-info" v-else>
          <div class="header">
            {{receipt.result.data.header.join(', ')}}
          </div>
          <div class="fields">
            <div>
              <v-icon>location_on</v-icon>
              <span>
                {{receipt.result.data.address.street}}, {{receipt.result.data.address.city}}
              </span>
            </div>
            <div>
              <v-icon>attach_money</v-icon>
              <span>
                {{receipt.result.data.amount | currency }}
              </span>
            </div>
            <div>
              <v-icon v-if="receipt.result.data.paymentMethod === 'CASH'">money</v-icon>
              <v-icon v-else>credit_card</v-icon>
              <span>
                {{receipt.result.data.paymentMethod}}
              </span>
            </div>
            <div>
              <v-icon>av_timer</v-icon>
              <span>
                {{receipt.result.data.date | humanReadableTime }}
                {{receipt.result.data.time}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import FileUpload from '@/components/FileUpload.vue';

export default {
  name: 'receipts',
  components: {
    FileUpload,
  },
  computed: {
    ...mapState(['receipts']),
  },
  watch: {
    receipts: console.log,
  },
};
</script>

<style scoped>
.receipt {
  display: flex;
}
.receipt-info {
  padding: 1em;
}
.receipt-info .header {
  font-weight: bold;
  font-size: 1.1em;
}
.receipt-info .fields {
  display: flex;
  flex-direction: column;
}
.receipt-info .fields > * {
  display: flex;
  align-items: center;
}
.receipt-info .fields > * > .v-icon {
  margin-right: .2em;
}
</style>
