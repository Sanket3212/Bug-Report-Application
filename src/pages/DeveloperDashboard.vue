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
    
    const sortedBugs = computed(() => {
      const bugs = bugStore.bugs.filter(bug => bug.developer === user.username);
      return bugs.sort((a, b) => {
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
    }

    return {
      user,
      allColumns,
      sortedBugs,
      showUpdateDialog,
      updatingBug,
      statusOptions,
      severityOptions,
      openUpdateDialog,
      saveUpdatedBugStatus,
      logout,
      navigateHome,
    };
  },
};
</script>

<style scoped>
.background {
  background: url('https://www.transparenttextures.com/patterns/white-diamond.png') repeat; /* Subtle pattern background */
  min-height: 100vh;
}

.header {
  background: #2754b6; /* Dark teal background */
  color: #ffffff; /* White text color */
  border-bottom: 2px solid #004d40; /* Darker border at the bottom */
}

.header-btn {
  color: #ffffff; /* White color for buttons in header */
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff; /* White color for header title */
}

.q-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}

.bug-dashboard-container {
  padding: 16px;
  padding-top: 64px; /* Adjust for the fixed header */
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tasks-container {
  width: 100%;
}

.assigned-tasks-title {
  text-align: center;
  font-size: 2rem; /* Increase font size */
  font-weight: bold;
  color: #004d40; /* Darker teal color for title */
  margin-bottom: 16px; /* Space below title */
}

.responsive-table {
  max-width: 100%;
  overflow-x: auto; /* Allow horizontal scrolling if needed */
}

.q-table {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px; /* Default font size for the table */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.q-table thead {
  background-color: #00695c; /* Dark teal background for header */
  color: #ffffff;
}

.q-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: bold;
}

.q-table td {
  padding: 12px 16px;
}

.q-table tbody tr {
  transition: background-color 0.3s, transform 0.3s;
}

.q-table tbody tr:hover {
  background-color: #f2f2f2; /* Light gray background on hover */
  transform: scale(1.02); /* Slightly scale up the row on hover */
}

.update-btn {
  background-color: #4caf50; /* Green background for button */
  color: #ffffff; /* White text color */
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.update-btn:hover {
  background-color: #388e3c; /* Darker green on hover */
  transform: scale(1.05); /* Slightly scale up the button on hover */
}

.q-dialog .q-card {
  width: 90vw; /* Responsive width for mobile */
  max-width: 600px; /* Max width for larger screens */
  border-radius: 8px; /* Rounded corners for the card */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Soft shadow */
  background-color: #ffffff; /* Card background color */
}

.form-card {
  border-radius: 8px; /* Rounded corners for the card */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Soft shadow */
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-input {
  background-color: #f9f9f9; /* Light gray background for inputs */
  border-radius: 4px; /* Rounded corners for inputs */
}

.form-radio {
  margin-top: 8px;
}

.save-btn {
  background-color: #1c69dd; /* Orange background for save button */
  color: #ffffff; /* White text color */
  font-weight: bold;
  border: 1px solid #224aff; /* Border color to match background */
}

.save-btn:hover {
  background-color: #197ce6; /* Darker orange on hover */
}

.cancel-btn {
  color: #00695c; /* Dark teal color for cancel button */
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #00695c; /* Dark teal color for header text */
}

@media (max-width: 768px) {
  .assigned-tasks-title {
    font-size: 1.5rem; /* Smaller font size for tablets */
  }

  .q-table {
    font-size: 12px; /* Smaller font size for tablets */
  }
}

@media (max-width: 480px) {
  .assigned-tasks-title {
    font-size: 1.25rem; /* Smaller font size for phones */
  }

  .q-table {
    font-size: 10px; /* Smaller font size for phones */
  }

  .q-card {
    width: 95vw;
  }
}
</style>
