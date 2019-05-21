<template>
  <div>
    <span>is</span>
    <v-autocomplete
      :value="value"
      @input="$emit('input', $event)"
      :items="placeTypeCategories"
      item-text="name"
      item-value="value"
      menu-props="auto"
      label="Place Type Category"
      hide-details
      single-line
    ></v-autocomplete>
  </div>
</template>
<script>
import { placeTypeMappings } from '@dexpenses/core';
import { prettifySnakeCase } from '@/util/string';

export default {
  props: ['value'],
  data() {
    return {
      placeTypeCategories: [...new Set(Object.values(placeTypeMappings))]
        .filter(c => !!c)
        .map(placeTypeCategory => ({
          value: placeTypeCategory,
          name: prettifySnakeCase(placeTypeCategory),
        })),
    };
  },
};
</script>
