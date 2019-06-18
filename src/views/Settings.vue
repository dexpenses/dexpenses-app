<template>
  <v-tabs
    centered
    icons-and-text
  >
    <v-tabs-slider></v-tabs-slider>

    <v-tab
      v-for="tab in tabs"
      :key="tab.name"
      :href="`#tab-${tab.name}`"
    >
      {{$t(tab.name)}}
      <v-icon>{{tab.icon}}</v-icon>
    </v-tab>

    <v-tab-item
      v-for="tab in tabs"
      :key="tab.name"
      :value="`tab-${tab.name}`"
    >
      <v-card
        flat
        height="100%"
      >
        <v-card-text>
          <component
            :is="tab.component"
            v-if="tab.component"
          />
          <span v-else>test</span>
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
  data() {
    return {
      tabs: [
        {
          name: 'account',
          icon: 'account_circle',
          component: 'AccountSettings',
        },
        { name: 'favorites', icon: 'favorite' },
        { name: 'nearby', icon: 'account_box' },
      ],
    };
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
