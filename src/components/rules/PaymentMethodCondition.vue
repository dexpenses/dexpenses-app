<template>
  <div>
    <span>is</span>
    <v-select
      v-model="value$"
      @input="$emit('input', value$)"
      :items="paymentMethods"
      item-text="displayName"
      item-value="name"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
  </div>
</template>
<script>
import { paymentMethods } from '@/util/receipt';

export default {
  props: ['value'],
  data() {
    return {
      value$: this.value,
      paymentMethods,
    };
  },
  watch: {
    value(v) {
      this.value$ = v;
    },
  },
};
</script>
