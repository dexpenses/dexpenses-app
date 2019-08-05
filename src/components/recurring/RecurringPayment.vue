<template>
  <v-row justify="space-between">
    <v-col>
      <h3>{{value.name}}</h3>
      <div class="recurring-payment-info">
        <div v-if="value.description">
          {{value.description}}
        </div>
        <v-row class="spans">
          <span>
            {{value.amount | currency}}
          </span>
          <span>by</span>
          <span>
            {{value.paymentMethod}}
          </span>
        </v-row>
        <v-row class="spans">
          <span>Paid</span>
          <span>{{value.period}}</span>
          <template v-if="value.dueDate">
            <span>due by</span>
            <span>{{value.dueDate}}</span>
          </template>
        </v-row>
      </div>
    </v-col>
    <v-col class="shrink">
      <v-icon
        class="hoverable-icon"
        @click="$emit('edit', value)"
      >
        edit
      </v-icon>
      <v-dialog
        v-if="!deleting"
        v-model="confirmDialog"
        persistent
        max-width="290"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            class="hoverable-icon"
            v-on="on"
          >delete</v-icon>
        </template>
        <v-card>
          <v-card-title class="headline">Are you sure to delete recurring payment '{{value.name}}'?</v-card-title>
          <!-- <v-card-text>
            bla
          </v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              flat
              @click="confirmDialog = false"
            >Keep</v-btn>
            <v-btn
              color="error"
              flat
              @click="confirmDialog = false; remove()"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <span
        v-else
        class="loading-icon"
      >
        <v-icon>cached</v-icon>
      </span>
    </v-col>
  </v-row>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';

export default {
  name: 'RecurringPayment',
  props: ['value'],
  data() {
    return {
      confirmDialog: false,
      deleting: false,
    };
  },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    async remove() {
      this.deleting = true;
      await firebase
        .firestore()
        .collection('recurringPaymentsByUser')
        .doc(this.user.uid)
        .collection('recurringPayments')
        .doc(this.value.id)
        .delete();
      this.deleting = false;
    },
  },
};
</script>
<style scoped>
.recurring-payment-info {
  padding-left: 1em;
}
.spans > *:not(:last-child) {
  margin-right: 0.2em;
}
.loading-icon {
  animation: spinning 1s infinite;
  display: flex;
  flex-grow: 0;
}
.loading-icon i {
  opacity: 0.5;
}
</style>
