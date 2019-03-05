<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
        <span>DexmoHQ</span>
        <span class="font-weight-light">DEXPENSES</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/dashboard">
          Dashboard
          <v-icon right>dashboard</v-icon>
        </v-btn>
        <v-btn flat to="receipts">
          Receipts
          <v-icon right>receipt</v-icon>
        </v-btn>
      </v-toolbar-items>
      <account-menu v-if="user"/>
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
import AccountMenu from '@/components/AccountMenu.vue';

export default {
  name: 'App',
  components: {
    AccountMenu,
  },
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapState(['user']),
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
<style scoped>
.headline a {
  text-decoration: none !important;
  color: unset !important;
}
</style>
