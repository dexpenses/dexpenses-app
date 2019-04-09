<template>
  <div>
    <span>is</span>
    <v-select
      v-model="value$"
      @input="$emit('input', value$)"
      :items="['EUR', 'USD']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
  </div>
</template>
<script>
export default {
  props: ['value'],
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
