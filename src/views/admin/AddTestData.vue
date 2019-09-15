<template>
  <v-row no-gutters>
    <v-col style="max-height: 100%; max-width: 50%">
      <ImageEditor
        v-if="image"
        v-model="image"
      />
    </v-col>
    <v-col class="grow">
      <v-container>
        <ValidationObserver
          tag="form"
          ref="form"
          v-slot="{invalid,validated,pending}"
          @submit.prevent="saveInfo"
        >
          <VTextFieldWithValidation
            :label="$t('fields.cityCode')"
            name="cityCode"
            v-model.trim="info.cityCode"
            required
            rules="required"
          ></VTextFieldWithValidation>
          <VTextFieldWithValidation
            :label="$t('fields.name')"
            name="name"
            v-model.trim="info.name"
            required
            rules="required"
          ></VTextFieldWithValidation>
          <v-text-field
            :label="$t('fields.classifier')"
            name="classifier"
            v-model.trim="info.classifier"
          ></v-text-field>
          <PaymentMethodInput v-model="info.paymentMethod" />
          <ValidationProvider
            name="category"
            rules="required"
            v-slot="{errors}"
          >
            <v-select
              v-model="info.category"
              :items="categories"
              :label="$t('fields.category')"
              :error-messages="errors"
              required
            ></v-select>
          </ValidationProvider>
          <v-textarea
            v-model.trim="info.notes"
            :label="$t('fields.notes')"
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
              {{$t('actions.deleteImage')}}
            </v-btn>
            <v-btn
              class="ml-1 mr-1"
              type="submit"
              color="primary"
              :disabled="pending || invalid || !validated"
              :loading="pending"
            >{{$t('actions.save')}}</v-btn>
            <ExternalValidation
              name="testDataIdentifier"
              rules="uniqueTestDataRecord"
              :value="identifier"
              :debounce="200"
            >
            </ExternalValidation>
          </v-col>
        </ValidationObserver>
      </v-container>
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
  extend,
} from 'vee-validate';
import { VTextField } from 'vuetify/lib';

import ExternalValidation from '@/components/ExternalValidation.vue';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';
import ProgressModal from '@/components/ProgressModal.vue';
import ImageEditor from './ImageEditor.vue';
import { ext } from '@/util/string';
import {
  categories,
  storage,
  buildIdentifier,
  testDataImageBucket,
  testImageUploadBucket,
} from './util';
import 'cropperjs/dist/cropper.css';

const VTextFieldWithValidation = withValidation(VTextField, ({ errors }) => ({
  'error-messages': errors,
}));

extend('uniqueTestDataRecord', v => {
  return firebase
    .firestore()
    .collection('testData')
    .doc(v)
    .get()
    .then(snap => !snap.exists);
});

function getExtensionForBlob(blob) {
  const m = blob.type.match(/^image\/(.*)$/);
  if (m) {
    return m[1];
  }
  return null;
}

export default {
  props: {
    path: {
      type: String,
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
    ImageEditor,
  },
  data() {
    return {
      categories,
      info: {
        cityCode: '',
        name: '',
        classifier: '',
        paymentMethod: '',
        category: '',
        notes: '',
      },
      image: null,
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
      return buildIdentifier(info);
    },
  },
  methods: {
    async deleteImage() {
      await storage(testImageUploadBucket)
        .ref(this.path)
        .delete();
      this.$router.push({ name: 'adminTestDataNew' });
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
        .join('-')}.${ext(this.path)}`;
      try {
        await this.$refs.progress.run([
          {
            message: 'Saving image',
            run: async () => {
              if (this.image.edited) {
                const newExt = getExtensionForBlob(this.image.blob);
                if (newExt) {
                  info.path = info.path.replace(/\..*$/, `.${newExt}`);
                }
                await storage(testDataImageBucket)
                  .ref(info.path)
                  .put(this.image.blob);
                return storage(testImageUploadBucket)
                  .ref(this.path)
                  .delete();
              }
              return firebase.functions().httpsCallable('moveTestDataImage')({
                ...info,
                source: this.path,
              });
            },
          },
          {
            message: 'Saving info',
            run: () =>
              firebase
                .firestore()
                .collection('testData')
                .doc(this.identifier)
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
        this.$router.push({ name: 'adminTestDataNew' });
      } catch (e) {
        console.error('something happened', e);
      }
    },
  },
  async created() {
    this.image = {
      url: await storage(testImageUploadBucket)
        .ref(this.path)
        .getDownloadURL(),
    };
  },
};
</script>
