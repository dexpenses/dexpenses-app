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
      <v-subheader>Phone Number</v-subheader>

      <PhoneNumberInput
        ref="phoneNumberInput"
        :append-icon="phoneNumberSavable() ? 'save' : null"
        @click:append="updatePhoneNumber"
        :loading="phoneNumberLoading"
        :error-messages="phoneNumberError ? [phoneNumberError] : []"
        :value="userData.phoneNumber"
        @input="phoneNumber = $event"
        country-prefix-hint
      />

      <v-subheader>Home Address</v-subheader>
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
import GmapAutocomplete from '@/components/GmapAutocomplete.vue';
import firebase from 'firebase/app';
import PhoneNumberInput from '@/components/fields/PhoneNumberInput.vue';

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
      phoneNumber: null,
      phoneNumberLoading: false,
      phoneNumberError: null,
    };
  },
  computed: {
    ...mapState(['userData', 'user']),
  },
  methods: {
    phoneNumberSavable() {
      if (this.phoneNumber === null) {
        return false;
      }
      if (!this.userData.phoneNumber && !this.phoneNumber) {
        return false;
      }
      return (
        this.userData.phoneNumber !== this.phoneNumber &&
        this.$refs.phoneNumberInput &&
        this.$refs.phoneNumberInput.valid
      );
    },
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
