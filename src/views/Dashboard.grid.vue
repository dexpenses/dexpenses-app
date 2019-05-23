<template>
  <div>
    <!-- <GridLayout
      :layout.sync="layout"
      :use-css-transforms="true"
      :is-draggable="true"
      :is-resizable="true"
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
        <v-chart :options="polar" />
      </GridItem>
    </GridLayout> -->
    <!-- <v-chart :options="polar" /> -->
    <LineChart />
  </div>
</template>
<script>
// import { GridLayout, GridItem } from 'vue-grid-layout';
// import Line from './Line.vue';
import BarChart from '@/components/dashboard/BarChart.vue';

const testLayout = [
  { x: 0, y: 0, w: 3, h: 2, i: '0' },
  { x: 3, y: 0, w: 3, h: 2, i: '1' },
  { x: 6, y: 0, w: 3, h: 2, i: '2' },
  { x: 9, y: 0, w: 3, h: 2, i: '3' },
  { x: 0, y: 3, w: 6, h: 3, i: '6' },
  { x: 6, y: 3, w: 6, h: 3, i: '7' },
  // { x: 4, y: 5, w: 2, h: 5, i: '8' },
  // { x: 6, y: 4, w: 2, h: 4, i: '9' },
  // { x: 8, y: 4, w: 2, h: 4, i: '10' },
];

export default {
  name: 'Dashboard',
  components: {
    BarChart,
  },
  data() {
    const data = [];

    for (let i = 0; i <= 360; i += 1) {
      const t = (i / 180) * Math.PI;
      const r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }
    return {
      layout: testLayout,
      polar: {
        title: {
          text: '极坐标双数值轴',
        },
        legend: {
          data: ['line'],
        },
        polar: {
          center: ['50%', '54%'],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        angleAxis: {
          type: 'value',
          startAngle: 0,
        },
        radiusAxis: {
          min: 0,
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data,
          },
        ],
        animationDuration: 2000,
      },
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
.dashboard-item {
  border: 2px solid black;
}
</style>
<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
/* .echarts{
  width: 100%;
  height: 100%;
} */
</style>
