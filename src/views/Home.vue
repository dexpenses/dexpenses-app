<template>
  <v-content style="padding: 0;">
    <section>
      <v-parallax
        src="https://firebasestorage.googleapis.com/v0/b/dexpenses-207219-public/o/coins_on_book_1920.jpeg?alt=media"
        height="800"
      >
        <v-container class="white--text">
          <v-row
            align="center"
            justify="center"
          >
            <img
              src="@/assets/vuetify.png"
              alt="Vuetify.js"
              height="200"
            >
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <h1 class="white--text mb-2 display-1 text-center">Dexpenses</h1>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <div class="subheading mb-3 text-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/dexpenses-207219-public/o/powered_by_google%2Fpowered_by_google_on_non_white.png?alt=media">
            </div>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <v-btn
              class="blue lighten-2 mt-5"
              dark
              large
              @click="login"
            >Get Started</v-btn>
          </v-row>

        </v-container>
      </v-parallax>
    </section>

    <section>
      <v-row
        justify="center"
        class="my-5"
      >
        <v-col
          cols="12"
          sm="4"
          class="my-3"
        >
          <div class="text-center">
            <h2 class="headline">The best way to start developing</h2>
            <span class="subheading">Cras facilisis mi vitae nunc</span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-container>
            <v-row align="center">
              <v-col
                cols="12"
                md="4"
              >
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon
                      x-large
                      class="blue--text text--lighten-2"
                    >color_lens</v-icon>
                  </v-card-text>
                  <v-card-title
                    primary-title
                    class="layout justify-center"
                  >
                    <div class="headline text-center">Material Design</div>
                  </v-card-title>
                  <v-card-text>
                    Cras facilisis mi vitae nunc lobortis pharetra.
                    Nulla volutpat tincidunt ornare.
                    Pellentesque habitant morbi tristique senectus et
                    netus et malesuada fames ac turpis egestas.
                    Nullam in aliquet odio. Aliquam eu est vitae tellus
                    bibendum tincidunt. Suspendisse potenti.
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon
                      x-large
                      class="blue--text text--lighten-2"
                    >flash_on</v-icon>
                  </v-card-text>
                  <v-card-title
                    primary-title
                    class="layout justify-center"
                  >
                    <div class="headline">Fast development</div>
                  </v-card-title>
                  <v-card-text>
                    Cras facilisis mi vitae nunc lobortis pharetra.
                    Nulla volutpat tincidunt ornare.
                    Pellentesque habitant morbi tristique senectus
                    et netus et malesuada fames ac turpis egestas.
                    Nullam in aliquet odio. Aliquam eu est vitae tellus
                    bibendum tincidunt. Suspendisse potenti.
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon
                      x-large
                      class="blue--text text--lighten-2"
                    >build</v-icon>
                  </v-card-text>
                  <v-card-title
                    primary-title
                    class="layout justify-center"
                  >
                    <div class="headline text-center">Completely Open Sourced</div>
                  </v-card-title>
                  <v-card-text>
                    Cras facilisis mi vitae nunc lobortis pharetra.
                    Nulla volutpat tincidunt ornare.
                    Pellentesque habitant morbi tristique senectus et netus
                    et malesuada fames ac turpis egestas.
                    Nullam in aliquet odio. Aliquam eu est vitae
                    tellus bibendum tincidunt. Suspendisse potenti.
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </section>

    <section>
      <v-parallax
        :src="require('@/assets/section.jpg')"
        height="380"
      >
        <v-container>
          <v-row
            align="center"
            justify="center"
          >
            <div class="headline white--text mb-3 text-center">Web development has never been easier</div>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >

            <em>Kick-start your application today</em>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <v-btn
              class="blue lighten-2 mt-5"
              dark
              large
              href="/pre-made-themes"
            >Get Started</v-btn>
          </v-row>

        </v-container>
      </v-parallax>
    </section>

    <section>
      <v-container>
        <v-row
          justify="center"
          class="my-5"
        >
          <v-col
            cols="12"
            sm="4"
          >
            <v-card class="elevation-0 transparent">
              <v-card-title
                primary-title
                class="layout justify-center"
              >
                <div class="headline">Company info</div>
              </v-card-title>
              <v-card-text>
                Cras facilisis mi vitae nunc lobortis pharetra.
                Nulla volutpat tincidunt ornare.
                Pellentesque habitant morbi tristique senectus et
                netus et malesuada fames ac turpis egestas.
                Nullam in aliquet odio. Aliquam eu est vitae tellus
                bibendum tincidunt. Suspendisse potenti.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            offset-sm="1"
          >
            <v-card class="elevation-0 transparent">
              <v-card-title
                primary-title
                class="layout justify-center"
              >
                <div class="headline">Contact us</div>
              </v-card-title>
              <v-card-text>Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.</v-card-text>
              <v-list class="transparent">
                <v-list-item>
                  <v-list-item-action>
                    <v-icon class="blue--text text--lighten-2">phone</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>777-867-5309</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-action>
                    <v-icon class="blue--text text--lighten-2">place</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Chicago, US</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-action>
                    <v-icon class="blue--text text--lighten-2">email</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>john@vuetifyjs.com</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-footer class="blue darken-2">
      <v-row align="center">
        <v-col cols="12">
          <div class="white--text ml-3">
            Made with
            <v-icon class="red--text">favorite</v-icon>by
            <a
              class="white--text"
              href="https://github.com/dexmo007"
              target="_blank"
            >dexmo</a>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-content>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'home',
  methods: {
    ...mapActions(['login']),
  },
};
</script>
