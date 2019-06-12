<template>
  <v-menu
    bottom
    offset-y
    transition="slide-y-transition"
  >
    <v-btn
      fab
      icon
      slot="activator"
    >
      <v-avatar>
        <img :src="user.photoURL" />
      </v-avatar>
    </v-btn>
    <v-list>
      <v-list-tile>
        <v-list-tile-title>
          {{user.displayName}}
        </v-list-tile-title>
      </v-list-tile>

      <v-list-tile
        ripple
        to="/settings"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            Settings
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile
        ripple
        @click="logout"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            Logout
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>logout</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('user');

export default {
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['logout']),
    openSettings() {},
  },
};
</script>
