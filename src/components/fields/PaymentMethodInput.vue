<template>
  <v-select
    class="payment-method-input"
    :value="value"
    @input="$emit('input', $event)"
    :items="paymentMethods"
    item-text="displayName"
    item-value="name"
    menu-props="auto"
    label="Payment method"
    :prepend-icon="icons[value]"
    hide-details
    single-line
  ></v-select>
</template>
<script>
import { paymentMethods } from '@/util/receipt';

export default {
  name: 'PaymentMethodInput',
  props: ['value'],
  data() {
    return {
      paymentMethods,
      icons: paymentMethods.reduce((acc, cur) => {
        acc[cur.name] = cur.icon;
        return acc;
      }, {}),
    };
  },
};
</script>
<style>
.payment-method-input .v-input__slot {
  max-width: 10em;
}
</style>
