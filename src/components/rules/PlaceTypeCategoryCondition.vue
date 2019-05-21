<template>
  <div>
    <span>is</span>
    <PlaceTypeCategoryInput
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>
<script>
import PlaceTypeCategoryInput from '@/components/fields/PlaceTypeCategoryInput.vue';

export default {
  props: ['value'],
  components: {
    PlaceTypeCategoryInput,
  },
};
</script>
