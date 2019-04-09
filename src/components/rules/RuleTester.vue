<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on">
        <v-icon left>build</v-icon>
        Test
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex
              xs12
              sm6
              md4
            >
              <v-text-field
                label="Legal first name*"
                required
              ></v-text-field>
            </v-flex>
            <v-flex
              xs12
              sm6
              md4
            >
              <v-text-field
                label="Legal middle name"
                hint="example of helper text only on focus"
              ></v-text-field>
            </v-flex>
            <v-flex
              xs12
              sm6
              md4
            >
              <v-text-field
                label="Legal last name*"
                hint="example of persistent helper text"
                persistent-hint
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Email*"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Password*"
                type="password"
                required
              ></v-text-field>
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-select
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Age*"
                required
              ></v-select>
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-autocomplete
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                label="Interests"
                multiple
              ></v-autocomplete>
            </v-flex>
            <v-textarea v-model="receiptJson"></v-textarea>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat
          @click="test"
        >Go!</v-btn>
        <v-btn
          color="blue darken-1"
          flat
          @click="hide"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { parseCondition } from '@dexmo/dexpenses-rule-conditions';

export default {
  name: 'RuleTester',
  props: {
    value: Boolean,
    condition: Object,
  },
  data() {
    return {
      show: this.value,
      receiptJson: '',
    };
  },
  watch: {
    value(v) {
      this.show = v;
    },
  },
  methods: {
    test() {
      const engine = parseCondition(this.condition);
      console.log(engine);
      console.log(engine.test(JSON.parse(this.receiptJson)));
    },
    hide() {
      this.show = false;
      this.$emit('input', false);
    },
  },
};
</script>
