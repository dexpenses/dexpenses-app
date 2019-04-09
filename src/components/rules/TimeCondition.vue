<template>
  <div>
    <v-select
      v-model="type"
      @input="$emit('input', params)"
      :items="['before', 'after']"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>
    <v-text-field
      v-model="time"
      @input="$emit('input', params)"
    ></v-text-field>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data() {
    const [type, time] = this.value || [];
    return { type, time };
  },
  computed: {
    params() {
      const [hour, minute, second] = this.time.split(':');
      return [
        this.type,
        {
          hour: parseInt(hour, 10),
          minute: parseInt(minute, 10),
          second: second ? parseInt(second, 10) : null,
        },
      ];
    },
  },
  watch: {
    value(v) {
      const [type, time] = v || [];
      this.type = type;
      this.time = time;
    },
  },
};
</script>
