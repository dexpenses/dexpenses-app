<template>
  <v-select
    :value="value"
    @input="$emit('input', $event)"
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
  name: 'CurrencyInput',
  props: ['value'],
  data() {
    return {
      currencies,
    };
  },
};
</script>
