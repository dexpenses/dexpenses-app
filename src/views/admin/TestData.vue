<template>
  <v-container>
    <v-expansion-panels
      v-model="uploadOpen"
      expand
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          Upload
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <FileUpload
            :upload="uploadImage"
            class="upload"
            :class="{collapsed: !!selected}"
          >
            <template
              slot="upload-tasks"
              slot-scope="{uploadTasks}"
            >
              <FileUploadTask
                v-for="(uploadTask, index) in uploadTasks"
                :key="index"
                :task="uploadTask"
                @img-clicked="selectImage"
              />
            </template>
          </FileUpload>
        </v-expansion-panel-content>

      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Previously uploaded
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-progress-circular
            indeterminate
            v-if="!pending"
          />
          <v-row v-else>
            <span v-if="pending.length === 0">Nothing here.</span>
            <v-col
              v-for="p in pending"
              :key="p.ref.name"
              @click="selectImage(p)"
            >
              <v-img
                v-if="p.downloadUrl"
                max-height="200px"
                contain
                :src="p.downloadUrl"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>

      </v-expansion-panel>
    </v-expansion-panels>
    <AddTestDataForm
      v-if="selected"
      :value="selected"
      @done="removePendingImage($event); determineOpenPanel(); selected = null"
      @deleted="removePendingImage($event); determineOpenPanel(); selected = null"
    />
  </v-container>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import FileUpload from '@/components/upload/FileUpload.vue';
import FileUploadTask from '@/components/upload/FileUploadTask.vue';
import AddTestDataForm from './AddTestDataForm.vue';

const testDataImageBucket = 'dexpenses-207219-test-images';
const storage = firebase.app().storage(`gs://${testDataImageBucket}/`);

export default {
  components: {
    FileUpload,
    FileUploadTask,
    AddTestDataForm,
  },
  data() {
    return {
      selected: null,
      uploadOpen: [true, false],
      pending: null,
    };
  },
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
    selectImage({ $event, ref, downloadUrl }) {
      if ($event) {
        $event.preventDefault();
      }

      this.selected = { ref, downloadUrl };
      this.uploadOpen = [false, false];
    },
    removePendingImage(toRemove) {
      this.pending = this.pending.filter(
        ({ ref }) => ref.fullPath !== toRemove.ref.fullPath
      );
    },
    determineOpenPanel() {
      const anyPending = this.pending.length > 0;
      this.uploadOpen = [!anyPending, anyPending];
    },
  },
  async created() {
    const { items } = await storage.ref().listAll();
    this.pending = items
      .filter(i => i.name.startsWith(this.user.uid))
      .map(ref => ({ ref, downloadUrl: null }));

    this.determineOpenPanel();

    const downloadURLs = await Promise.all(
      this.pending.map(({ ref }) => storage.ref(ref.fullPath).getDownloadURL())
    );
    downloadURLs.forEach((downloadUrl, i) => {
      this.pending[i].downloadUrl = downloadUrl;
    });
  },
};
</script>
<style scoped>
</style>
