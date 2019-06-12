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
      <v-card
        flat
        height="100%"
      >
        <v-card-text>
          <AccountSettings />
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-2">
      <v-card
        flat
        height="100%"
      >
        <v-card-text>
          <v-layout fill-height>
            tab 2
          </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-3">
      <v-card
        flat
        height="100%"
      >
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
import AccountSettings from '@/components/settings/AccountSettings.vue';

export default {
  name: 'Settings',
  components: {
    AccountSettings,
  },
};
</script>
<style>
.v-tabs {
  min-height: 100%;
}
.v-tabs .v-window {
  min-height: calc(100% - 72px);
  height: calc(100% - 72px);
}
</style>
