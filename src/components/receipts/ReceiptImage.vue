<template>
  <div>
    <div
      class="image-viewer"
      v-viewer="{toolbar: false, navbar: false, title: false}"
    >
      <img :src="src" />
    </div>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat
            @click="dialog = false"
          >OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ['src'],
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
<style scoped>
.image-viewer {
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-viewer img {
  max-width: 200px;
  max-height: 200px;
}
.zoomable-image-container {
  display: flex;
  justify-content: center;
}
.zoomable-image-container img {
  max-height: 80vh;
}
</style>
