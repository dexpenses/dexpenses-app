<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        v-on="on"
      >
        ADD
        <v-icon right>add_circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Create New Recurring Payment</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="recurringPayment.name"
                  ref="nameField"
                  label="Name*"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="recurringPayment.description"
                  label="Description"
                ></v-textarea>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="recurringPayment.amount.value"
                  label="Amount*"
                  type="number"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <CurrencyInput v-model="recurringPayment.amount.currency" />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <PaymentMethodInput v-model="recurringPayment.paymentMethod" />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  required
                  label="Period"
                  v-model="recurringPayment.period"
                  :items="['Monthly', 'Quarterly', 'Yearly']"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-if="recurringPayment.period === 'Monthly'"
                  v-model="recurringPayment.dueDate"
                  label="Due Day"
                  prepend-icon="date_range"
                  :rules="[rules.intRange(1,31)]"
                />
                <v-text-field
                  v-else
                  v-model="recurringPayment.dueDate"
                  label="Due Date"
                  prepend-icon="date_range"
                  mask="##/##"
                  :return-masked-value="true"
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat
          @click="hide"
        >Close</v-btn>
        <v-btn
          color="blue darken-1"
          flat
          :loading="loading"
          :disabled="!valid || loading"
          @click="save"
        >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';
import CurrencyInput from '@/components/fields/CurrencyInput.vue';
import { required, intRange } from '@/util/form-rules';

const recurringPaymentTemplate = {
  id: null,
  name: '',
  description: '',
  period: 'Monthly',
  amount: {
    value: null,
    currency: 'EUR',
  },
  paymentMethod: 'DEBIT',
};

export default {
  name: 'AddRecurringPaymentForm',
  components: {
    PaymentMethodInput,
    CurrencyInput,
  },
  props: {
    value: Boolean,
    data: Object,
  },
  data() {
    return {
      show: this.value,
      loading: false,
      valid: false,
      recurringPayment:
        this.data || JSON.parse(JSON.stringify(recurringPaymentTemplate)),
      rules: {
        required,
        intRange,
      },
    };
  },
  computed: {
    ...mapState('user', ['user']),
  },
  watch: {
    data(v) {
      this.recurringPayment = JSON.parse(
        JSON.stringify(v || recurringPaymentTemplate)
      );
    },
    value(v) {
      this.show = v;
    },
    show: {
      immediate: true,
      handler(v) {
        if (v) {
          this.$nextTick(() => this.$refs.nameField.focus());
        }
      },
    },
  },
  methods: {
    hide() {
      this.show = false;
      this.$emit('input', false);
    },
    async save() {
      this.loading = true;
      this.recurringPayment.amount.value = parseFloat(
        this.recurringPayment.amount.value
      );

      const collection = firebase
        .firestore()
        .collection('recurringPaymentsByUser')
        .doc(this.user.uid)
        .collection('recurringPayments');
      if (!this.recurringPayment.id) {
        await collection.add(this.recurringPayment);
      } else {
        await collection
          .doc(this.recurringPayment.id)
          .set(this.recurringPayment, { merge: true });
      }

      this.loading = false;
      this.recurringPayment = JSON.parse(
        JSON.stringify(recurringPaymentTemplate)
      );
      this.$refs.form.reset();
      this.hide();
    },
  },
};
</script>
