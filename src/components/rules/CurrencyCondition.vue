<template>
  <div>
    <span>is</span>
    <CurrencyInput
      v-model="value$"
      @input="$emit('input', value$)"
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
  data() {
    return {
      value$: this.value,
    };
  },
  watch: {
    value(v) {
      this.value$ = v;
    },
  },
};
</script>
