<template>
  <div>
    <v-select
      :value="value[0]"
      @input="$emit('input', [$event, value[1]])"
      :items="['before', 'after']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-text-field
      ref="timeField"
      :value="value[1]"
      @input="$refs.timeField && $refs.timeField.validate() && $emit('input', [value[0], $event])"
      mask="##:##:##"
      :rules="[time]"
      :return-masked-value="true"
    ></v-text-field>
  </div>
</template>
<script>
import { time } from '@/util/form-rules';

export default {
  props: ['value'],
  data() {
    return { time };
  },
};
</script>
