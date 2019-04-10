<template>
  <div>
    <span>is</span>
    <PaymentMethodInput
      v-model="value$"
      @input="$emit('input', value$)"
    />
  </div>
</template>
<script>
import { paymentMethods } from '@/util/receipt';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';

export default {
  props: ['value'],
  components: {
    PaymentMethodInput,
  },
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
