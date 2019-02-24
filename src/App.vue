<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>DexmoHQ</span>
        <span class="font-weight-light">DEXPENSES</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2" v-if="user">{{ user.displayName }}</span>
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
    ...mapActions(['ensureLoggedIn']),
  },
  created() {
    this.ensureLoggedIn();
  },
  watch: {
    keywords(v) {
      console.log(v);
    },
  },
};
</script>
