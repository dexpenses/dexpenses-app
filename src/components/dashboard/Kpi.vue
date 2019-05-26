<template>
  <div class="kpi-container">
    <h2>{{title}}</h2>
    <span v-if="value">{{value}} €</span>
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
    func: String,
    data: Object,
  },
  data() {
    return {
      value: null,
    };
  },
  async mounted() {
    const { data } = await firebase.functions().httpsCallable(this.func)(
      this.data || {}
    );
    this.value = data.value;
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
