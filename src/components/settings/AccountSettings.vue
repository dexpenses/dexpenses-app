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
        @change="changeLanguage"
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
        :options="gmapOptions"
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
import gmapDarkTheme from '@/components/gmap-dark-theme';

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
    };
  },
  computed: {
    ...mapState(['userData', 'user']),
    gmapOptions() {
      if (this.$vuetify.theme.isDark) {
        return { styles: gmapDarkTheme };
      }
      return { styles: [] };
    },
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
    async changeLanguage($event) {
      await this.$i18n.setLanguageAsync($event);
      await firebase
        .firestore()
        .collection('users')
        .doc(this.user.uid)
        .set(
          {
            preferredLang: $event,
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
