<template>
  <div>
    <span>is</span>
    <PaymentMethodInput
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>
<script>
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';

export default {
  props: ['value'],
  components: {
    PaymentMethodInput,
  },
};
</script>
