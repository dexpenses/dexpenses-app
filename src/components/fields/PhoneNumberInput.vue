<template>
  <v-text-field
    ref="input"
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    @input="$emit('input', $event)"
    :rules="[(v) => validatePhoneNumber(v) || $t('fields.phoneNumber.invalidMessage')]"
    :hint="countryPrefixHint && !hasCountryPrefix ? $t('fields.phoneNumber.countryCallingCodeHint') : null"
  >
    <template v-slot:append>
      <slot
        name="append"
        v-bind:valid="$refs.input && $refs.input.valid"
      />
    </template>
  </v-text-field>
</template>
<script>
export default {
  props: {
    value: String,
    countryPrefixHint: Boolean,
  },
  computed: {
    hasCountryPrefix() {
      return !!(this.value && this.value.match(/^(\+|00)\d\d?/));
    },
  },
  methods: {
    validatePhoneNumber(v) {
      return !v || !!v.match(/^(00\d\d?|\+\d\d?|0)[\d\-()/\s]{5,}$/);
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>
