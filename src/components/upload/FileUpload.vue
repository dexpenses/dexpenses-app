<template>
  <div>
    <DropZone
      class="dropzone"
      @hovered="hovering = $event"
      @dropped="hovering = false; startUpload($event)"
      :class="{hovering}"
    >
      <h3>{{$t('actions.dropFiles')}}</h3>

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
            {{$t('actions.orChooseFile')}}
          </v-btn>
        </label>
      </div>
    </DropZone>
    <div class="file-upload-tasks">
      <slot
        name="upload-tasks"
        :upload-tasks="uploadTasks"
      >
        <FileUploadTask
          v-for="(uploadTask, index) in uploadTasks"
          :key="index"
          :task="uploadTask"
          :on-complete="onComplete"
        />
      </slot>

    </div>
  </div>
</template>
<script>
import DropZone from '@/components/upload/DropZone.vue';
import FileUploadTask from '@/components/upload/FileUploadTask.vue';

export default {
  name: 'fileUpload',
  components: {
    DropZone,
    FileUploadTask,
  },
  props: {
    upload: {
      type: Function,
      required: true,
    },
    onComplete: Function,
  },
  data() {
    return {
      hovering: false,
      uploadTasks: [],
    };
  },
  methods: {
    startUpload(files) {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        if (file.type.match(/^image\/.*/)) {
          const uploadTask = this.upload(file);
          this.uploadTasks.push(uploadTask);
        }
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
  /* background: white; */
  margin: 10px 0;
  position: relative;
}

.dropzone.hovering {
  border: 2px solid var(--v-primary-base);
}

.dropzone.hovering::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: var(--v-secondary-lighten5);
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
