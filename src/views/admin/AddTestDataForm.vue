<template>
  <v-row class="d-flex">
    <v-col
      style="max-height: 100%; max-width: 50%"
      v-viewer="{toolbar: true, navbar: false, title: false}"
    >
      <v-row v-if="!editMode">
        <v-btn
          fab
          @click="editMode = 'crop'"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          fab
          @click="editMode = 'redact'"
        >
          <v-icon>flag</v-icon>
        </v-btn>
      </v-row>
      <v-row v-else>
        <v-btn
          fab
          @click="editMode == 'crop' ? cropImage() : redactImage()"
        >
          <v-icon>check</v-icon>
        </v-btn>
        <v-btn
          fab
          @click="editMode = null"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-row>
      <img
        v-if="!editMode"
        :src="edited ? edited.url : value.downloadUrl"
        style="max-height: 100%; max-width: 100%"
      />
      <VueCropper
        v-else-if="editMode == 'crop'"
        ref="cropper"
        :src="value.downloadUrl"
        alt="Source Image"
      />
      <VueImageRedact
        v-else-if="editMode == 'redact'"
        ref="redacter"
        :src="edited ? edited.url : value.downloadUrl"
        style="max-height: 100%; max-width: 100%"
      />
    </v-col>
    <v-col class="grow">

      <ValidationObserver
        tag="form"
        ref="form"
        v-slot="{invalid,validated,pending}"
        @submit.prevent="saveInfo"
      >
        <v-subheader>
          {{value.ref.name}}
        </v-subheader>
        <VTextFieldWithValidation
          label="City code"
          v-model.trim="info.cityCode"
          required
          rules="required"
        ></VTextFieldWithValidation>
        <VTextFieldWithValidation
          label="Name"
          v-model.trim="info.name"
          required
          rules="required"
        ></VTextFieldWithValidation>
        <v-text-field
          label="Classifier"
          v-model.trim="info.classifier"
        ></v-text-field>
        <PaymentMethodInput v-model="info.paymentMethod" />
        <ValidationProvider
          rules="required"
          v-slot="{errors}"
        >
          <v-select
            v-model="info.category"
            :items="['bills','ec','gas_station','normal','parking']"
            label="Category"
            :error-messages="errors"
            required
          ></v-select>
        </ValidationProvider>
        <v-textarea
          v-model.trim="info.notes"
          label="Notes"
        ></v-textarea>
        <v-col class="row">
          <v-btn
            class="ml-1 mr-1"
            color="error"
            @click="deleteImage"
          >
            <v-icon
              left
              dark
            >delete</v-icon>
            Delete image
          </v-btn>
          <v-btn
            class="ml-1 mr-1"
            type="submit"
            color="primary"
            :disabled="pending || invalid || !validated"
            :loading="pending"
          >Save</v-btn>
          <ExternalValidation
            :name="$t('admin.testData.identifier')"
            rules="unique"
            :value="identifier"
            :debounce="200"
          >
          </ExternalValidation>
        </v-col>
      </ValidationObserver>
    </v-col>
    <ProgressModal ref="progress" />
  </v-row>
</template>

