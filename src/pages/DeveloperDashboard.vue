<template>
  <q-layout class="background">
    <q-header elevated class="header">
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="navigateHome" class="header-btn" />
        <q-toolbar-title class="header-title">Developer Dashboard</q-toolbar-title>
        <q-space />
        <q-btn color="primary" label="Logout" @click="logout" class="header-btn" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <div class="bug-dashboard-container">
          <!-- Card View for Small Screens -->
          <div v-if="!isLargeScreen">
            <q-card v-for="bug in allBugs" :key="bug.id" class="bug-card">
              <q-card-section>
                <div class="text-h6">Bug</div>
                <div class="text-subtitle2">Name: {{ bug.name }}</div>
                <div class="text-subtitle2">Description: {{ bug.description }}</div>
                <div class="text-caption">Severity: {{ bug.severity }}</div>
                <div class="text-caption">Assigned Developer: {{ bug.developer || 'Unassigned' }}</div>
                <div class="text-caption">Deadline: {{ bug.deadline }}</div>
                <div class="text-caption">Status: {{ bug.status }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn @click="openUpdateDialog(bug)" color="primary" label="Update" class="update-btn" />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Table View for Larger Screens -->
          <div v-if="isLargeScreen">
            <div class="tables-container">
              <!-- Assigned Tasks Table -->
              <div class="tasks-container">
                <div class="assigned-tasks-title">Assigned Tasks</div>
                <q-table :rows="sortedBugs" :columns="allColumns" row-key="id" class="responsive-table">
                  <template v-slot:body-cell-update="props">
                    <q-td :props="props">
                      <q-btn class="update-btn" label="Update" @click="openUpdateDialog(props.row)" />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
          </div>
        </div>
        <q-dialog v-model="showUpdateDialog">
          <q-card class="form-card">
            <q-card-section>
              <div class="text-h6">Update Bug Status</div>
            </q-card-section>
            <q-card-section>
              <q-form @submit.prevent="saveUpdatedBugStatus" class="form-container">
                <q-input v-model="updatingBug.name" label="Bug Name" readonly class="form-input" />
                <q-input v-model="updatingBug.description" label="Description" type="textarea" readonly class="form-input" />
                <q-select v-model="updatingBug.severity" :options="severityOptions" label="Severity" readonly class="form-input" />
                <q-input v-model="updatingBug.deadline" label="Deadline" type="date" readonly class="form-input" />
                <q-radio v-model="updatingBug.status" val="Complete" label="Mark as Complete" class="form-radio" />
              </q-form>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" @click="showUpdateDialog = false" class="cancel-btn" />
              <q-btn flat label="Save" color="white" class="save-btn" @click="saveUpdatedBugStatus" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue';
import { useUserStore } from 'stores/userStore';
import { useRouter } from 'vue-router';
import { useBugStore } from 'stores/bugStore';

export default {
  setup() {
    const userStore = useUserStore();
    const bugStore = useBugStore();
    const router = useRouter();

    const user = userStore.currentUser;
    const showUpdateDialog = ref(false);
    const updatingBug = ref(null);
    const isLargeScreen = ref(window.innerWidth > 768); // Responsive check

    const statusOptions = [
      { label: 'Pending', value: 'Pending' },
      { label: 'Complete', value: 'Complete' },
    ];

    const severityOptions = ['Low', 'Medium', 'High'];

    const allColumns = [
      { name: 'name', align: 'left', label: 'Name of Bug', field: 'name' },
      { name: 'severity', align: 'left', label: 'Severity', field: 'severity' },
      { name: 'status', align: 'left', label: 'Status', field: 'status' },
      { name: 'description', align: 'left', label: 'Description', field: 'description' },
      { name: 'deadline', align: 'left', label: 'Deadline', field: 'deadline' },
      { name: 'update', align: 'center', label: 'Update', field: 'update' },
    ];

    const allBugs = computed(() => {
      return bugStore.bugs.filter(bug => bug.developer === user.username);
    });

    const sortedBugs = computed(() => {
      return allBugs.value.sort((a, b) => {
        if (a.status === 'Complete' && b.status !== 'Complete') {
          return 1;
        } else if (a.status !== 'Complete' && b.status === 'Complete') {
          return -1;
        }
        return 0;
      });
    });

    const openUpdateDialog = (bug) => {
      updatingBug.value = { ...bug };
      showUpdateDialog.value = true;
    };

    const saveUpdatedBugStatus = () => {
      bugStore.updateBug(updatingBug.value);
      showUpdateDialog.value = false;
    };

    const logout = () => {
      router.push('/');
    };

    const navigateHome = () => {
      router.push('/');
    };

    // Add watcher for responsive changes
    window.addEventListener('resize', () => {
      isLargeScreen.value = window.innerWidth > 768;
    });

    return {
      user,
      allColumns,
      sortedBugs,
      allBugs,
      showUpdateDialog,
      updatingBug,
      statusOptions,
      severityOptions,
      openUpdateDialog,
      saveUpdatedBugStatus,
      logout,
      navigateHome,
      isLargeScreen,
    };
  },
};
</script>
<style scoped>
/* Background */
.background {
  background: linear-gradient(to right, #e7ffe3, #ecffed);
  min-height: 100vh;
  padding: 16px;
}

/* Header */
.header {
  background-color: #ffffff;
}

.header-title {
  font-weight: bold;
  color: #000000;
}

.header-btn {
  color: #050505;
}

/* Card */
.bug-card {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  transition: transform 0.3s;
}

.bug-card:hover {
  transform: translateY(-4px);
}

.update-btn {
  background-color: #2196f3; /* Blue background for update button */
  color: #ffffff;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.update-btn:hover {
  background-color: #1976d2; /* Darker blue on hover */
  transform: scale(1.05);
}

.delete-btn {
  background-color: #f44336; /* Red background for delete button */
  color: #ffffff;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.delete-btn:hover {
  background-color: #c62828; /* Darker red on hover */
  transform: scale(1.05);
}

.other-btn {
  background-color: #ff9800; /* Orange background for other buttons */
  color: #ffffff;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.other-btn:hover {
  background-color: #fb8c00; /* Darker orange on hover */
  transform: scale(1.05);
}

/* Table */
.tables-container {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.assigned-tasks-title {
  font-size: 1.5rem;
  margin-bottom: 16px;
  font-weight: bold;
  color: #4c82af;
}

.responsive-table {
  width: 100%;
}

.q-table th, .q-table td {
  padding: 8px 16px;
  border: none;
}

.q-table th {
  background-color: #81c784;
  color: #ffffff;
  font-weight: bold;
}

.q-table tbody tr:hover {
  background-color: #f1f8e9;
}

/* Dialog */
.form-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  transition: transform 0.3s;
}

.form-card:hover {
  transform: translateY(-4px);
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-input {
  margin-bottom: 16px;
}

.q-input__control {
  border: 2px solid #81c784;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.q-input__control:focus-within {
  border-color: #4caf50;
}

.form-radio {
  margin-top: 16px;
}

.q-radio__inner {
  border: 2px solid #81c784;
  transition: border-color 0.3s;
}

.q-radio__inner:focus-within {
  border-color: #4caf50;
}

.cancel-btn {
  background-color: #f44336; /* Red background for cancel button */
  color: #ffffff;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.cancel-btn:hover {
  background-color: #c62828; /* Darker red on hover */
  transform: scale(1.05);
}

.save-btn {
  background-color: #4caf50; /* Green background for save button */
  color: #ffffff;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.save-btn:hover {
  background-color: #388e3c; /* Darker green on hover */
  transform: scale(1.05);
}
</style>
