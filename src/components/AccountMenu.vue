<template>
  <v-menu
    bottom
    offset-y
    transition="slide-y-transition"
  >
    <template v-slot:activator="{on}">
      <v-btn
        fab
        icon
      >
        <v-avatar v-on="on">
          <img :src="user.photoURL" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item>
        <v-list-item-title>
          {{user.displayName}}
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        ripple
        to="/settings"
      >
        <v-list-item-content>
          <v-list-item-title>
            Settings
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>settings</v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-list-item>
        <v-list-item-action>
          <v-switch
            color="primary"
            :input-value="$vuetify.theme.isDark"
            @change="$store.dispatch('localSettings/setDarkTheme',{dark:!!$event,$vuetify})"
          ></v-switch>
        </v-list-item-action>
        <v-list-item-title>Dark mode</v-list-item-title>
      </v-list-item>

      <v-list-item
        ripple
        @click="logout({$router})"
      >
        <v-list-item-content>
          <v-list-item-title>
            Logout
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>logout</v-icon>
        </v-list-item-action>
      </v-list-item>
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
  },
};
</script>
