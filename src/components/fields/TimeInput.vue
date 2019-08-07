<template>
  <!-- <input
    type="text"
    v-mask="'##:##:##'"
    :value="value"
    @input="$emit('input', $event.target.value)"
  > -->
  <v-text-field
    :value="formattedValue"
    @input="emit"
    label="Time"
    :prepend-icon="icon"
    v-mask="'##:##:##'"
    :rules="[time]"
  ></v-text-field>
</template>
<script>
import { mask } from 'vue-the-mask';
import { fields } from '@/util/receipt';
import { time } from '@/util/form-rules';

export default {
  name: 'TimeInput',
  props: ['value'],
  directives: { mask },
  data() {
    return {
      time,
      icon: fields.time.icon,
      modelValue: null,
    };
  },
  computed: {
    formattedValue() {
      return this.format(this.value);
    },
  },
  methods: {
    emit(value) {
      if (!this.validate(value)) {
        return;
      }

      this.$emit('input', this.parse(value));
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
