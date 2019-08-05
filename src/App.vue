<template>
  <v-app>

    <v-app-bar
      app
      clipped-left
      absolute
    >
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        v-if="user"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <span>DexmoHQ</span>
          <span class="font-weight-light">DEXPENSES</span>
        </router-link>
      </v-toolbar-title>

      <template v-if="user && $vuetify.breakpoint.mdAndUp">
        <v-toolbar-items>
          <v-btn
            text
            v-for="item in items"
            :key="item.name"
            :to="item.link"
          >
            {{$t(item.name)}}
            <v-icon right>{{item.icon}}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </template>

      <v-spacer></v-spacer>

      <AccountMenu
        v-if="user"
        class="hidden-sm-and-down"
      />
      <v-btn
        v-else
        color="primary"
        @click="login"
      >LOGIN</v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      app
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item>
          <v-list-item-avatar>
            <img :src="user.photoURL">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{user.displayName}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.name"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          ripple
          to="/settings"
        >
          <v-list-item-action>
            <v-icon>settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Settings
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          ripple
          @click="logout"
        >
          <v-list-item-action>
            <v-icon>logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

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
          name: 'dashboard',
          link: '/dashboard',
          icon: 'dashboard',
        },
        {
          name: 'recurring',
          link: '/recurring',
          icon: 'payment',
        },
        {
          name: 'receipts',
          link: '/receipts',
          icon: 'receipt',
        },
        {
          name: 'rules',
          link: '/rules',
          icon: 'build',
        },
        {
          name: 'upload',
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
