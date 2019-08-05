<template>
  <v-container>
    <FileUpload
      :upload="uploadReceipt"
      :on-complete="onComplete"
    />
  </v-container>
</template>
<script>
import firebase from 'firebase/app';
import { mapState } from 'vuex';
import FileUpload from '@/components/upload/FileUpload.vue';

export default {
  name: 'uploadReceipts',
  components: {
    FileUpload,
  },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    uploadReceipt(file) {
      return firebase
        .storage()
        .ref(`images/${this.user.uid}/${Date.now()}-${file.name}`)
        .put(file, {
          contentType: file.type,
        });
    },
    async onComplete(task, downloadUrl) {
      const docRef = firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(this.user.uid)
        .collection('receipts')
        .doc(task.snapshot.ref.name);

      firebase.firestore().runTransaction(async transaction => {
        const doc = await transaction.get(docRef);
        if (doc.exists && doc.data().result && doc.data().result.state) {
          return transaction.set(
            docRef,
            {
              downloadUrl,
            },
            {
              merge: true,
            }
          );
        }
        return transaction.set(
          docRef,
          { downloadUrl, result: { state: 'pending' } },
          { merge: true }
        );
      });
    },
  },
};
</script>
