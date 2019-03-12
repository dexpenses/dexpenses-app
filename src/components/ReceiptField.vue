<template>
  <div>
    <v-icon :color="missing && required ? 'red lighten-1' : undefined">{{icon}}</v-icon>
    <span class="receipt-field-value">
      <span @dblclick="edit" v-show="!editing">
        <slot v-if="value" :value="value">{{displayValue}}</slot>
      </span>
      <v-text-field
        class="edit-input"
        height="1em"
        ref="editInput"
        v-show="editing || missing"
        v-model="changedValue"
        :loading="submitted"
        @keyup.enter="submit"
      />
      <v-icon v-if="editing || changedValue" @click="submit">check</v-icon>
      <v-icon v-if="editing || changedValue" @click="editing = false; changedValue = value">close</v-icon>
    </span>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'ReceiptField',
  props: {
    icon: String,
    receipt: Object,
    field: String,
    filter: String,
    required: Boolean,
  },
  data() {
    return {
      changedValue: null,
      submitted: false,
      editing: false,
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
    ...mapActions(['updateReceipt']),
    edit() {
      this.editing = true;
      this.changedValue = this.value;
      this.$nextTick(() => this.$refs.editInput.focus());
    },
    async submit() {
      this.editing = false;
      // todo if changed
      if (!this.changedValue || !this.changedValue.trim()) {
        return;
      }
      this.submitted = true;
      await this.updateReceipt({id:this.receipt.id,field:this.field,value:this.changedValue.trim()})
      this.submitted = false;
    },
  },
};
</script>
<style>
.receipt-field-value {
  margin-left: .2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit-input {
  height: 1em;
  margin: 0;
  padding: 0;
}
</style>
