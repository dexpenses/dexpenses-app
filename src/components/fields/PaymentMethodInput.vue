<template>
  <v-select
    class="payment-method-input"
    :value="value"
    v-bind="$attrs"
    @input="$emit('input', $event)"
    :items="paymentMethods"
    menu-props="auto"
    label="Payment method"
    :prepend-icon="icons[value]"
    hide-details
    single-line
  >
    <template v-slot:item="{item}">
      {{$t('paymentMethods.'+item)}}
    </template>
    <template v-slot:selection="{item}">
      {{$t('paymentMethods.'+item)}}
    </template>
  </v-select>
</template>
<script>
import { paymentMethods } from '@dexpenses/core';
import { paymentMethodIcons } from '@/util/receipt';

export default {
  name: 'PaymentMethodInput',
  props: ['value'],
  data() {
    return {
      paymentMethods,
      icons: paymentMethodIcons,
    };
  },
};
</script>
<style>
.payment-method-input .v-input__slot {
  max-width: 10em;
}
</style>
