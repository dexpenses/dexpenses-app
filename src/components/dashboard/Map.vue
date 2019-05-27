<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="zoom"
    map-type-id="terrain"
    style="width: 100%; height: 100%"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in receipts"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="info = m"
    />
    <GmapInfoWindow
      :options="infoOptions"
      :position="info && info.position"
      :opened="!!info"
      @closeclick="info = null"
    >
      <div
        v-if="info"
        class="receipt-info"
      >
        <span>{{info.header.join(', ')}}</span>
        <span>{{info.timestamp.value}}</span>
        <span>{{info.amount}} €</span>
      </div>
    </GmapInfoWindow>
  </GmapMap>
</template>
<script>
import GmapMap from 'vue2-google-maps/dist/components/map.vue';
import GmapMarker from 'vue2-google-maps/dist/components/marker';
import GmapInfoWindow from 'vue2-google-maps/dist/components/infoWindow.vue';
import firebase from 'firebase/app';
import { parseBigQueryGeographicPoint } from '@/util/geo';

export default {
  props: {
    center: Object,
    zoom: {
      type: Number,
      default: 12,
    },
  },
  components: {
    GmapMap,
    GmapMarker,
    GmapInfoWindow,
  },
  data() {
    return {
      receipts: [],
      info: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
  },
  async mounted() {
    const map = await this.$refs.map.$mapPromise;
    map.addListener('bounds_changed', async () => {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const { data } = await firebase
        .functions()
        .httpsCallable('findByBoundingBox')({
        southWest: {
          lng: sw.lng(),
          lat: sw.lat(),
        },
        northEast: {
          lng: ne.lng(),
          lat: ne.lat(),
        },
      });
      this.receipts = data.map(r => ({
        ...r,
        position: parseBigQueryGeographicPoint(r.location),
      }));
    });
  },
};
</script>
<style scoped>
.receipt-info {
  display: flex;
  flex-direction: column;
}
</style>