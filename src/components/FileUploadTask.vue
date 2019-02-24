<template>
    <div>
        <div v-if="snapshot">
            <div v-if="downloadUrl">
                <a :href="downloadUrl" target="_blank" rel="noopener">
                    <img :src="downloadUrl" height="200">
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
                <v-btn flat small :disabled="!active"
            @click="snapshot.state === 'paused' ? task.resume() : task.pause()">
                {{snapshot.state === 'paused' ? 'Resume' : 'Pause'}}
            </v-btn>
            <v-btn flat small color="error" @click="task.cancel()" :disabled="!active">
                Cancel
            </v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';

export default {
  name: 'fileUploadTask',
  props: ['task'],
  data() {
    return {
      snapshot: null,
      downloadUrl: null,
    };
  },
  computed: {
    ...mapState(['user']),
    percentage() {
      return (this.snapshot.bytesTransferred / this.snapshot.totalBytes) * 100;
    },
    active() {
      return this.snapshot.state === 'running' && this.snapshot.bytesTransferred < this.snapshot.totalBytes;
    },
  },
  created() {
    this.task.on('state_changed', (snapshot) => {
      this.snapshot = snapshot;
    }, (error) => {
      console.error(error);
    }, async () => {
      this.downloadUrl = await this.task.snapshot.ref.getDownloadURL();
      firebase.firestore()
        .collection('receiptsByUser').doc(this.user.uid).collection('receipts')
        .doc(this.task.snapshot.ref.name)
        .set({
          downloadUrl: this.downloadUrl,
        }, {
          merge: true,
        });
    });
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
