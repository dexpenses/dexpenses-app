<template>
  <div>
    <span>is</span>
    <v-autocomplete
      :value="value"
      @input="$emit('input', $event)"
      :items="placeTypes"
      item-text="name"
      item-value="value"
      menu-props="auto"
      label="Place type"
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
      placeTypes: Object.keys(placeTypeMappings).map(placeType => ({
        value: placeType,
        name: prettifySnakeCase(placeType),
      })),
    };
  },
};
</script>
