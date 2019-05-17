<template>
  <div>
    <v-select
      :value="value[0]"
      @input="$emit('input', [$event, value[1]])"
      :items="['<', '<=', '==', '>=', '>']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-text-field
      ref="numberField"
      :value="value[1]"
      @input="$refs.numberField.validate() && $emit('input', [value[0], Number($event)])"
      :rules="[required, number]"
    ></v-text-field>
  </div>
</template>
<script>
import { required, number } from '@/util/form-rules';

export default {
  props: ['value'],
  data() {
    return { required, number };
  },
};
</script>
