<template>
  <v-text-field
    v-model="value$"
    ref="input"
    @input="emit"
    label="Time"
    :prepend-icon="icon"
    mask="##:##:##"
    :rules="[v => this.validate(v) || 'Invalid time.']"
    :return-masked-value="true"
  ></v-text-field>
</template>
<script>
import { fields } from '@/util/receipt';

export default {
  name: 'TimeInput',
  props: ['value'],
  data() {
    return {
      value$: this.format(this.value),
      icon: fields.time.icon,
    };
  },
  watch: {
    value(v) {
      this.value$ = this.format(v);
    },
  },
  methods: {
    emit() {
      if (!this.$refs.input.validate()) {
        return;
      }

      this.$emit('input', this.parse(this.value$));
    },
    validate(s) {
      if (!s) {
        return true;
      }
      return !!s.match(/^([01]\d|2[0-4]):([0-5]\d):?(([0-5]\d))?$/);
    },
    format(d) {
      return this.$options.filters.time(d);
    },
    parse(s) {
      if (!s) {
        return null;
      }
      const [hour, minute, second] = s
        .split(':')
        .map(v => (v ? parseInt(v, 10) : null));
      return { hour, minute, second };
    },
  },
};
</script>
