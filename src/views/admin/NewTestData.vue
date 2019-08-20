<template>
  <v-container>
    <v-progress-circular
      indeterminate
      v-if="!pending"
    />
    <v-row v-else>
      <span v-if="pending.length === 0">Nothing here.</span>
      <v-col
        v-for="p in pending"
        :key="p.ref.name"
        lg="3"
        md="4"
        sm="6"
        cols="12"
        @click="$router.push({name:'adminTestDataEdit',params:{path:p.ref.fullPath}})"
      >
        <v-img
          v-if="p.downloadUrl"
          max-height="200px"
          contain
          :src="p.downloadUrl"
          aspect-ratio="1"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { storage, getUrl } from './util';

export default {
  data() {
    return {
      pending: null,
    };
  },
  computed: {
    ...mapState('user', ['user']),
  },
  async created() {
    const { items } = await storage.ref().listAll();
    this.pending = items
      .filter(i => i.name.startsWith(this.user.uid))
      .map(ref => ({ ref, downloadUrl: getUrl(ref.fullPath) }));
  },
};
</script>

<style>
</style>
