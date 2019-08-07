<template>
  <v-autocomplete
    v-bind="$attrs"
    :value="value"
    @input="$emit('input', $event)"
    :items="placeTypes"
    item-text="name"
    item-value="value"
    menu-props="auto"
    label="Place type"
    hide-details
    single-line
    :prepend-icon="this.prependIcon ? 'place' : null"
  ></v-autocomplete>
</template>
<script>
import { placeTypeMappings } from '@dexpenses/core';
import { prettifySnakeCase } from '@/util/string';
import { alphabeticallyBy } from '@/util/sort';

export default {
  props: { value: String, prependIcon: Boolean },
  data() {
    return {
      placeTypes: Object.keys(placeTypeMappings)
        .map(placeType => ({
          value: placeType,
          name: prettifySnakeCase(placeType),
        }))
        .sort(alphabeticallyBy('name')),
    };
  },
};
</script>
