<template>
  <div>
    <span>includes</span>
    <v-text-field
      v-model="searchString"
      @input="$emit('input', params)"
    ></v-text-field>
    <v-checkbox
      v-model="caseSensitive"
      @change="$emit('input', params)"
      label="Case Sensitive"
    ></v-checkbox>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data() {
    const [searchString, caseSensitive] = this.value || [];
    return { searchString, caseSensitive };
  },
  computed: {
    params() {
      return [this.searchString, this.caseSensitive];
    },
  },
  watch: {
    value(v) {
      const [searchString, caseSensitive] = v || [];
      this.searchString = searchString;
      this.caseSensitive = caseSensitive;
    },
  },
};
</script>
