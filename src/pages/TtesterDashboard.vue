<template>
  <q-layout class="tester-layout">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="navigateHome" />
        <q-toolbar-title>Tester Dashboard</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="dashboard-container">
          <h2 class="dashboard-title">Tester Dashboard</h2>

          <!-- Bug List Table -->
          <table class="bug-table">
            <thead>
              <tr>
                <th>Name of Bug</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bug, index) in bugs" :key="bug.id" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
                <td>{{ bug.name }}</td>
                <td>{{ bug.severity }}</td>
                <td>{{ bug.status }}</td>
                <td>{{ bug.description }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bug Report Form -->
          <q-btn @click="openBugReportForm" class="q-mt-md report-btn" color="secondary" rounded>Report Bug</q-btn>
          <q-dialog v-model="showBugReportForm" persistent>
            <q-card class="bug-report-card">
              <q-card-section class="q-pa-lg">
                <h3 class="form-header">Report a Bug</h3>
                <q-form @submit.prevent="submitBugReport" class="q-gutter-md">
                  <q-input v-model="bug.name" label="Bug Name" dense outlined />
                  <q-select v-model="bug.severity" label="Severity" :options="severityOptions" outlined />
                  <q-input v-model="bug.description" label="Bug Description" type="textarea" outlined rows="6" />

                  <div class="form-actions">
                    <q-btn flat label="Cancel" color="secondary" @click="resetForm" />
                    <q-btn type="submit" label="Submit" color="primary" class="submit-btn" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBugStore } from 'stores/bugStore';

export default {
  name: 'TesterDashboard',
  setup() {
    const router = useRouter();
    const bugStore = useBugStore();
    const bugs = bugStore.bugs;

    const showBugReportForm = ref(false);
    const bug = ref({
      name: '',
      severity: '',
      description: '',
    });

    const severityOptions = ref(['Low', 'Medium', 'High']);

    const openBugReportForm = () => {
      showBugReportForm.value = true;
    };

    const submitBugReport = () => {
      if (!bug.value.name || !bug.value.severity || !bug.value.description) {
        alert('Please fill in all fields.');
        return;
      }

      bugStore.addBug({
        name: bug.value.name,
        severity: bug.value.severity,
        status: 'Pending',
        description: bug.value.description,
      });

      resetForm();
    };

    const resetForm = () => {
      bug.value.name = '';
      bug.value.severity = '';
      bug.value.description = '';
      showBugReportForm.value = false;
    };

    const navigateHome = () => {
      router.push('/');
    };

    return {
      bugs,
      showBugReportForm,
      bug,
      severityOptions,
      openBugReportForm,
      submitBugReport,
      resetForm,
      navigateHome,
    };
  },
};
</script>
<style scoped>
.tester-layout {
  background-color: #e0f7fa; /* Light cyan background */
  min-height: 100vh;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.dashboard-title {
  font-size: 2rem;
  color: #00695c; /* Dark teal color */
  margin-bottom: 16px;
}

.bug-table {
  width: 100%;
  max-width: 900px;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.bug-table th, .bug-table td {
  border: 1px solid #dee2e6; /* Border color */
  padding: 8px;
  text-align: left;
}

.bug-table th {
  background-color: #f8f9fa; /* Header background color */
  color: #343a40; /* Header text color */
}

.bug-table tbody tr:nth-child(even) {
  background-color: #f2f2f2; /* Even row background color */
}

.bug-table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* Odd row background color */
}

.bug-table tbody tr:hover {
  background-color: #e9ecef; /* Row hover background color */
}

.q-dialog {
  width: 90%;
  max-width: 600px;
}

.bug-report-card {
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.q-card-section {
  padding: 24px;
}

.submit-btn {
  align-self: flex-end;
}

.form-header {
  margin-bottom: 16px;
  font-size: 1.5rem;
  color: #00695c; /* Dark teal color */
}

.report-btn {
  background-color: #00796b; /* Dark teal button color */
  color: #fff;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.report-btn:hover {
  background-color: #004d40; /* Darker shade on hover */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.5rem;
  }

  .bug-table th, .bug-table td {
    font-size: 0.875rem;
  }

  .q-btn {
    width: 100%;
    margin-top: 8px;
  }
}

/* CSS Variables for Color Scheme */
:root {
  --primary-color: #007bff; /* Primary button color */
  --secondary-color: #28a745; /* Secondary button color */
  --border-color: #dee2e6; /* Border color */
  --header-bg-color: #f8f9fa; /* Header background color */
  --header-text-color: #343a40; /* Header text color */
  --even-row-bg-color: #f2f2f2; /* Even row background color */
  --odd-row-bg-color: #ffffff; /* Odd row background color */
  --hover-bg-color: #e9ecef; /* Row hover background color */
}
</style>
