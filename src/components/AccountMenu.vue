<template>
   <v-menu bottom offset-y transition="slide-y-transition">
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
<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>
