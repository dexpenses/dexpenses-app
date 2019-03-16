<template>
  <div>
    <v-icon :color="missing && required ? 'red lighten-1' : undefined">{{icon}}</v-icon>
    <span class="receipt-field-value">
      <span
        class="fixed"
        @dblclick="edit"
        v-show="!editing"
      >{{displayValue}}</span>
      <v-form
        class="form"
        ref="form"
        @submit.prevent="submit"
        v-show="editing || missing"
        v-model="valid"
      >
        <slot
          name="editor"
          :value="changedValueHolder"
          :loading="submitted"
        >
          <v-text-field
            class="edit-input"
            height="1em"
            ref="editInput"
            v-model="changedValueHolder.changedValue"
            :loading="submitted"
            :rules="rules"
            :type="type"
            :mask="mask"
            :return-masked-value="true"
          />
        </slot>
        <v-btn
          flat
          icon
          type="submit"
          v-if="editing || changedValueHolder.changedValue"
        >
          <v-icon>check</v-icon>
        </v-btn>
        <v-btn
          flat
          icon
          v-if="editing || changedValueHolder.changedValue"
          @click="editing = false; changedValueHolder.changedValue = value"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-form>
    </span>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import deepEqual from 'deep-equal';

export default {
  name: 'ReceiptField',
  props: {
    icon: String,
    receipt: Object,
    field: String,
    filter: String,
    required: Boolean,
    rules: Array,
    type: String,
    mask: String,
    parser: {
      type: Function,
      default: v => v.trim(),
    },
    formatter: {
      type: [Function, String],
      default: v => (!v ? '' : v.toString()),
    },
  },
  data() {
    return {
      changedValueHolder: {
        changedValue: null,
      },
      submitted: false,
      editing: false,
      valid: false,
    };
  },
  computed: {
    value() {
      return this.receipt.result.data[this.field];
    },
    displayValue() {
      if (this.filter) {
        return this.$options.filters[this.filter](this.value);
      }
      return this.value;
    },
    missing() {
      return !this.value;
    },
  },
  methods: {
    ...mapActions('receipts', ['updateReceipt']),
    edit() {
      this.editing = true;
      this.changedValueHolder.changedValue = this.format(this.value);
      this.$nextTick(
        () => this.$refs.editInput && this.$refs.editInput.focus()
      );
    },
    async submit() {
      if (!this.valid) {
        return;
      }
      this.editing = false;
      const value = this.parser(this.changedValueHolder.changedValue);
      this.changedValueHolder.changedValue = '';
      if (deepEqual(value, this.value)) {
        return;
      }
      this.submitted = true;
      await this.updateReceipt({
        id: this.receipt.id,
        field: this.field,
        value,
      });
      this.submitted = false;
    },
    format(v) {
      if (typeof this.formatter === 'string') {
        return this.$options.filters[this.filter](v);
      }
      return this.formatter(v);
    },
  },
};
</script>
<style>
.receipt-field-value {
  margin-left: 0.2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.receipt-field-value .fixed {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}
.edit-input {
  height: 1em;
  margin: 0;
  padding: 0;
}
.form {
  display: flex;
}
</style>
