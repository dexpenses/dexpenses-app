<template>
  <ValidationProvider
    :name="name"
    ref="provider"
    :rules="rules"
    v-slot="{errors}"
    slim
  >
    <slot :errors="errors">
      <span
        :value="errors.length > 0"
        class="red--text"
      >
        {{errors[0]}}
      </span>
    </slot>
  </ValidationProvider>
</template>
<script>
import debounce from 'lodash/debounce';
import { ValidationProvider } from 'vee-validate';

export default {
  props: {
    value: String,
    debounce: Number,
    name: String,
    rules: String,
  },
  components: { ValidationProvider },
  watch: {
    value(v) {
      this.$refs.provider.setFlags({
        pending: true,
      });
      this.validate(v);
    },
  },
  data() {
    return {
      validate: null,
    };
  },
  created() {
    if (this.debounce) {
      this.validate = debounce(
        v => this.$refs.provider.validate(v),
        this.debounce
      );
    } else {
      this.validate = v => this.$refs.validate(v);
    }
  },
};
</script>
