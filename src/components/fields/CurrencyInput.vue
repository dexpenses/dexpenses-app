<template>
  <v-select
    v-model="value$"
    @input="$emit('input', value$)"
    :items="currencies"
    menu-props="auto"
    label="Currency"
    hide-details
    single-line
  ></v-select>
</template>
<script>
import { currencies } from '@/util/receipt';

export default {
  name: 'PaymentMethodInput',
  props: ['value'],
  data() {
    return {
      value$: this.value,
      currencies,
    };
  },
  watch: {
    value(v) {
      this.value$ = v;
    },
  },
};
</script>
