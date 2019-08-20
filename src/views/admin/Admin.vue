<template>
  <v-container
    fluid
    class="fill-height pa-0"
  >
    <v-row
      class="fill-height"
      no-gutters
      style="flex-wrap: nowrap; max-width: 100%;"
    >
      <v-col class="col-auto">
        <v-navigation-drawer permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Admin
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Test data</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list
            dense
            nav
          >
            <v-list-item
              link
              to="/admin/test-data/upload"
            >
              <v-list-item-icon>
                <v-icon>cloud_upload</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Upload</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              to="/admin/test-data/new"
            >
              <v-list-item-icon>
                <v-icon>note_add</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>New record</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              to="/admin/test-data/browse"
            >
              <v-list-item-icon>
                <v-icon>search</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Browse</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-col>
      <v-col>
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>
