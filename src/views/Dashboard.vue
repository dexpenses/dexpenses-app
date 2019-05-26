<template>
  <div>
    <GridLayout
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
  </div>
</template>
<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import ExpensesOverTime from '@/components/dashboard/ExpensesOverTime.vue';
import TagCloud from '@/components/dashboard/TagCloud.vue';
import DoughnutAggregation from '@/components/dashboard/DoughnutAggregation.vue';
import Map from '@/components/dashboard/Map.vue';
import Kpi from '@/components/dashboard/Kpi.vue';
import { DateTime } from 'luxon';

const firstOfMonth = DateTime.local()
  .set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
  .toSQLDate();

const testLayout = [
  {
    x: 0,
    y: 0,
    w: 3,
    h: 2,
    i: '0',
    component: 'Kpi',
    props: { title: 'Overall total', func: 'aggregateTotal' },
  },
  {
    x: 3,
    y: 0,
    w: 3,
    h: 2,
    i: '1',
    component: 'Kpi',
    props: {
      title: 'Current month',
      func: 'aggregateTotal',
      data: { start: firstOfMonth },
    },
  },
  { x: 6, y: 0, w: 3, h: 2, i: '2', component: 'TagCloud' },
  {
    x: 9,
    y: 0,
    w: 3,
    h: 2,
    i: '3',
    component: 'DoughnutAggregation',
    props: { func: 'aggregateByPaymentMethod' },
  },
  {
    x: 0,
    y: 3,
    w: 6,
    h: 3,
    i: '6',
    component: 'ExpensesOverTime',
  },
  {
    x: 6,
    y: 3,
    w: 6,
    h: 3,
    i: '7',
    component: 'Map',
    props: { center: { lat: 52.427547, lng: 10.78042 } },
  },
];

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
      layout: testLayout,
      editing: false,
    };
  },
  methods: {
    layoutUpdated(e) {
      console.log(JSON.stringify(e));
      // console.log(JSON.stringify(this.layout));
    },
  },
};
</script>
<style scoped>
.dashboard-item > div {
  height: 100%;
}
</style>
