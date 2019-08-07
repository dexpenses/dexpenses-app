<template>
  <v-autocomplete
    v-bind="$attrs"
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
</template>
<script>
import { placeTypeMappings } from '@dexpenses/core';
import { prettifySnakeCase } from '@/util/string';
import { alphabeticallyBy } from '@/util/sort';

export default {
  props: ['value'],
  data() {
    return {
      placeTypeCategories: [...new Set(Object.values(placeTypeMappings))]
        .filter(c => !!c)
        .map(placeTypeCategory => ({
          value: placeTypeCategory,
          name: prettifySnakeCase(placeTypeCategory),
        }))
        .sort(alphabeticallyBy('name')),
    };
  },
};
</script>
