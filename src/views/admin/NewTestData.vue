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
import { storage, testImageUploadBucket } from './util';

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
    const { items } = await storage(testImageUploadBucket)
      .ref(this.user.uid)
      .listAll();

    this.pending = await Promise.all(
      items.map(async ref => ({
        ref,
        downloadUrl: await storage(testImageUploadBucket)
          .ref(ref.fullPath)
          .getDownloadURL(),
      }))
    );
  },
};
</script>

<style>
</style>
