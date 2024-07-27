<template>
  <q-layout class="tester-layout">
    <q-header elevated>
      <q-toolbar class="toolbar">
        <!-- Logout Button for Mobile View -->
        <q-btn v-if="isMobileView" flat icon="logout" @click="logout" class="logout-btn-mobile" />

        <!-- Navigation and Title -->
        <q-btn v-if="!isMobileView" flat icon="arrow_back" @click="navigateHome" />
        <q-toolbar-title>Tester Dashboard</q-toolbar-title>
        
        <!-- Hide Logout Button on Mobile View -->
        <q-btn v-if="!isMobileView" flat icon="logout" @click="logout" class="logout-btn-desktop" />
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
import { ref, onMounted, watch } from 'vue';
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
    const isMobileView = ref(window.innerWidth < 768);

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

    const logout = () => {
      // Handle logout logic
      router.push('/');
    };

    const handleResize = () => {
      isMobileView.value = window.innerWidth < 768;
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });

    watch(isMobileView, (newValue) => {
      if (!newValue) {
        // Additional logic for non-mobile view if needed
      }
    });

    return {
      bugs,
      showBugReportForm,
      bug,
      severityOptions,
      openBugReportForm,
      submitBugReport,
      resetForm,
      navigateHome,
      logout,
      isMobileView,
    };
  },
};
</script>
<style scoped>
.tester-layout {
  background: linear-gradient(135deg, #e2e2e2, #ffffff); /* Gradient background */
  min-height: 100vh;
}

.toolbar {
  display: flex;
  justify-content: space-between; /* Distribute space between items */
  align-items: center; /* Align items vertically center */
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
  color: var(--text-color); /* Color from global styles */
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
  border: 1px solid var(--border-color); /* Border color from global styles */
  padding: 8px;
  text-align: left;
}

.bug-table th {
  background-color: var(--header-bg-color); /* Header background color from global styles */
  color: var(--header-text-color); /* Header text color from global styles */
}

.bug-table tbody tr:nth-child(even) {
  background-color: var(--even-row-bg-color); /* Even row background color from global styles */
}

.bug-table tbody tr:nth-child(odd) {
  background-color: var(--odd-row-bg-color); /* Odd row background color from global styles */
}

.bug-table tbody tr:hover {
  background-color: var(--hover-bg-color); /* Row hover background color from global styles */
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
  color: var(--text-color); /* Color from global styles */
}

.report-btn {
  background-color: var(--secondary-color); /* Button color from global styles */
  color: #fff;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.report-btn:hover {
  background-color: var(--primary-color); /* Darker shade on hover from global styles */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

/* Logout button styles */
.logout-btn-mobile {
  margin-right: auto; /* Align to left on mobile view */
}

/* Responsive design */
@media (max-width: 768px) {
  .logout-btn-mobile{
    display: flex;
    align-items: end;
    justify-content: end;
    max-width: 50px;
  }
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

  .logout-btn-desktop {
    display: none; /* Hide logout button on mobile view */
  }
}

@media (min-width: 769px) {
  .logout-btn-mobile {
    display: none; /* Hide logout button on desktop view */
  }

}

/* CSS Variables for Color Scheme */
:root {
  --background-color: #f0f4f8; /* Light background color */
  --primary-color: #4a90e2; /* Primary button color */
  --secondary-color: #50e3c2; /* Secondary button color */
  --text-color: #333; /* Default text color */
  --header-color: #ffffff; /* Header background color */
  --card-background: #ffffff; /* Card background color */
  --border-color: #dee2e6; /* Border color */
  --header-bg-color: #f8f9fa; /* Header background color */
  --header-text-color: #343a40; /* Header text color */
  --even-row-bg-color: #f2f2f2; /* Even row background color */
  --odd-row-bg-color: #ffffff; /* Odd row background color */
  --hover-bg-color: #e9ecef; /* Row hover background color */
}
</style>
