<template>
  <div>
    <span v-if="!searchClient">Loading...</span>
    <v-container v-else>
      <AisInstantSearch
        :search-client="searchClient"
        :index-name="index"
      >
        <v-row>
          <v-col class="grow">
            <AisSearchBox
              autofocus
              show-loading-indicator
            >
              <template slot-scope="{currentRefinement, isSearchStalled, refine}">
                <v-text-field
                  placeholder="Search for receipts"
                  prepend-inner-icon="search"
                  solo
                  :value="currentRefinement"
                  :loading="isSearchStalled"
                  @input="refine"
                >
                  <AisPoweredBy slot="append" />
                </v-text-field>
              </template>

            </AisSearchBox>
          </v-col>
        </v-row>
        <AisHits class="hits">
          <template slot-scope="{ items }">
            <ReceiptCard
              v-for="item in items"
              :key="item.objectID"
              :receipt="item"
            />

            <!-- <AisHighlight
              v-for="header in item._highlightResult.result.data.header"
              :key="header.value"
              attribute="header"
              :hit="{ _highlightResult: { header } }"
            /> -->
          </template>
        </AisHits>
      </AisInstantSearch>
    </v-container>
  </div>
</template>
<script>
import firebase from 'firebase/app';
import algoliasearch from 'algoliasearch/lite';
import {
  AisInstantSearch,
  AisSearchBox,
  AisPoweredBy,
  AisHits,
  // AisHighlight,
} from 'vue-instantsearch';
import ReceiptCard from '@/components/receipts/ReceiptCard.vue';
import 'instantsearch.css/themes/algolia-min.css';

export default {
  components: {
    AisInstantSearch,
    AisSearchBox,
    AisPoweredBy,
    AisHits,
    ReceiptCard,
    // AisHighlight,
  },
  data() {
    return { searchClient: null, index: process.env.VUE_APP_ALGOLIA_INDEX };
  },
  async created() {
    const res = await firebase.functions().httpsCallable('getSearchApiKey')();
    const apiKey = res.data;

    this.searchClient = algoliasearch(
      process.env.VUE_APP_ALGOLIA_APPID,
      apiKey
    );
  },
};
</script>
<style scoped>
.hits {
  padding: 1em;
}
</style>
