<template>
  <div>
    <v-select
      v-model="op"
      :items="['<', '<=', '==', '>=', '>']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-text-field :value="n"></v-text-field>
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
    json() {
      return {
        amount: [this.op, this.n],
      };
    },
  },
};
</script>
