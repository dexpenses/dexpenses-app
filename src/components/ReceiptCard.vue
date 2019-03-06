<template>
  <div class="receipt">
    <v-img
      class="grey"
      :src="receipt.downloadUrl"
      alt="No img for you"
      height="200"
      width="200"
      max-width="200"
    ></v-img>
    <span v-if="!receipt.result || receipt.result.state === 'pending'">Pending
      <v-progress-circular indeterminate/>
    </span>
    <span v-else-if="receipt.result.state === 'unreadable'">unreadable</span>
    <div class="receipt-info" v-else>
      <div class="header">{{receipt.result.data.header.join(', ')}}</div>
      <div class="fields">
        <ReceiptField icon="location_on" :receipt="receipt" field="address">
          <template slot-scope="{value}">{{value.street}}, {{value.city}}</template>
        </ReceiptField>
        <ReceiptField icon="phone" :receipt="receipt" field="phone"/>

        <ReceiptField icon="date_range" :receipt="receipt" field="date" filter="date"/>
        <ReceiptField icon="access_time" :receipt="receipt" field="time" filter="time"/>

        <ReceiptField
          :receipt="receipt"
          field="paymentMethod"
          :icon="receipt.result.data.paymentMethod === 'CASH' ? 'money' : 'credit_card'"
        >{{receipt.result.data.paymentMethod}}</ReceiptField>

        <ReceiptField
          required
          icon="attach_money"
          :receipt="receipt"
          field="amount"
          filter="currency"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ReceiptField from './ReceiptField.vue';

export default {
  name: 'ReceiptCard',
  components: {
    ReceiptField,
  },
  props: {
    receipt: Object,
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
  margin-top: .3em;
}
</style>
