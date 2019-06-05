<template>
  <div>
    <div
      class="header"
      :class="{empty: !header.length}"
      v-dblclick-or-hold
      @dblclickorhold="headerModal = true; headers = [...header]"
    >{{!header.length ? 'No header found' : header.join(', ') }}</div>
    <v-dialog
      v-model="headerModal"
      persistent
      max-width="50vw"
    >
      <v-card>
        <v-card-title class="headline">Edit Headers</v-card-title>
        <v-card-text>
          <v-text-field
            class="header-input"
            v-for="(header, index) in headers"
            :key="index"
            v-model="headers[index]"
            height="1em"
            append-outer-icon="remove_circle"
            @click:append-outer="headers.splice(index, 1)"
          ></v-text-field>
          <v-text-field
            class="header-input"
            height="1em"
            v-model="newHeader"
            append-outer-icon="add_circle"
            @keyup.enter="addNewHeader"
            @click:append-outer="addNewHeader"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!loading"
            color="red darken-1"
            flat
            icon
            @click="headerModal = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            v-if="!loading"
            color="green darken-1"
            flat
            icon
            @click="submitNewHeaders"
          >
            <v-icon>check</v-icon>
          </v-btn>
          <v-progress-circular
            indeterminate
            v-if="loading"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import deepEqual from 'deep-equal';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('receipts');

export default {
  name: 'receiptHeader',
  props: {
    receiptId: String,
    header: Array,
  },
  data() {
    return {
      headers: [],
      newHeader: '',
      headerModal: false,
      loading: false,
    };
  },
  methods: {
    addNewHeader() {
      if (!this.newHeader || !this.newHeader.trim()) {
        return;
      }
      this.headers.push(this.newHeader.trim());
      this.newHeader = '';
    },
    async submitNewHeaders() {
      const newHeaders = this.headers.filter(h => !!h);
      if (deepEqual(this.header, newHeaders)) {
        this.headerModal = false;
        return;
      }
      this.loading = true;
      await this.updateReceipt({
        id: this.receiptId,
        field: 'header',
        value: newHeaders,
      });
      this.loading = false;
      this.headerModal = false;
    },
    ...mapActions(['updateReceipt']),
  },
};
</script>

<style scoped>
.header {
  font-weight: bold;
  font-size: 1.1em;
}
.header.empty {
  font-weight: normal;
  font-size: 1.1em;
  font-style: italic;
}
</style>
