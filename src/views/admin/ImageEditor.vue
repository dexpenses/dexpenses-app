<template>
  <v-row
    no-gutters
    v-viewer="{toolbar: true, navbar: false, title: false}"
  >
    <v-col
      cols="12"
      class="pa-0"
    >
      <v-btn-toggle
        key="edit"
        v-if="!editMode"
      >
        <v-btn
          text
          @click="rotateImage(-1)"
        >
          <v-icon>rotate_left</v-icon>
        </v-btn>
        <v-btn
          text
          @click="rotateImage(1)"
        >
          <v-icon>rotate_right</v-icon>
        </v-btn>
        <v-btn
          text
          @click="editMode = 'crop'"
        >
          <v-icon>crop</v-icon>
        </v-btn>
        <v-btn
          text
          @click="editMode = 'redact'"
        >
          <v-icon>featured_play_list</v-icon>
        </v-btn>
        <v-btn
          text
          :disabled="!value.edited"
          @click="$emit('input', {url:source,edited:false})"
        >
          <v-icon>restore</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle
        key="confirm"
        v-else
      >
        <v-btn
          text
          @click="editMode == 'crop' ? cropImage() : redactImage()"
        >
          <v-icon>check</v-icon>
        </v-btn>
        <v-btn
          text
          @click="editMode = null"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <img
      v-if="!editMode"
      :src="value.url"
      style="max-height: 100%; max-width: 100%"
    />
    <VueCropper
      v-else-if="editMode == 'crop'"
      ref="cropper"
      :src="value.url"
      alt="Source Image"
    />
    <VueImageRedact
      v-else-if="editMode == 'redact'"
      ref="redacter"
      :src="value.url"
      max-height="100%"
      max-width="100%"
    />
  </v-row>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import VueImageRedact from 'vue-image-redact';

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  components: { VueCropper, VueImageRedact },
  data() {
    return {
      editMode: null,
      source: null,
    };
  },
  computed: {
    downloadUrl() {
      return this.value.url;
    },
  },
  created() {
    this.source = this.value.url;
  },
  methods: {
    async handleImageEditDone(canvas) {
      const edited = {
        url: canvas.toDataURL(),
        blob: await new Promise((resolve, reject) => {
          try {
            canvas.toBlob(resolve);
          } catch (e) {
            reject(e);
          }
        }),
        edited: true,
      };
      this.$emit('input', edited);
      this.editMode = null;
    },
    async cropImage() {
      await this.handleImageEditDone(this.$refs.cropper.getCroppedCanvas());
    },
    async redactImage() {
      await this.handleImageEditDone(this.$refs.redacter.canvas());
    },
    async rotateImage(direction) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = this.value.url;
      });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const [width, height] = [canvas.width, canvas.height];
      ctx.save();
      canvas.width = height;
      canvas.height = width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((direction / 2) * Math.PI);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      await this.handleImageEditDone(canvas);
    },
  },
};
</script>

<style>
</style>
