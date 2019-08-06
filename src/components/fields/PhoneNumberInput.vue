<template>
  <v-text-field
    ref="input"
    v-bind="$attrs"
    v-on="$listeners"
    :value="model"
    @input="model = $event; $emit('input', $event)"
    :rules="[(v) => validatePhoneNumber(v) || 'Invalid phone number.']"
    :hint="showCountryPrefixHint ? 'It is recommended to add a country prefix, e.g. +49.' : null"
  >
    <template v-slot:append>
      <v-icon
        v-if="hasChanges()"
        @click="model = value"
      >clear</v-icon>
      <v-icon
        v-if="hasChanges() && valid"
        @click="$emit('save', model)"
      >save</v-icon>
    </template>
  </v-text-field>
</template>
<script>
export default {
  props: {
    value: String,
    countryPrefixHint: Boolean,
  },
  data() {
    return {
      model: this.value || null,
    };
  },
  computed: {
    valid() {
      try {
        return this.$refs.input.valid;
      } catch {
        return false;
      }
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
    hasChanges() {
      if (this.model === null) {
        return false;
      }
      if (!this.value && !this.model) {
        return false;
      }
      return this.value !== this.model;
    },
    focus() {
      this.$refs.input.focus();
    },
  },
  watch: {
    value(v) {
      this.model = v || null;
    },
  },
};
</script>
