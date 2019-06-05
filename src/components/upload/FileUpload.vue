<template>
  <div>
    <drop-zone
      class="dropzone"
      @hovered="hovering = $event"
      @dropped="startUpload($event)"
      :class="{hovering}"
    >
      <h3>Just drop some files</h3>

      <div class="file">
        <label class="file-label">
          <input
            ref="fileInput"
            type="file"
            @change="startUpload($event.target.files)"
            multiple
            accept="image/*"
          >
          <v-btn
            color="blue-grey"
            class="white--text"
            @click="$refs.fileInput.click()"
          >
            <v-icon
              left
              dark
            >cloud_upload</v-icon>
            or choose a file…
          </v-btn>
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
import DropZone from '@/components/upload/DropZone.vue';
import FileUploadTask from '@/components/upload/FileUploadTask.vue';

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
  border: 2px dashed #607d8b;
  border-radius: 5px;
  background: white;
  margin: 10px 0;
  position: relative;
}

.dropzone.hovering {
  border: 2px solid #ff5722;
}

.dropzone.hovering::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: white;
  opacity: 0.7;
}

progress::-webkit-progress-value {
  transition: width 0.1s ease;
}

h3 {
  margin: 1em;
}

.file input {
  display: none;
}
.file-upload-tasks {
  display: flex;
  flex-wrap: wrap;
}
</style>
