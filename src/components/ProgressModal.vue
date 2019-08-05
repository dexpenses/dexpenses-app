<template>
  <v-dialog
    :value="show"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>
      <v-card-text>
        <v-row
          v-for="(task,i ) in tasks"
          :key="i"
          align="center"
        >
          <v-col class="shrink" >
            <v-icon
              v-if="task.state === 'success'"
              size="32px"
            >
              check
            </v-icon>
            <v-icon
              v-else-if="task.state === 'error'"
              size="32px"
              color="error"
            >
              error
            </v-icon>
            <v-progress-circular
              v-else
              :indeterminate="task.state === 'running'"
            />
          </v-col>
          <v-col class="grow" >
            <span>{{task.message}}</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!okEnabled"
          flat
          @click="show = false"
        >OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Processing',
    },
  },
  data() {
    return {
      show: false,
      okEnabled: false,
      tasks: [],
    };
  },
  methods: {
    async run(tasks) {
      this.show = true;
      this.tasks = tasks.map(task => ({ ...task, state: null }));
      let previousResult = null;
      for (let i = 0; i < this.tasks.length; i += 1) {
        const task = this.tasks[i];
        try {
          task.state = 'running';
          // eslint-disable-next-line no-await-in-loop
          previousResult = await task.run(previousResult);
          task.state = 'success';
        } catch (e) {
          task.state = 'error';
          this.okEnabled = true;
          throw e;
        }
      }
      this.okEnabled = true;
    },
  },
};
</script>
