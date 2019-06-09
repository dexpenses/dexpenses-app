<template>
  <v-text-field
    ref="vTextField"
    v-bind="$attrs"
    v-on="$listeners"
  ></v-text-field>
</template>
<script>
import { gmapApi } from 'vue2-google-maps';

export default {
  data() {
    return {
      autocomplete: null,
    };
  },
  computed: {
    google: gmapApi,
  },
  mounted() {
    if (this.google && !this.autocomplete) {
      this.init();
    }
  },
  watch: {
    google() {
      if (!this.autocomplete) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      this.autocomplete = new this.google.maps.places.Autocomplete(
        this.$refs.vTextField.$refs.input,
        { types: ['geocode'] }
      );
      this.autocomplete.setComponentRestrictions({
        country: ['de'],
      });
      this.autocomplete.setFields(['formatted_address', 'geometry']);
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        this.$emit('place_changed', place);
      });
    },
  },
};
</script>
