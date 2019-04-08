<template>
  <div
    v-if="key === '$and' || key == '$or'"
    class="bool-condition"
  >
    <span>{{key}}</span>
    <div class="children">
      <Condition
        v-model="arg[index]"
        @input="$emit('input', {[key]: arg})"
        v-for="(c, index) in arg"
        :key="index"
      />
      <div class="add-icon">
        <v-icon @click="arg.push({})">add_circle</v-icon>
      </div>

    </div>
  </div>
  <div
    v-else-if="key === '$not'"
    class="bool-condition"
  >
    <span>Not</span>
    <div class="children">
      <Condition
        v-model="arg"
        @input="$emit('input', {[key]: arg})"
      />
    </div>
  </div>
  <div
    v-else
    class="field-condition"
  >

    <v-select
      class="field-select"
      v-model="key"
      @input="arg = undefined; $emit('input', {[key]: arg})"
      :items="['header', 'amount', 'currency', 'date', 'time', 'paymentMethod']"
      menu-props="auto"
      label="Select"
      hide-details
      :prepend-icon="icons[key]"
      single-line
    ></v-select>

    <component
      v-if="key"
      :is="key.slice(0,1).toUpperCase() + key.slice(1) + 'Condition'"
      v-model="arg"
      @input="$emit('input',{[key]: arg})"
    />
  </div>
</template>
<script>
import AmountCondition from './AmountCondition.vue';
import CurrencyCondition from './CurrencyCondition.vue';
import DateCondition from './DateCondition.vue';
import HeaderCondition from './HeaderCondition.vue';
import PaymentMethodCondition from './PaymentMethodCondition.vue';
import TimeCondition from './TimeCondition.vue';

export default {
  name: 'Condition',
  props: ['value'],
  components: {
    AmountCondition,
    CurrencyCondition,
    DateCondition,
    HeaderCondition,
    PaymentMethodCondition,
    TimeCondition,
  },
  data() {
    return {
      icons: {
        header: 'title',
        amount: 'attach_money',
        currency: 'attach_money',
        date: 'date_range',
        time: 'access_time',
        paymentMethod: 'money',
      },
      key: Object.keys(this.value)[0],
      arg: Object.values(this.value)[0],
    };
  },
  watch: {
    value(v) {
      [this.key] = Object.keys(v);
      [this.arg] = Object.values(v);
    },
  },
};
</script>
<style scoped>
.bool-condition > .children {
  border-left: 2px dashed black;
  margin: 1em;
}
.bool-condition > .children > * {
  margin: 1em;
}
.add-icon {
  margin: 0;
  display: flex;
  justify-content: center;
}
.add-icon i {
  opacity: 0.5;
}
.add-icon i:hover {
  opacity: 1;
}
.not-condition > .children {
  display: flex;
  align-items: center;
  background: #d3d3d36e;
}
.field-condition {
  display: flex;
  align-items: center;
  padding: 0.3em 1em;
  border: 1px dotted gray;
}
</style>
<style>
.field-condition > div {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.field-condition > div > span {
  padding: 0 1em;
}
.field-select,
.field-condition > div > .v-select {
  padding-top: 0;
  margin-top: 0;
}
.field-condition > div > .v-text-field {
  margin-top: 0;
}
.field-condition > div > .v-text-field .v-input__slot {
  margin-bottom: 0;
}
</style>
