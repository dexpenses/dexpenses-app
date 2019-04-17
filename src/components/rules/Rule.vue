<template>
  <v-container>
    <v-subheader>Rule info</v-subheader>
    <v-text-field
      ref="nameField"
      label="Name"
      v-model="rule.name"
    ></v-text-field>
    <v-textarea
      label="Description"
      v-model="rule.description"
    ></v-textarea>
    <v-subheader>Conditions</v-subheader>
    <Condition v-model="rule.condition" />
    <v-subheader>Tags</v-subheader>
    <v-container class="tags">
      <v-chip
        close
        @input="rule.tags.splice(i, 1)"
        v-for="(tag, i) in rule.tags"
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
        @click="save"
        :loading="saving"
      >Save</v-btn>
      <v-btn
        color="error"
        :disabled="!anyChanges"
        @click="discard"
      >Discard</v-btn>
      <RuleTester
        v-model="testingRule"
        :rule="rule"
      />
      <v-btn>
        <v-icon left>play_arrow</v-icon>
        Run
      </v-btn>
    </v-layout>
  </v-container>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import actualDeepEqual from 'deep-equal';
import Condition from '@/components/rules/Condition.vue';
import RuleTester from '@/components/rules/RuleTester.vue';

const { mapGetters } = createNamespacedHelpers('rules');

function cloneRule(rule) {
  const clone = JSON.parse(JSON.stringify(rule));
  if (clone.last_updated) {
    clone.last_updated = new Date(rule.last_updated.toDate());
  }
  return clone;
}

function deepEqual(left, right) {
  return (
    left.name === right.name &&
    ((!left.description && !right.description) ||
      left.description === right.description) &&
    actualDeepEqual(left.condition, right.condition) &&
    actualDeepEqual(left.tags, right.tags)
  );
}

export default {
  name: 'Rule',
  props: {
    value: Object,
  },
  components: {
    Condition,
    RuleTester,
  },
  data() {
    return {
      ruleId: this.value.id,
      rule: cloneRule(this.value),
      savedState: cloneRule(this.value),
      newTag: '',
      testingRule: false,
      saving: false,
    };
  },
  computed: {
    ...mapGetters(['rulesRef']),
    isNewRule() {
      return !this.ruleId;
    },
    anyChanges() {
      console.log(this.rule, this.savedState);
      return !this.ruleId || !deepEqual(this.rule, this.savedState);
    },
  },
  watch: {
    anyChanges(v) {
      this.$emit('lock-changed', v);
    },
    value(newValue) {
      if (!newValue) {
        return;
      }
      // TODO: what if we're not saving?
      console.log('Rule.vue received new value');
      this.saving = false;

      this.ruleId = newValue.id;
      this.rule = cloneRule(newValue);
      this.savedState = cloneRule(newValue);
      if (!this.ruleId) {
        this.$emit('lock-changed', true);
      }
    },
  },
  methods: {
    addTag() {
      if (!this.newTag) {
        return;
      }
      if (!this.rule.tags.includes(this.newTag)) {
        this.rule.tags.push(this.newTag);
      }
      this.newTag = '';
    },
    async save() {
      console.log('saving...', this.ruleId, this.rule);
      this.saving = true;
      const rule = cloneRule(this.rule);
      rule.last_updated = new Date();
      if (this.ruleId) {
        await this.rulesRef.doc(this.ruleId).set(rule);
      } else {
        const { id } = await this.rulesRef.add(rule);
        this.$emit('saved-new', id);
      }
      // TODO: poststuff
      console.log('saved!');
    },
    discard() {
      if (this.isNewRule) {
        this.$emit('discard-new');
        return;
      }
      this.rule = cloneRule(this.savedState);
      // TODO: what about remote changes?
    },
  },
  created() {
    if (!this.ruleId) {
      this.$emit('lock-changed', true);
    }
  },
  mounted() {
    this.$refs.nameField.focus();
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
