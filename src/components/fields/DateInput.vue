<template>
  <v-text-field
    :value="formattedValue"
    ref="input"
    @input="emit"
    :label="label"
    :prepend-icon="icon"
    v-mask="'##/##/####'"
    :rules="[v => this.validateDate(v) || 'Invalid date.']"
  ></v-text-field>
</template>
<script>
import { DateTime } from 'luxon';
import { mask } from 'vue-the-mask';
import { fields } from '@/util/receipt';

export default {
  name: 'DateInput',
  directives: { mask },
  props: {
    value: Date,
    label: {
      type: String,
      default: 'Date',
    },
  },
  data() {
    return {
      icon: fields.date.icon,
    };
  },
  computed: {
    formattedValue() {
      return this.formatDate(this.value);
    },
  },
  methods: {
    emit(value) {
      if (!this.$refs.input.validate()) {
        return;
      }
      this.$emit('input', this.parseDate(value));
    },
    validateDate(s) {
      if (!s) {
        return true;
      }
      try {
        return !DateTime.fromFormat(s, 'MM/dd/yyyy', {
          zone: 'Europe/Berlin',
        }).invalid;
      } catch {
        return false;
      }
    },
    formatDate(d) {
      return this.$options.filters.date(d);
    },
    parseDate(s) {
      if (!s) {
        return null;
      }
      return DateTime.fromFormat(s, 'MM/dd/yyyy', {
        zone: 'Europe/Berlin',
      }).toJSDate();
    },
  },
};
</script>
