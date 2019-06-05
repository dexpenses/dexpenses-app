<template>
  <v-container>
    <file-upload />
  </v-container>
</template>
<script>
import FileUpload from '@/components/upload/FileUpload.vue';

export default {
  name: 'uploadReceipts',
  components: {
    FileUpload,
  },
  data() {
    return {};
  },
};
</script>
