<template>
  <v-row
    class="pa-4"
    justify="space-between"
  >
    <v-col cols="6">
      <v-treeview
        :active.sync="active"
        :open.sync="open"
        :items="items"
        :load-children="loadTestData"
        open-on-click
        transition
        activatable
      >
      </v-treeview>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col>
      <v-scroll-y-transition mode="out-in">
        <div v-if="!selected">Select a receipt</div>
        <div v-else>
          <v-simple-table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>{{ selected.id }}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td>{{ selected.data.category }}</td>
              </tr>
              <tr>
                <td>City code</td>
                <td>{{ selected.data.cityCode }}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{{ selected.data.name }}</td>
              </tr>
              <tr>
                <td>Classifier</td>
                <td>{{ selected.data.classifier }}</td>
              </tr>
              <tr>
                <td>Payment method</td>
                <td>{{ selected.data.paymentMethod }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <div v-viewer="{toolbar: true, navbar: false, title: false}">
            <img
              :src="selected.imageUrl"
              alt=""
              style="max-width: 100%;max-height: 100%;"
            >
          </div>
        </div>
      </v-scroll-y-transition>
    </v-col>
  </v-row>
</template>

<script>
import firebase from 'firebase/app';
import { categories, buildIdentifier, getUrl } from './util';

export default {
  data() {
    return {
      active: [],
      open: [],
      items: categories.map((name, index) => ({
        name,
        id: index,
        children: [],
      })),
    };
  },
  computed: {
    selected() {
      if (this.active.length === 0) {
        return null;
      }
      return this.items
        .flatMap(i => i.children)
        .find(({ id }) => id === this.active[0]);
    },
  },
  methods: {
    async loadTestData(item) {
      const snap = await firebase
        .firestore()
        .collection('testData')
        .where('category', '==', item.name)
        .get();

      item.children.push(
        ...snap.docs.map(doc => {
          const info = doc.data();
          return {
            name: buildIdentifier(info),
            id: doc.id,
            data: info,
            imageUrl: getUrl(info.path),
          };
        })
      );
    },
  },
};
</script>

<style>
</style>
