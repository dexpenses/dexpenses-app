<template>
  <div>
    <v-select
      v-model="dateField"
      @input="$emit('input', params)"
      :items="dateFields"
      item-text="displayName"
      item-value="name"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-select
      v-model="op"
      @input="$emit('input', params)"
      :items="['<', '<=', '==', '>=', '>']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-select
      v-if="dateField === 'weekday'"
      :items="weekdays"
      item-text="name"
      item-value="value"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
      v-model="n"
      @input="$emit('input', params)"
    ></v-select>
    <v-text-field
      v-else
      v-model="n"
      @input="$emit('input', params)"
    ></v-text-field>
  </div>
</template>
<script>
import { weekdays, dateFields } from '@/util/receipt';

export default {
  props: ['value'],
  data() {
    const [dateField, op, n] = this.value || [];
    return {
      dateField,
      op,
      n,
      weekdays: weekdays.map((name, index) => ({ name, value: index + 1 })),
      dateFields,
    };
  },
  computed: {
    params() {
      return [this.dateField, this.op, this.n];
    },
  },
  watch: {
    value(v) {
      const [dateField, op, n] = v || [];
      this.dateField = dateField;
      this.op = op;
      this.n = n;
    },
  },
};
</script>
