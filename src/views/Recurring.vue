<template>
  <v-container>
    <v-row justify="space-between">
      <h1>Recurring Payments</h1>
      <div>
        <AddRecurringPaymentForm
          v-model="showForm"
          :data="recurringPaymentToEdit"
        />
      </div>
    </v-row>
    <v-progress-circular
      indeterminate
      v-if="loading"
    />
    <v-container v-else>
      <div v-if="recurringPayments.length === 0">
        Oh, looks like you don't have any recurring payments configured. Go ahead and create one!
      </div>
      <v-col
        v-for="recurringPayment in recurringPayments"
        :key="recurringPayment.id"
      >
        <RecurringPayment
          :value="recurringPayment"
          @edit="recurringPaymentToEdit = recurringPayment; showForm = true;"
        />
        <v-divider
          class="recurring-payment-divider"
          :key="recurringPayment.id+'d'"
        ></v-divider>
      </v-col>
    </v-container>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import AddRecurringPaymentForm from '@/components/recurring/AddRecurringPaymentForm.vue';
import RecurringPayment from '@/components/recurring/RecurringPayment.vue';

export default {
  name: 'Recurring',
  components: {
    AddRecurringPaymentForm,
    RecurringPayment,
  },
  data() {
    return {
      showForm: false,
      recurringPaymentToEdit: null,
    };
  },
  computed: {
    ...mapState('recurring', ['loading', 'recurringPayments']),
  },
  methods: {
    ...mapActions('recurring', ['load', 'unbind']),
  },
  created() {
    this.load();
  },
  destroyed() {
    this.unbind();
  },
};
</script>
<style scoped>
.recurring-payment-divider {
  margin: 1em 0;
}
</style>
