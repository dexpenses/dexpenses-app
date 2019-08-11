<template>
  <div>
    <div v-if="snapshot">
      <div v-if="downloadUrl">
        <a
          :href="downloadUrl"
          @click="$emit('img-clicked',{$event,ref: snapshot.ref,downloadUrl})"
          target="_blank"
          rel="noopener"
        >
          <img
            :src="downloadUrl"
            height="200"
          >
        </a><br>
        <span>
          <v-icon>check</v-icon>
          Finished:
          {{ snapshot.totalBytes | dataSize }}
        </span>
      </div>
      <div v-else>
        <v-progress-circular
          :size="150"
          :width="15"
          :value="percentage"
          color="primary"
        >
          {{ [snapshot.bytesTransferred, snapshot.totalBytes] | dataSizeProgress }}
        </v-progress-circular>
        <v-btn
          text
          small
          :disabled="!active"
          @click="snapshot.state === 'paused' ? task.resume() : task.pause()"
        >
          {{snapshot.state === 'paused' ? 'Resume' : 'Pause'}}
        </v-btn>
        <v-btn
          text
          small
          color="error"
          @click="task.cancel()"
          :disabled="!active"
        >
          Cancel
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'fileUploadTask',
  props: {
    task: {
      type: Object,
      required: true,
    },
    onComplete: Function,
  },
  data() {
    return {
      snapshot: null,
      downloadUrl: null,
    };
  },
  computed: {
    percentage() {
      return (this.snapshot.bytesTransferred / this.snapshot.totalBytes) * 100;
    },
    active() {
      return (
        this.snapshot.state === 'running' &&
        this.snapshot.bytesTransferred < this.snapshot.totalBytes
      );
    },
  },
  created() {
    this.task.on(
      'state_changed',
      snapshot => {
        this.snapshot = snapshot;
      },
      error => {
        console.error(error);
      },
      async () => {
        this.downloadUrl = await this.task.snapshot.ref.getDownloadURL();
        if (this.onComplete) {
          await this.onComplete(this.task, this.downloadUrl);
        }
      }
    );
  },
  filters: {
    number(value) {
      return value.toFixed(0);
    },
  },
};
</script>

<style>
</style>
