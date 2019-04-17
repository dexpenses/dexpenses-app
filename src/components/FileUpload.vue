<template>
  <div>
    <drop-zone
      class="dropzone"
      @hovered="hovering = $event"
      @dropped="startUpload($event)"
      :class="{hovering: hovering}"
    >
      <h3>Just drop some files</h3>

      <div class="file">
        <label class="file-label">
          <input
            type="file"
            @change="startUpload($event.target.files)"
            multiple
          >
          <span class="file-cta">
            <span class="file-icon">
              <v-icon>cloud_upload</v-icon>
            </span>
            <span class="file-label">or choose a file…</span>
          </span>
        </label>
      </div>
    </drop-zone>
    <div class="file-upload-tasks">
      <file-upload-task
        v-for="(uploadTask, index) in uploadTasks"
        :key="index"
        :task="uploadTask"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import DropZone from '@/components/DropZone.vue';
import FileUploadTask from '@/components/FileUploadTask.vue';

export default {
  name: 'fileUpload',
  components: {
    DropZone,
    FileUploadTask,
  },
  data() {
    return {
      hovering: false,
      uploadTasks: [],
    };
  },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    startUpload(files) {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const uploadTask = firebase
          .storage()
          .ref(`images/${this.user.uid}/${Date.now()}-${file.name}`)
          .put(file, {
            contentType: file.type,
          });
        this.uploadTasks.push(uploadTask);
      }
    },
  },
};
</script>
<style scoped>
.dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 300px;
  border: 2px dashed #f16624;
  border-radius: 5px;
  background: white;
  margin: 10px 0;
}

.dropzone.hovering {
  border: 2px solid #f16624;
  color: #dadada !important;
}

progress::-webkit-progress-value {
  transition: width 0.1s ease;
}

.file input {
  display: none;
}
.file-upload-tasks {
  display: flex;
  flex-wrap: wrap;
}
</style>
