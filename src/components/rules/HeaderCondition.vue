<template>
  <div>
    <span>includes</span>
    <v-text-field v-model="searchString"></v-text-field>
    <v-checkbox
      v-model="caseSensitive"
      label="Case Sensitive"
    ></v-checkbox>
  </div>
</template>
<script>
export default {
  props: ['value'],
  computed: {
    searchString: {
      get() {
        return this.value && this.value[0];
      },
      set(v) {
        this.$emit('input', [v, this.caseSensitive]);
      },
    },
    caseSensitive: {
      get() {
        return this.value && !!this.value[1];
      },
      set(v) {
        this.$emit('input', [this.searchString, !!v]);
      },
    },
  },
};
</script>
