<template>
  <v-layout
    fill-height
    align-center
    justify-center
    v-if="!userData"
  >
    <v-progress-circular indeterminate />
  </v-layout>
  <v-layout
    v-else
    fill-height
    d-flex
    column
  >
    <template v-if="userData">
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
        :loading="phoneNumberLoading"
        :error-messages="phoneNumberError ? [phoneNumberError] : []"
        :value="userData.phoneNumber"
        country-prefix-hint
        @save="updatePhoneNumber"
      />

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
      phoneNumberLoading: false,
      phoneNumberError: null,
      languages,
    };
  },
  computed: {
    ...mapState(['userData', 'user']),
  },
  methods: {
    async updatePhoneNumber(phoneNumber) {
      this.phoneNumberLoading = true;
      this.phoneNumberError = null;
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(this.user.uid)
          .set(
            {
              phoneNumber: phoneNumber.trim() || null,
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
