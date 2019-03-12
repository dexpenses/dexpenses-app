<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <span>DexmoHQ</span>
          <span class="font-weight-light">DEXPENSES</span>
        </router-link>
      </v-toolbar-title>

      <v-toolbar-items v-if="user">
        <v-btn flat to="/dashboard">Dashboard
          <v-icon right>dashboard</v-icon>
        </v-btn>
        <v-btn flat to="/receipts">Receipts
          <v-icon right>receipt</v-icon>
        </v-btn>
        <v-btn flat to="/upload">Upload
          <v-icon right>cloud_upload</v-icon>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-flex v-if="user" class="pending-message">
        <span v-if="pendingReceiptsCount">
          {{pendingReceiptsCount}} receipts pending.
          <v-progress-circular indeterminate size="16" width="1"></v-progress-circular>
        </span>
        <span v-else>No receipts pending.
          <v-icon>check</v-icon>
        </span>
      </v-flex>

      <v-badge v-if="user" color="primary" left overlap>
        <span slot="badge">2</span>
        <v-btn flat icon>
          <v-icon medium>notifications</v-icon>
        </v-btn>
      </v-badge>

      <account-menu v-if="user"/>
      <v-btn v-else color="primary" @click="login">LOGIN</v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
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
    ...mapGetters(['pendingReceiptsCount']),
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
.pending-message {
  margin-right: 1em;
}
</style>
