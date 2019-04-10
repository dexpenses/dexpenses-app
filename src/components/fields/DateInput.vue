<template>
  <v-text-field
    v-model="value$"
    ref="input"
    @input="emit"
    label="Date"
    :prepend-icon="icon"
    mask="##/##/####"
    :rules="[v => this.validateDate(v) || 'Invalid date.']"
    :return-masked-value="true"
  ></v-text-field>
</template>
<script>
import { fields } from '@/util/receipt';
import { DateTime } from 'luxon';

export default {
  name: 'DateInput',
  props: ['value'],
  data() {
    return {
      value$: this.formatDate(this.value),
      icon: fields.date.icon,
    };
  },
  watch: {
    value(v) {
      this.value$ = this.formatDate(v);
    },
  },
  methods: {
    emit() {
      if (!this.$refs.input.validate()) {
        return;
      }
      this.$emit('input', this.parseDate(this.value$));
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
