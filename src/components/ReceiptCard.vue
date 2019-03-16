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
      <v-progress-circular indeterminate />
    </span>
    <span v-else-if="receipt.result.state === 'unreadable'">unreadable</span>
    <div
      class="receipt-info"
      v-else
    >
      <ReceiptHeader
        :receipt-id="receipt.id"
        :header="receipt.result.data.header"
      />

      <div class="fields">
        <ReceiptField
          icon="location_on"
          :receipt="receipt"
          field="address"
          filter="address"
          :formatter="v => !v ? '' : v.street + ', ' + v.city"
          :parser="v => ({street:v.split(',')[0].trim(),city:v.split(',')[1].trim()})"
        >
          <template
            slot="editor"
            slot-scope="props"
          >
            <v-text-field v-model="props.value.changedValue" />
          </template>
        </ReceiptField>
        <ReceiptField
          icon="phone"
          :receipt="receipt"
          field="phone"
        />

        <ReceiptField
          icon="date_range"
          :receipt="receipt"
          field="date"
          filter="date"
          mask="##/##/####"
          formatter="date"
          :parser="parseDate"
        />
        <ReceiptField
          icon="access_time"
          :receipt="receipt"
          field="time"
          filter="time"
          mask="time-with-seconds"
          formatter="time"
          :parser="parseTime"
        />

        <ReceiptField
          :receipt="receipt"
          field="paymentMethod"
          :icon="receipt.result.data.paymentMethod === 'CASH' ? 'money' : 'credit_card'"
          :rules="[v => paymentMethods.includes((v || '').trim().toUpperCase()) || 'Invalid method.']"
          :parser="v => v.trim().toUpperCase()"
        >{{receipt.result.data.paymentMethod}}</ReceiptField>

        <ReceiptField
          required
          icon="attach_money"
          :receipt="receipt"
          field="amount"
          filter="currency"
          type="number"
          :formatter="a => (a || {}).value"
          :parser="value => ({value: parseFloat(value), currency: 'EUR'})"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DateTime } from 'luxon';
import ReceiptField from './ReceiptField.vue';
import ReceiptHeader from './ReceiptHeader.vue';

export default {
  name: 'ReceiptCard',
  components: {
    ReceiptField,
    ReceiptHeader,
  },
  props: {
    receipt: Object,
  },
  data() {
    return {
      paymentMethods: ['CASH', 'CREDIT', 'DEBIT'],
      headerModal: false,
    };
  },
  methods: {
    parseTime(s) {
      const [hour, minute, second] = s
        .split(':')
        .map(v => (v ? parseInt(v, 10) : null));
      return { hour, minute, second };
    },
    parseDate(s) {
      return DateTime.fromFormat(s, 'MM/dd/yyyy', {
        zone: 'Europe/Berlin',
      }).toJSDate();
    },
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
.receipt-info .fields {
  display: flex;
  flex-direction: column;
}
.receipt-info .fields > * {
  display: flex;
  align-items: center;
  margin-top: 0.3em;
}
.header-input {
  margin: 0;
  padding: 0;
}
</style>
