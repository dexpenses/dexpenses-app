<template>
  <v-select
    v-model="value$"
    @input="$emit('input', value$)"
    :items="paymentMethods"
    item-text="displayName"
    item-value="name"
    menu-props="auto"
    label="Payment method"
    :prepend-icon="icons[value$]"
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
      value$: this.value,
      paymentMethods,
      icons: paymentMethods.reduce((acc, cur) => {
        acc[cur.name] = cur.icon;
        return acc;
      }, {}),
    };
  },
  watch: {
    value(v) {
      this.value$ = v;
    },
  },
};
</script>
