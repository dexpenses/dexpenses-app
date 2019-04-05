<template>
  <div>
    <v-icon :color="missing && required ? 'red lighten-1' : undefined">{{icon}}</v-icon>
    <span class="receipt-field-value">
      <span
        class="fixed"
        v-dblclick-or-hold
        @dblclickorhold="edit"
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
            class="edit-input receipt-field-text-field"
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
      default: v => (v ? v.trim() : v),
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
      let value;
      if (
        !this.changedValueHolder.changedValue ||
        !this.changedValueHolder.changedValue.trim()
      ) {
        value = null;
      } else {
        value = this.parser(this.changedValueHolder.changedValue);
      }
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
        return this.$options.filters[this.formatter](v);
      }
      return this.formatter(v);
    },
  },
};
</script>
<style scoped>
.receipt-field-value {
  margin-left: 0.2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  height: 1em;
}
</style>
<style>
.receipt-field-text-field {
  height: 1em;
  margin: 0;
  padding: 0;
}
.receipt-field-text-field input {
  width: 100%;
}
</style>
