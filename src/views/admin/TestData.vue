<template>
  <v-container>
    <v-expansion-panels
      v-model="panels"
      multiple
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
      <v-expansion-panel v-if="selected">
        <v-expansion-panel-header>
          Add new receipt test data
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <AddTestDataForm
            :value="selected"
            @done="removePendingImage($event); determineOpenPanel(); selected = null"
            @deleted="removePendingImage($event); determineOpenPanel(); selected = null"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Explore test data
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ExploreTestData />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import { storage } from './util';
import FileUpload from '@/components/upload/FileUpload.vue';
import FileUploadTask from '@/components/upload/FileUploadTask.vue';
import AddTestDataForm from './AddTestDataForm.vue';
import ExploreTestData from './ExploreTestData.vue';

export default {
  components: {
    FileUpload,
    FileUploadTask,
    AddTestDataForm,
    ExploreTestData,
  },
  data() {
    return {
      selected: null,
      uploadOpen: false,
      previouslyUploadedOpen: false,
      pending: null,
    };
  },
  computed: {
    ...mapState('user', ['user']),
    panels: {
      get() {
        const p = [];
        if (this.uploadOpen) {
          p.push(0);
        }
        if (this.previouslyUploadedOpen) {
          p.push(1);
        }
        if (this.selected) {
          p.push(2);
        }
        return p;
      },
      set(newValue) {
        if (newValue.includes(0)) {
          this.uploadOpen = true;
        }
        if (newValue.includes(1)) {
          this.previouslyUploadedOpen = true;
        }
      },
    },
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
      this.uploadOpen = false;
      this.previouslyUploadedOpen = false;
    },
    removePendingImage(toRemove) {
      this.pending = this.pending.filter(
        ({ ref }) => ref.fullPath !== toRemove.ref.fullPath
      );
    },
    determineOpenPanel() {
      const anyPending = this.pending.length > 0;
      this.uploadOpen = !anyPending;
      this.previouslyUploadedOpen = anyPending;
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
