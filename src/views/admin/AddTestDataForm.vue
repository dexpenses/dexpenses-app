<template>
  <v-layout
    d-flex
    row
  >
    <v-flex
      style="max-height: 100%; max-width: 50%"
      v-viewer="{toolbar: true, navbar: false, title: false}"
    >
      <img
        :src="value.downloadUrl"
        style="max-height: 100%; max-width: 100%"
      />
    </v-flex>
    <v-flex grow>

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
        <ValidationProvider
          rules="required"
          v-slot="{errors}"
        >
          <PaymentMethodInput
            v-model="info.paymentMethod"
            required
            :error-messages="errors"
          />
        </ValidationProvider>
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
        <v-flex row>
          <v-btn
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
        </v-flex>
      </ValidationObserver>
    </v-flex>
    <ProgressModal ref="progress" />
  </v-layout>
</template>

<script>
import firebase from 'firebase/app';
import {
  withValidation,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate';
import { VTextField } from 'vuetify/lib';
import ExternalValidation from '@/components/ExternalValidation.vue';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';
import ProgressModal from '@/components/ProgressModal.vue';
import { ext } from '@/util/string';

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
      if (
        !info.category ||
        !info.cityCode ||
        !info.name ||
        !info.paymentMethod
      ) {
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
    async saveInfo() {
      const valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      const info = this.transformedInfo;

      console.log(this.value.ref);

      info.path = `${info.category}/${[
        info.cityCode,
        info.name,
        info.classifier,
        info.paymentMethod,
      ]
        .filter(p => !!p)
        .join('-')}.${ext(this.value.ref.name)}`;
      console.log(info);
      try {
        await this.$refs.progress.run([
          {
            message: 'Saving image',
            run: () =>
              firebase.functions().httpsCallable('moveTestDataImage')({
                ...info,
                source: this.value.ref.fullPath,
              }),
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
        console.log('done');
      } catch (e) {
        console.error('something happened', e);
      }
    },
  },
  created() {
    this.$validator.extend('unique', unique);
  },
};
</script>
