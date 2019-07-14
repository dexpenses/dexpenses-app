<template>
  <v-container>
    <v-expansion-panel
      v-model="uploadOpen"
      expand
    >
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            Upload
          </div>
        </template>
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
      <v-expansion-panel-content>
        <template v-slot:header>
          Previously uploaded
        </template>
        <v-progress-circular
          indeterminate
          v-if="!pending"
        />
        <template v-else>
          <span v-if="pending.length === 0">Nothing here.</span>
          <v-card
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
            <v-card-title>
              {{p.ref.name}}
            </v-card-title>
          </v-card>
        </template>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-layout
      v-if="selected"
      d-flex
      row
    >
      <!-- <v-img
        :src="selected.downloadUrl"
        max-height="100%"
        max-width="50%"
        contain
      /> -->
      <v-flex
        style="max-height: 100%; max-width: 50%"
        v-viewer="{toolbar: false, navbar: false, title: false}"
      >
        <img
          :src="selected.downloadUrl"
          style="max-height: 100%; max-width: 100%"
        />
      </v-flex>
      <v-flex grow>
        <form @submit.prevent="saveInfo">
          <v-subheader>
            {{selected.ref.name}}
          </v-subheader>
          <v-text-field
            label="City code"
            v-model="info.cityCode"
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="info.name"
          ></v-text-field>
          <v-text-field
            label="Classifier"
            v-model="info.classifier"
          ></v-text-field>
          <PaymentMethodInput v-model="info.paymentMethod" />
          <v-select
            v-model="info.category"
            :items="['bills','ec','gas_station','normal','parking']"
            label="Category"
          ></v-select>
          <v-text-area
            v-model="info.notes"
            label="Notes"
          ></v-text-area>
          <v-flex row>
            <v-btn
              type="submit"
              color="primary"
            >Save</v-btn>
          </v-flex>
        </form>
      </v-flex>
      <ProgressModal ref="progress" />
    </v-layout>
  </v-container>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import FileUpload from '@/components/upload/FileUpload.vue';
import FileUploadTask from '@/components/upload/FileUploadTask.vue';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';
import ProgressModal from '@/components/ProgressModal.vue';

const testDataImageBucket = 'dexpenses-207219-test-images';
const storage = firebase.app().storage(`gs://${testDataImageBucket}/`);

export default {
  components: {
    FileUpload,
    FileUploadTask,
    PaymentMethodInput,
    ProgressModal,
  },
  data() {
    return {
      selected: null,
      uploadOpen: [true, false],
      pending: null,
      info: {
        cityCode: '',
        name: '',
        classifier: '',
        paymentMethod: '',
        category: '',
        notes: '',
      },
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
    async saveInfo() {
      const info = Object.fromEntries(
        Object.entries(this.info).map(([key, value]) => [
          key,
          value.toLowerCase() || null,
        ])
      );
      if (
        !info.cityCode ||
        !info.name ||
        !info.category ||
        !info.paymentMethod
      ) {
        throw new Error(
          'name, city code, category and payment method are required'
        );
      }
      console.log(this.selected.ref);
      function ext(f) {
        const parts = f.split('.');
        if (parts.length === 0) {
          return null;
        }
        return parts[parts.length - 1];
      }

      info.path = `${info.category}/${[
        info.cityCode,
        info.name,
        info.classifier,
        info.paymentMethod,
      ]
        .filter(p => !!p)
        .join('-')}.${ext(this.selected.ref.name)}`;
      console.log(info);
      // function timeout(ms) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       // if (Math.round(Math.random())) {
      //       resolve();
      //       // } else {
      //       // reject();
      //       // }
      //     }, ms);
      //   });
      // }
      try {
        await this.$refs.progress.run([
          {
            message: 'Saving image',
            run: async () => {
              const blob = await fetch(this.selected.downloadUrl).then(r =>
                r.blob()
              );
              console.log(blob);
              await storage.ref(info.path).put(blob);
              return storage.ref(this.selected.ref.fullPath).delete();
            },
          },
          {
            message: 'Saving info',
            run: () =>
              firebase
                .firestore()
                .collection('testData')
                .doc(
                  `${info.category}-${[
                    info.cityCode,
                    info.name,
                    info.classifier,
                    info.paymentMethod,
                  ]
                    .filter(p => !!p)
                    .join('-')}.${ext(this.selected.ref.name)}`
                )
                .set({
                  ...info,
                }),
          },
          {
            message: 'Running OCR',
            run: () =>
              firebase.functions().httpsCallable('manualTextDetection')({
                url: `gs://${testDataImageBucket}/${info.path}`,
              }),
          },
          {
            message: 'Creating pull request',
            run: result =>
              firebase.functions().httpsCallable('addTestDataFile')({
                ...info,
                content: result.data.text,
              }),
          },
        ]);
        // wob-rewe-laagberg
        // gf-penny
        this.pending = this.pending.filter(
          ({ ref }) => ref.fullPath !== this.selected.ref.fullPath
        );
        this.selected = null;
        console.log('done');
      } catch (e) {
        console.error('something happened', e);
      }
    },
  },
  async created() {
    const { items } = await storage.ref().listAll();
    this.pending = items
      .filter(i => i.name.startsWith(this.user.uid))
      .map(ref => ({ ref, downloadUrl: null }));

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
