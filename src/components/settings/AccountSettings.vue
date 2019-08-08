<template>
  <v-row
    class="fill-height"
    align="center"
    justify="center"
    v-if="!userData"
  >
    <v-progress-circular indeterminate />
  </v-row>
  <v-container
    class="fill-height d-flex"
    v-else
  >
    <v-col v-if="userData">
      <v-banner
        :value="!userData.phoneNumber && showBanner"
        icon="info"
        icon-color="primary"
        elevation="2"
      >
        You can help us better read your receipt by providing your phone number.
        <template v-slot:actions>
          <v-btn
            text
            color="primary"
            @click="$refs.phoneNumberInput.focus(); showBanner = false;"
          >Fill</v-btn>
          <v-btn
            text
            color="primary"
            @click="showBanner = false"
          >Dismiss</v-btn>
        </template>
      </v-banner>
      <v-subheader class="subheader">
        <v-icon>language</v-icon>
        <span>
          {{$t('language')}}
        </span>
      </v-subheader>
      <v-radio-group
        :value="userData.preferredLang || 'en'"
        @change="$i18n.setLanguageAsync($event)"
        mandatory
      >
        <v-radio
          v-for="(name, lang) in languages"
          :key="lang"
          :label="name"
          :value="lang"
        ></v-radio>
      </v-radio-group>

      <v-subheader class="subheader">
        <v-icon>phone</v-icon>
        <span>{{$t('phoneNumber')}}</span>
      </v-subheader>

      <PhoneNumberInput
        ref="phoneNumberInput"
        v-model="phoneNumber"
        :loading="phoneNumberLoading"
        :error-messages="phoneNumberError ? [phoneNumberError] : []"
        country-prefix-hint
      >
        <template v-slot:append="{valid}">
          <v-icon
            v-if="phoneNumber !== userData.phoneNumber"
            @click="phoneNumber = userData.phoneNumber"
          >clear</v-icon>
          <v-icon
            v-if="phoneNumber !== userData.phoneNumber && valid"
            @click="updatePhoneNumber"
          >save</v-icon>
        </template>
      </PhoneNumberInput>

      <v-subheader class="subheader">
        <v-icon>home</v-icon>
        <span v-t="'homeAddress'"></span>
      </v-subheader>
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
        :options="$vuetify.theme.dark ? darkMapOptions : {}"
        style="width: 400px; height: 400px"
      >
        <GmapMarker
          :position="userData.homeLocation"
          :clickable="true"
          :draggable="true"
        />
      </GmapMap>
    </v-col>
  </v-container>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import GmapMap from 'vue2-google-maps/dist/components/map.vue';
import GmapMarker from 'vue2-google-maps/dist/components/marker';
import firebase from 'firebase/app';
import GmapAutocomplete from '@/components/GmapAutocomplete.vue';
import PhoneNumberInput from '@/components/fields/PhoneNumberInput.vue';
import languages from '@/i18n/langs';

const { mapState } = createNamespacedHelpers('user');

export default {
  name: 'AccountSettings',
  components: {
    PhoneNumberInput,
    GmapMap,
    GmapMarker,
    GmapAutocomplete,
  },
  data() {
    return {
      phoneNumber: '',
      phoneNumberLoading: false,
      phoneNumberError: null,
      languages,
      showBanner: true,
      darkMapOptions: {
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242f3e' }],
          },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['userData', 'user']),
  },
  watch: {
    userData(v) {
      this.phoneNumber = v.phoneNumber;
    },
  },
  methods: {
    async updatePhoneNumber() {
      this.phoneNumberLoading = true;
      this.phoneNumberError = null;
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(this.user.uid)
          .set(
            {
              phoneNumber: this.phoneNumber.trim() || null,
            },
            { merge: true }
          );
      } catch {
        this.phoneNumberError = 'Save failed.';
      } finally {
        this.phoneNumberLoading = false;
      }
    },
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
<style scoped>
.subheader > *:not(:first-child) {
  margin-left: 0.7em;
}
</style>
