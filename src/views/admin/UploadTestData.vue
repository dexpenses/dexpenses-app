<template>
  <v-container>
    <FileUpload :upload="uploadImage">
      <template
        slot="upload-tasks"
        slot-scope="{uploadTasks}"
      >
        <FileUploadTask
          v-for="(uploadTask, index) in uploadTasks"
          :key="index"
          :task="uploadTask"
          @click:img="selectImage"
        />
      </template>
    </FileUpload>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import FileUpload from '@/components/upload/FileUpload.vue';
import FileUploadTask from '@/components/upload/FileUploadTask.vue';
import { storage } from './util';

export default {
  components: { FileUpload, FileUploadTask },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    uploadImage(file) {
      return storage
        .ref(`${this.user.uid}-${Date.now()}-${file.name}`)
        .put(file, {
          contentType: file.type,
        });
    },
    selectImage({ $event, ref }) {
      $event.preventDefault();
      this.$router.push({
        name: 'adminTestDataEdit',
        params: { path: ref.fullPath },
      });
    },
  },
};
</script>

<style>
</style>
