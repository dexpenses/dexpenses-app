<template>
  <v-container>
    <v-layout row>
      <v-select
        v-model="selected"
        :items="selectableRules"
        item-text="name"
        item-value="index"
        menu-props="auto"
        label="Select"
        hide-details
        single-line
      ></v-select>
      <v-btn
        color="primary"
        @click="addNewRule"
      >New Rule</v-btn>
    </v-layout>
    <v-container>
      <v-subheader>Rule info</v-subheader>
      <v-text-field
        ref="nameField"
        label="Name"
        v-model="rules[selected].name"
      ></v-text-field>
      <v-textarea
        label="Description"
        v-model="rules[selected].description"
      ></v-textarea>
      <v-subheader>Conditions</v-subheader>
      <Condition v-model="rules[selected].condition" />
      <v-subheader>Tags</v-subheader>
      <v-container class="tags">
        <v-chip
          close
          @input="rules[selected].tags.splice(i, 1)"
          v-for="(tag, i) in rules[selected].tags"
          :key="i"
        >{{tag}}</v-chip>
        <input
          class="input-add-tag"
          type="text"
          v-model="newTag"
          placeholder="Type and enter for new tag"
          @keyup.enter="addTag"
        >
      </v-container>
      <v-layout row>
        <v-btn
          color="primary"
          :disabled="!anyChanges"
        >Save</v-btn>
        <v-btn
          color="error"
          :disabled="!anyChanges"
          @click="discard"
        >Discard</v-btn>
        <RuleTester
          v-model="testingRule"
          :rule="rules[selected]"
        />
        <v-btn>
          <v-icon left>play_arrow</v-icon>
          Run
        </v-btn>
      </v-layout>
    </v-container>
    <div>
      {{rules[selected]}}
    </div>
  </v-container>
</template>
<script>
import deepEqual from 'deep-equal';
import Condition from '@/components/rules/Condition.vue';
import RuleTester from '@/components/rules/RuleTester.vue';

export default {
  name: 'Rules',
  components: {
    Condition,
    RuleTester,
  },
  computed: {
    selectableRules() {
      return this.rules.map((rule, index) => ({
        name: rule.name,
        index,
      }));
    },
    anyChanges() {
      return !deepEqual(
        this.rules[this.selected],
        this.$lastSavedState[this.selected]
      );
    },
  },
  methods: {
    addNewRule() {
      this.rules.push({
        name: `Anonymous rule #${this.rules.length}`,
        condition: {
          $and: [],
        },
        tags: [],
      });
      this.selected = this.rules.length - 1;
      this.$refs.nameField.focus();
    },
    addTag() {
      if (!this.newTag) {
        return;
      }
      if (!this.rules[this.selected].tags.includes(this.newTag)) {
        this.rules[this.selected].tags.push(this.newTag);
      }
      this.newTag = '';
    },
    discard() {
      this.$set(this.rules, this.selected, this.$lastSavedState[this.selected]);
    },
  },
  created() {
    this.$lastSavedState = JSON.parse(JSON.stringify(this.rules));
  },
  data() {
    return {
      selected: 1,
      newTag: '',
      $lastSavedState: [],
      testingRule: false,
      rules: [
        {
          name: 'Simple header',
          condition: {
            header: ['markt', true],
          },
          tags: ['markt', 'header'],
        },
        {
          name: 'Simple header or payment method',
          condition: {
            $or: [
              {
                paymentMethod: 'DEBIT',
              },
              {
                header: ['markt', true],
              },
            ],
          },
          tags: ['markt', 'header', 'EC'],
        },
        {
          name: 'All conditions included',
          condition: {
            $and: [
              {
                header: ['markt', true],
              },
              {
                amount: ['<', 10],
              },
              {
                currency: 'EUR',
              },
              {
                $or: [
                  {
                    date: ['weekday', '==', 6],
                  },
                  {
                    date: ['weekday', '==', 7],
                  },
                ],
              },
              {
                $not: {
                  paymentMethod: 'DEBIT',
                },
              },
              {
                time: ['after', '16:00'],
              },
            ],
          },
          tags: ['tag'],
        },
      ],
    };
  },
};
</script>
<style scoped>
.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.input-add-tag {
  height: 2em;
  outline: none;
  flex-grow: 1;
  width: 180px;
  padding: 0.3em;
  /* border: 1px solid red; */
}
</style>
