<template>
  <v-container>
    <FileUpload :upload="uploadReceipt" />
  </v-container>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import FileUpload from '@/components/upload/FileUpload.vue';

export default {
  name: 'uploadReceipts',
  components: {
    FileUpload,
  },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    uploadReceipt(file) {
      return firebase
        .storage()
        .ref(`images/${this.user.uid}/${Date.now()}-${file.name}`)
        .put(file, {
          contentType: file.type,
        });
    },
  },
};
</script>
