<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>DexmoHQ</span>
        <span class="font-weight-light">DEXPENSES</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="user">
<v-menu bottom offset-y transition="slide-y-transition" >
      <template v-slot:activator="{ on }">
        <v-btn flat v-on="on">
          {{user.displayName}}
        </v-btn>
      </template>

      <v-list>
        <v-list-tile ripple @click="logout">
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
      <v-btn v-else
        color="primary"
        @click="login"
      >
        LOGIN
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapState(['user', 'keywords']),
  },
  methods: {
    ...mapActions(['checkLoggedIn', 'login', 'logout']),
  },
  created() {
    this.checkLoggedIn();
  },
  watch: {
    keywords(v) {
      console.log(v);
    },
  },
};
</script>
