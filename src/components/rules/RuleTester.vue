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
    <v-card>
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
                          label="Amount"
                          prepend-icon="attach_money"
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

        <v-layout justify-center>
          <transitioning-result-icon
            class="result-icon"
            :success-color="$vuetify.theme.success"
            :error-color="$vuetify.theme.error"
            :error="!result"
          />
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
import TransitioningResultIcon from '@dexmo/vue-transitioning-result-icon';

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
    TransitioningResultIcon,
  },
  data() {
    return {
      show: this.value,
      receipt: { header: [''], amount: {}, date: null, time: null },
    };
  },
  computed: {
    engine() {
      if (!this.rule) {
        return null;
      }
      return parseCondition(this.rule.condition);
    },
    result() {
      return this.engine.test(this.receipt);
    },
  },
  watch: {
    value(v) {
      this.show = v;
    },
  },
  methods: {
    test() {
      const engine = parseCondition(this.rule.condition);
      console.log(engine);
      console.log(engine.test(this.receipt));
    },
    hide() {
      this.show = false;
      this.$emit('input', false);
    },
  },
};
</script>
<style scoped>
.result-icon {
  width: 72px;
}
</style>
