<template>
  <div>
    <span>is</span>
    <PlaceTypeInput
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>
<script>
import PlaceTypeInput from '@/components/fields/PlaceTypeInput.vue';

export default {
  props: ['value'],
  components: {
    PlaceTypeInput,
  },
};
</script>