<script>
import firebase from 'firebase/app';
import {
  withValidation,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate';
import { VTextField } from 'vuetify/lib';
import VueCropper from 'vue-cropperjs';
import VueImageRedact from 'vue-image-redact';
import ExternalValidation from '@/components/ExternalValidation.vue';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';
import ProgressModal from '@/components/ProgressModal.vue';
import { ext } from '@/util/string';
import 'cropperjs/dist/cropper.css';

const testDataImageBucket = 'dexpenses-207219-test-images';

const VTextFieldWithValidation = withValidation(VTextField, ({ errors }) => ({
  'error-messages': errors,
}));

const unique = v => {
  return firebase
    .firestore()
    .collection('testData')
    .doc(v)
    .get()
    .then(snap => !snap.exists);
};

function getExtensionForBlob(blob) {
  const m = blob.type.match(/^image\/(.*)$/);
  if (m) {
    return m[1];
  }
  return null;
}

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  components: {
    PaymentMethodInput,
    ProgressModal,
    ValidationObserver,
    ExternalValidation,
    VTextFieldWithValidation,
    ValidationProvider,
    VueCropper,
    VueImageRedact,
  },
  data() {
    return {
      info: {
        cityCode: '',
        name: '',
        classifier: '',
        paymentMethod: '',
        category: '',
        notes: '',
      },
      edited: null,
      editMode: null,
    };
  },
  computed: {
    transformedInfo() {
      return {
        ...this.info,
        cityCode: this.info.cityCode.toLowerCase().replace(/\s+/g, '-'),
        name: this.info.name.toLowerCase().replace(/\s+/g, '-'),
        category: this.info.category.toLowerCase(),
        paymentMethod: this.info.paymentMethod.toLowerCase(),
        classifier: this.info.classifier.toLowerCase(),
      };
    },
    identifier() {
      const info = this.transformedInfo;
      if (!info.category || !info.cityCode || !info.name) {
        return null;
      }
      return `${[
        info.category,
        info.cityCode,
        info.name,
        info.classifier,
        info.paymentMethod,
      ]
        .filter(p => !!p)
        .join('-')}`;
    },
  },
  methods: {
    async handleImageEditDone(canvas) {
      this.edited = {
        url: canvas.toDataURL(),
        blob: await new Promise((resolve, reject) => {
          try {
            canvas.toBlob(resolve);
          } catch (e) {
            reject(e);
          }
        }),
      };
      this.editMode = null;
    },
    async cropImage() {
      await this.handleImageEditDone(this.$refs.cropper.getCroppedCanvas());
    },
    async redactImage() {
      await this.handleImageEditDone(this.$refs.redacter.canvas());
    },
    async deleteImage() {
      await firebase
        .app()
        .storage(`gs://${testDataImageBucket}/`)
        .ref(this.value.ref.fullPath)
        .delete();
      this.$emit('deleted', this.value);
      this.$emit('input', null);
    },
    async saveInfo() {
      const valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      const info = this.transformedInfo;

      info.path = `${info.category}/${[
        info.cityCode,
        info.name,
        info.classifier,
        info.paymentMethod,
      ]
        .filter(p => !!p)
        .join('-')}.${ext(this.value.ref.name)}`;
      try {
        await this.$refs.progress.run([
          {
            message: 'Saving image',
            run: () => {
              if (this.edited) {
                const newExt = getExtensionForBlob(this.edited.blob);
                if (newExt) {
                  info.path = info.path.replace(/\..*$/, `.${newExt}`);
                }
                return firebase
                  .app()
                  .storage(`gs://${testDataImageBucket}/`)
                  .ref(info.path)
                  .put(this.edited.blob);
              }
              return firebase.functions().httpsCallable('moveTestDataImage')({
                ...info,
                source: this.value.ref.fullPath,
              });
            },
          },
          {
            message: 'Saving info',
            run: () =>
              firebase
                .firestore()
                .collection('testData')
                .doc(
                  `${[
                    info.category,
                    info.cityCode,
                    info.name,
                    info.classifier,
                    info.paymentMethod,
                  ]
                    .filter(p => !!p)
                    .join('-')}`
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
            message: 'Commiting file & creating issue',
            run: result =>
              firebase.functions().httpsCallable('addTestDataFile')({
                ...info,
                content: result.data.text,
              }),
          },
        ]);
        // wob-rewe-laagberg
        // gf-penny

        this.$emit('done', this.value);
        this.$emit('input', null);
      } catch (e) {
        console.error('something happened', e);
      }
    },
  },
  created() {
    this.$validator.extend('unique', unique);
  },
  watch: {
    value() {
      Object.keys(this.info).forEach(key => {
        this.info[key] = '';
      });
      this.$refs.form.reset();
    },
  },
};
</script>
