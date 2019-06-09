<template>
  <v-tabs
    centered
    icons-and-text
  >
    <v-tabs-slider></v-tabs-slider>

    <v-tab href="#tab-1">
      Account
      <v-icon>account_circle</v-icon>
    </v-tab>

    <v-tab href="#tab-2">
      Favorites
      <v-icon>favorite</v-icon>
    </v-tab>

    <v-tab href="#tab-3">
      Nearby
      <v-icon>account_box</v-icon>
    </v-tab>

    <v-tab-item value="tab-1">
      <v-card flat>
        <v-card-text>
          <v-layout
            fill-height
            d-flex
            column
          >
            <v-subheader>Home Address</v-subheader>
            <template v-if="userData">
              <GmapAutocomplete
                :value="userData.homeLocation ? userData.homeLocation.text : ''"
                solo
                clearable
                @place_changed="updateHomeLocation"
              />

              <GmapMap
                v-if="userData.homeLocation"
                ref="map"
                :center="userData.homeLocation"
                :zoom="15"
                map-type-id="terrain"
                style="width: 400px; height: 400px"
              >
                <GmapMarker
                  :position="userData.homeLocation"
                  :clickable="true"
                  :draggable="true"
                />
              </GmapMap>
            </template>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-2">
      <v-card flat>
        <v-card-text>
          <v-layout fill-height>
            tab 2
          </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-3">
      <v-card flat>
        <v-card-text>
          <v-layout fill-height>
            tab 3
          </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import GmapMap from 'vue2-google-maps/dist/components/map.vue';
import GmapMarker from 'vue2-google-maps/dist/components/marker';
import GmapAutocomplete from '@/components/GmapAutocomplete.vue';
import firebase from 'firebase/app';

const { mapState } = createNamespacedHelpers('user');

export default {
  name: 'Settings',
  components: {
    GmapMap,
    GmapMarker,
    GmapAutocomplete,
  },
  computed: {
    ...mapState(['userData', 'user']),
  },
  methods: {
    async updateHomeLocation(e) {
      const currentHome = this.userData.homeLocation;
      const lat = e.geometry.location.lat();
      const lng = e.geometry.location.lng();
      if (currentHome && currentHome.lat === lat && currentHome.lng === lng) {
        return;
      }
      await firebase
        .firestore()
        .collection('users')
        .doc(this.user.uid)
        .set(
          {
            homeLocation: {
              text: e.formatted_address,
              lat,
              lng,
            },
          },
          { merge: true }
        );
    },
  },
};
</script>
