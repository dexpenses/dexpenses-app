<template>
  <v-app>

    <v-toolbar
      app
      clipped-left
      absolute
    >
      <v-toolbar-side-icon
        class="hidden-sm-and-up"
        v-if="user"
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <span>DexmoHQ</span>
          <span class="font-weight-light">DEXPENSES</span>
        </router-link>
      </v-toolbar-title>

      <v-toolbar-items
        v-if="user"
        class="hidden-sm-and-down"
      >
        <v-btn
          flat
          v-for="item in items"
          :key="item.name"
          :to="item.link"
        >
          {{item.name}}
          <v-icon right>{{item.icon}}</v-icon>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <!-- <v-flex
        v-if="user"
        class="pending-message hidden-sm-and-down"
      >
        <span v-if="pendingReceiptsCount">
          {{pendingReceiptsCount}} receipts pending.
          <v-progress-circular
            indeterminate
            size="16"
            width="1"
          ></v-progress-circular>
        </span>
        <span v-else>No receipts pending.
          <v-icon>check</v-icon>
        </span>
      </v-flex> -->

      <account-menu
        v-if="user"
        class="hidden-sm-and-down"
      />
      <v-btn
        v-else
        color="primary"
        @click="login"
      >LOGIN</v-btn>
    </v-toolbar>

    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="user.photoURL">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{user.displayName}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list
        class="pt-0"
        dense
      >
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.name"
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile
          ripple
          to="/settings"
        >
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Settings
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          ripple
          @click="logout"
        >
          <v-list-tile-action>
            <v-icon>logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Logout
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view />
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
      drawer: false,
      items: [
        {
          name: 'Dashboard',
          link: '/dashboard',
          icon: 'dashboard',
        },
        {
          name: 'Recurring',
          link: '/recurring',
          icon: 'payment',
        },
        {
          name: 'Receipts',
          link: '/receipts',
          icon: 'receipt',
        },
        {
          name: 'Rules',
          link: '/rules',
          icon: 'build',
        },
        {
          name: 'Upload',
          link: '/upload',
          icon: 'cloud_upload',
        },
      ],
    };
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('receipts', ['pendingReceiptsCount']),
  },
  methods: {
    ...mapActions('user', ['checkLoggedIn', 'login', 'logout']),
  },
  created() {
    this.checkLoggedIn();
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
