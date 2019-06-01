<template>
  <GridLayout
    v-if="layout"
    :layout.sync="layout"
    :use-css-transforms="true"
    :is-draggable="editing"
    :is-resizable="editing"
    :responsive="true"
    :col-num="12"
    @layout-updated="layoutUpdated"
  >
    <GridItem
      class="dashboard-item"
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
    >
      <component
        :is="item.component"
        v-bind="item.props"
      />
    </GridItem>
  </GridLayout>
  <div
    class="loading-container"
    v-else
  >
    <span>Loading dashboard...</span>
    <v-progress-circular
      indeterminate
      size="64"
    ></v-progress-circular>
  </div>
</template>
<script>
import firebase from 'firebase/app';
import { mapActions } from 'vuex';
import { GridLayout, GridItem } from 'vue-grid-layout';
import ExpensesOverTime from '@/components/dashboard/ExpensesOverTime.vue';
import TagCloud from '@/components/dashboard/TagCloud.vue';
import DoughnutAggregation from '@/components/dashboard/DoughnutAggregation.vue';
import Map from '@/components/dashboard/Map.vue';
import Kpi from '@/components/dashboard/Kpi.vue';
import defaultLayout from '@/components/dashboard/default-layout';
import { parseLayout } from '@/util/dashboard';

export default {
  name: 'Dashboard',
  components: {
    GridLayout,
    GridItem,
    ExpensesOverTime,
    TagCloud,
    DoughnutAggregation,
    Map,
    Kpi,
  },
  data() {
    return {
      layout: null,
      editing: false,
    };
  },
  methods: {
    ...mapActions(['user/checkLoggedIn']),
    layoutUpdated(e) {
      console.log(e);
    },
  },
  async mounted() {
    const user = await this['user/checkLoggedIn']();
    const ref = await firebase
      .firestore()
      .doc(`dashboardsByUser/${user.uid}/dashboards/default`)
      .get();
    let layout;
    if (!ref.exists) {
      layout = defaultLayout;
    } else {
      ({ layout } = ref.data());
    }
    this.layout = parseLayout(layout);
  },
};
</script>
<style scoped>
.dashboard-item > div {
  height: 100%;
}
.loading-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.loading-container span {
  margin: 1em;
  font-size: 1.5em;
}
</style>
