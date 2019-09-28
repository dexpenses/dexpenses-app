<template>
  <vue-word-cloud
    v-if="tags"
    :words="tags"
    :color="([, weight]) => weight >= top3Threshold ? 'Black' : weight >= top10Threshold ? 'DarkGray' : 'Gray'"
    font-family="Roboto"
  >
    <template slot-scope="{text, weight}">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <div
            style="cursor: pointer;"
            v-on="on"
          >
            {{ text }}
          </div>
        </template>
        <span>{{nf.format(weight)}}</span>
      </v-tooltip>
    </template>
  </vue-word-cloud>
</template>

<script>
import firebase from 'firebase/app';
import VueWordCloud from 'vuewordcloud';
import FormattableMixin from './FormattableMixin';

export default {
  mixins: [FormattableMixin],
  components: {
    VueWordCloud,
  },
  data() {
    return {
      tags: null,
      top3Threshold: null,
      top10Threshold: null,
    };
  },
  async mounted() {
    const { data } = await firebase.functions().httpsCallable('query')({
      name: 'groupByTags',
    });
    this.tags = data.map(({ key, value }) => [key, value]);
    this.top3Threshold = data[2] ? data[2].value : 0;
    this.top10Threshold = data[9] ? data[9].value : 0;
  },
};
</script>
