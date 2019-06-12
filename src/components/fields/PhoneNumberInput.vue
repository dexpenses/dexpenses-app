<template>
  <v-text-field
    ref="input"
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    @input="model = $event; $emit('input', $event)"
    :rules="[(v) => validatePhoneNumber(v) || 'Invalid phone number.']"
    :hint="showCountryPrefixHint ? 'It is recommended to add a country prefix, e.g. +49.' : null"
  ></v-text-field>
</template>
<script>
export default {
  props: {
    value: String,
    countryPrefixHint: Boolean,
  },
  data() {
    return {
      model: null,
    };
  },
  computed: {
    valid() {
      return this.$refs.input.valid;
    },
    showCountryPrefixHint() {
      if (!this.countryPrefixHint) {
        return false;
      }
      if (!this.model) {
        return !this.hasCountryPrefix(this.value);
      }
      return !this.hasCountryPrefix(this.model);
    },
  },
  methods: {
    validatePhoneNumber(v) {
      return !v || !!v.match(/[\d\-()/\s]{5,}/);
    },
    hasCountryPrefix(v) {
      return v && v.match(/^(\+|00)\d\d/);
    },
  },
};
</script>
