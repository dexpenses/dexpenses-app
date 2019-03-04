<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>DexmoHQ</span>
        <span class="font-weight-light">DEXPENSES</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <account-menu v-show="user"/>
      <v-btn v-show="!user"
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
