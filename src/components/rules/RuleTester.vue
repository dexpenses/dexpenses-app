<template>
  <v-dialog
    v-model="show"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on">
        <v-icon left>build</v-icon>
        Test
      </v-btn>
    </template>
    <v-card v-if="show">
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="hide"
        >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{`Testing rule: ${rule.name}`}}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>

        <v-container v-if="rule.condition">
          {{rule.condition | prettifyCondition }}
        </v-container>

        <v-expansion-panel
          :value="0"
          popout
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>Custom receipt</div>
            </template>
            <v-card>
              <v-card-text>
                <v-form>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          @input="$set(receipt.header, 0, $event)"
                          label="Header"
                          prepend-icon="title"
                        ></v-text-field>
                      </v-flex>

                      <v-flex
                        xs12
                        sm6
                      >
                        <DateInput v-model="receipt.date" />
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                      >
                        <TimeInput v-model="receipt.time" />
                      </v-flex>

                      <v-flex
                        xs12
                        sm6
                        md4
                      >
                        <v-text-field
                          type="number"
                          label="Amount"
                          prepend-icon="attach_money"
                          :value="receipt.amount.value"
                          @input="receipt.amount.value = Number($event)"
                        ></v-text-field>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4
                      >
                        <CurrencyInput v-model="receipt.amount.currency" />
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4
                      >
                        <PaymentMethodInput v-model="receipt.paymentMethod" />
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                      >
                        <PlaceTypeInput
                          prepend-icon
                          @input="$set(receipt.place.types, 0, $event)"
                        />
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                      >
                        <PlaceTypeCategoryInput @input="$set(receipt.place.types, 1, findPlaceTypeForCategory($event))" />
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>Search for a sample receipt</div>
            </template>
            <v-card>
              <v-card-text>
                ...not implemented...
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-layout
          justify-center
          align-center
        >
          <transitioning-result-icon
            class="result-icon"
            :success-color="$vuetify.theme.success"
            :error-color="$vuetify.theme.error"
            :error="!result"
          />
          <span class="result-message">Receipt {{result ? 'matches' : 'does not match'}}</span>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { parseCondition } from '@dexpenses/rule-conditions';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';
import CurrencyInput from '@/components/fields/CurrencyInput.vue';
import DateInput from '@/components/fields/DateInput.vue';
import TimeInput from '@/components/fields/TimeInput.vue';
import PlaceTypeInput from '@/components/fields/PlaceTypeInput.vue';
import PlaceTypeCategoryInput from '@/components/fields/PlaceTypeCategoryInput.vue';
import TransitioningResultIcon from '@dexmo/vue-transitioning-result-icon';
import { placeTypeMappings } from '@dexpenses/core';
import { prettifyCamelCase } from '@/util/string';

function prettifyCondition(condition) {
  const [[key, value]] = Object.entries(condition);
  switch (key) {
    case '$and':
      return value.map(prettifyCondition).join(' AND ');
    case '$or':
      return `(${value.map(prettifyCondition).join(' OR ')})`;
    case '$not':
      return `not (${prettifyCondition(value)})`;
    case 'header':
      return `header includes "${value[0]}"${
        value[1] ? ' (case-sensitive)' : ''
      }`;
    case 'date':
      return `date's ${prettifyCamelCase(value[0])} ${value[1]} ${value[2]}`;
    default:
      return `${prettifyCamelCase(key)}: ${
        Array.isArray(value) ? value.join(' ') : `is ${value}`
      }`;
  }
}
export default {
  name: 'RuleTester',
  props: {
    value: Boolean,
    rule: Object,
  },
  components: {
    PaymentMethodInput,
    CurrencyInput,
    DateInput,
    TimeInput,
    PlaceTypeInput,
    PlaceTypeCategoryInput,
    TransitioningResultIcon,
  },
  data() {
    return {
      receipt: {
        header: [''],
        amount: { value: null, currency: null },
        date: null,
        time: null,
        place: { types: [null, null] },
      },
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    engine() {
      if (!this.value || !this.rule) {
        return null;
      }
      return parseCondition(this.rule.condition);
    },
    result() {
      if (!this.engine) {
        return null;
      }
      return this.engine.test(this.receipt);
    },
  },
  methods: {
    hide() {
      this.show = false;
    },
    findPlaceTypeForCategory(category) {
      return Object.entries(placeTypeMappings).find(
        ([, c]) => c === category
      )[0];
    },
  },
  filters: {
    prettifyCondition(condition) {
      return prettifyCondition(condition);
    },
  },
};
</script>
<style scoped>
.result-icon {
  width: 72px;
}
.result-message {
  margin-left: 1em;
  font-size: 1.5em;
}
</style>
