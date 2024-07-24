<template>
  <q-dialog v-model="showForm">
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="submitBugReport">
          <q-input v-model="bug.name" label="Bug Name" dense outlined />
          <q-select v-model="bug.severity" label="Severity" :options="severityOptions" outlined />
          <q-editor v-model="bug.description" label="Bug Description" dense outlined />
          <q-btn type="submit" label="Submit" color="primary" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'BugReportForm',
  props: {
    testerInfo: Object, // Tester information object with properties like name
  },
  data() {
    return {
      showForm: false,
      bug: {
        name: '',
        severity: '',
        description: '',
      },
      severityOptions: ['Low', 'Medium', 'High'], // Example severity options
    };
  },
  methods: {
    submitBugReport() {
      if (!this.bug.name || !this.bug.severity || !this.bug.description) {
        alert('Please fill in all fields.');
        return;
      }

      // Emit the bugReported event with the bug data
      this.$emit('bugReported', this.bug);

      // Reset the form fields after submission
      this.resetForm();
    },
    resetForm() {
      this.bug.name = '';
      this.bug.severity = '';
      this.bug.description = '';
      this.showForm = false;
    },
  },
};
</script>

<style scoped>
/* Scoped styles for BugReportForm */
.q-dialog {
  width: 400px;
}

.q-card-section {
  padding: 16px;
}

.q-btn {
  margin-top: 12px;
}
</style>
