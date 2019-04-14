<template>
  <div
    v-if="key === '$and' || key == '$or'"
    class="bool-condition"
  >
    <v-select
      class="field-select bool-select"
      v-model="key"
      @input="$emit('input', {[key]: arg})"
      :items="[{key:'$and',text:'All Of'}, {key:'$or',text:'Any Of'}]"
      item-text="text"
      item-value="key"
      menu-props="auto"
      label="Select"
      hide-details
      single-line
    ></v-select>

    <div class="children">
      <Condition
        v-model="arg[index]"
        @input="$emit('input', {[key]: arg})"
        @delete="arg.splice(index, 1)"
        v-for="(c, index) in arg"
        :key="index"
      />
      <div class="add-icon">
        <v-icon
          class="hoverable-icon"
          @click="arg.push({})"
        >add_circle</v-icon>
      </div>

    </div>
  </div>
  <div
    v-else-if="key === '$not'"
    class="not-condition"
  >
    <span>Not</span>
    <Condition
      v-model="arg"
      @input="$emit('input', {[key]: arg})"
    />
  </div>
  <div
    v-else
    class="field-condition"
  >

    <v-select
      class="field-select"
      v-model="key"
      @input="arg = undefined; $emit('input', {[key]: arg})"
      :items="fieldNames"
      item-text="displayName"
      item-value="name"
      menu-props="auto"
      label="Select"
      hide-details
      :prepend-icon="(fields[key] || {}).icon"
      single-line
    ></v-select>

    <component
      v-if="key"
      :is="key.slice(0,1).toUpperCase() + key.slice(1) + 'Condition'"
      v-model="arg"
      @input="$emit('input',{[key]: arg})"
    />

    <v-icon
      class="hoverable-icon"
      @click="$emit('delete')"
    >delete</v-icon>
  </div>
</template>
<script>
import AmountCondition from './AmountCondition.vue';
import CurrencyCondition from './CurrencyCondition.vue';
import DateCondition from './DateCondition.vue';
import HeaderCondition from './HeaderCondition.vue';
import PaymentMethodCondition from './PaymentMethodCondition.vue';
import TimeCondition from './TimeCondition.vue';
import { fields } from '@/util/receipt';

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
      fields,
      fieldNames: Object.entries(fields).map(([name, def]) => ({
        ...def,
        name,
      })),
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
.not-condition {
  display: flex;
  align-items: center;
}
.not-condition > span {
  padding-right: 1em;
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
.field-select {
  max-width: 200px;
}
.bool-select {
  max-width: 6em;
}
.field-select,
.field-condition > div > .v-select {
  padding-top: 0;
  margin-top: 0;
}
.field-condition > div > .v-text-field,
.field-condition > div > .v-input--selection-controls {
  margin-top: 0;
}
.field-condition > div > .v-text-field .v-input__slot,
.field-condition > div > .v-input--selection-controls .v-input__slot {
  margin-bottom: 0;
}
</style>
