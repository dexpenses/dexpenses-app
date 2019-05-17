<template>
  <div>
    <v-select
      :value="dateField"
      @input="$emit('input', update(0, $event))"
      :items="dateFields"
      item-text="displayName"
      item-value="name"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-select
      :value="value[1]"
      @input="$emit('input', update(1, $event))"
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
      :value="value[2]"
      @input="$emit('input', update(2, $event))"
    ></v-select>
    <v-text-field
      v-else
      type="number"
      :value="value[2]"
      @input="$emit('input', update(2, Number($event)))"
    ></v-text-field>
  </div>
</template>
<script>
import { weekdays, dateFields } from '@/util/receipt';

export default {
  props: ['value'],
  data() {
    return {
      weekdays: weekdays.map((name, index) => ({ name, value: index + 1 })),
      dateFields,
    };
  },
  computed: {
    dateField() {
      return this.value[0];
    },
  },
  methods: {
    update(i, v) {
      const newValue = [...this.value];
      newValue[i] = v;
      return newValue;
    },
  },
};
</script>
