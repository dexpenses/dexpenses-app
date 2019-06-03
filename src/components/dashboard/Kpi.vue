<template>
  <div class="kpi-container">
    <h2 v-if="title">{{title}}</h2>
    <span v-if="value || value === 0">{{value}} €</span>
    <span
      class="red--text text--lighten-1"
      v-else-if="error"
    >Error</span>
    <div
      class="loader"
      v-else
    >
      <v-progress-circular indeterminate />
    </div>
  </div>
</template>
<script>
import firebase from 'firebase/app';

export default {
  props: {
    title: String,
    func: {
      type: String,
      required: true,
    },
    data: Object,
  },
  data() {
    return {
      value: null,
      error: false,
    };
  },
  async mounted() {
    try {
      const { data } = await firebase.functions().httpsCallable(this.func)(
        this.data || {}
      );
      this.value = data.value || 0;
    } catch {
      this.error = true;
    }
  },
};
</script>
<style scoped>
.kpi-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.kpi-container span {
  font-weight: bold;
  font-size: 48px; /* TODO: responsive (vw?) */
}
.loader {
  height: 72px;
  display: flex;
  align-items: center;
}
</style>
