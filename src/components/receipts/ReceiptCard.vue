<template>
  <div class="receipt">
    <ReceiptImage
      v-if="!hideImage"
      :src="receipt.downloadUrl"
    />
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
            <v-text-field
              class="receipt-field-text-field"
              height="1em"
              v-model="props.value.changedValue"
            />
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
    <div>
      <!-- <v-chip>
        <v-icon left>fastfood</v-icon>
        Food
      </v-chip>
      <v-chip>Weekly</v-chip>
      <v-chip>Supermarket</v-chip> -->
      <v-chip
        v-for="tag in receipt.tags"
        :key="tag"
      >{{tag}}</v-chip>
    </div>
  </div>
</template>
<script>
import { DateTime } from 'luxon';
import { Time } from '@dexpenses/core';
import ReceiptField from './ReceiptField.vue';
import ReceiptImage from './ReceiptImage.vue';
import ReceiptHeader from './ReceiptHeader.vue';

export default {
  name: 'ReceiptCard',
  components: {
    ReceiptField,
    ReceiptHeader,
    ReceiptImage,
  },
  props: {
    receipt: Object,
    hideImage: Boolean,
  },
  data() {
    return {
      paymentMethods: ['CASH', 'CREDIT', 'DEBIT'],
      headerModal: false,
    };
  },
  methods: {
    parseTime(s) {
      return Time.parse(s);
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
  width: 100%;
  justify-content: space-between;
}
.receipt-info {
  padding: 1em;
  flex-grow: 1;
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
