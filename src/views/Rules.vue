<template>
  <v-container fluid>
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
        :disabled="locked"
        :loading="loading"
      ></v-select>
      <v-btn
        color="primary"
        @click="addNewRule"
        :disabled="locked"
      >New Rule</v-btn>
    </v-layout>
    <v-container v-if="!rules.length && !newRule">
      <v-alert
        v-if="!loading"
        :value="true"
        color="info"
        icon="info"
        outline
      >
        Looks like you don't have any rules so far. Go ahead and create one!
      </v-alert>
    </v-container>
    <div v-else>
      <Rule
        :value="selectedRule"
        @lock-changed="locked = $event"
        @saved-new="selectById"
        @discard-new="newRule = null; selected = rules.length - 1"
      />
    </div>
  </v-container>
</template>
<script>
import Rule from '@/components/rules/Rule.vue';

import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapState } = createNamespacedHelpers('rules');

export default {
  name: 'Rules',
  components: {
    Rule,
  },
  data() {
    return {
      locked: false,
      newRule: null,
      selected: 0,
    };
  },
  computed: {
    ...mapState(['rules', 'loading']),
    selectableRules() {
      const selectable = this.rules.map((rule, index) => ({
        name: rule.name,
        index,
      }));
      if (this.newRule) {
        selectable.push({
          name: this.newRule.name,
          index: selectable.length,
        });
      }
      return selectable;
    },
    selectedRule() {
      return this.newRule ? this.newRule : this.rules[this.selected];
    },
  },
  methods: {
    ...mapActions(['loadRules', 'unbindRules']),
    addNewRule() {
      this.newRule = {
        name: `Anonymous rule #${this.rules.length}`,
        description: '',
        condition: {
          $and: [],
        },
        tags: [],
      };
      this.selected = this.selectableRules.length - 1;
    },
    selectById(id) {
      console.log('@savedNew', id);
      this.newRule = null;
      this.selected = 0; // todo find by id
    },
  },
  async created() {
    await this.loadRules();
    if (this.rules.length) {
      this.selected = 0;
    }
  },
  destroyed() {
    this.unbindRules();
  },
};
</script>
