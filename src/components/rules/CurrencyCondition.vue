<template>
  <div>
    <span>is</span>
    <CurrencyInput
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>
<script>
import CurrencyInput from '@/components/fields/CurrencyInput.vue';

export default {
  props: ['value'],
  components: {
    CurrencyInput,
  },
};
</script>
