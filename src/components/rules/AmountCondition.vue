<template>
  <div>
    <v-select
      v-model="op"
      @input="$emit('input', params)"
      :items="['<', '<=', '==', '>=', '>']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-text-field
      v-model="n"
      @input="$emit('input', params)"
    ></v-text-field>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data() {
    const [op, n] = this.value || [];
    return { op, n };
  },
  computed: {
    params() {
      return [this.op, this.n];
    },
  },
};
</script>
