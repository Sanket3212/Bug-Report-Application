<template>
  <q-layout class="background">
    <q-header elevated class="header">
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="navigateHome" />
        <q-toolbar-title color="primary">ADMIN BUG DASHBOARD</q-toolbar-title>
        <q-btn color="primary" label="Logout" @click="logout" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="page-content">
        <div class="bug-dashboard-container">
          <!-- Toggle Buttons for Small Screens -->
          <div v-if="!isLargeScreen" class="toggle-buttons">
            <q-btn @click="viewMode = 'pending'" :color="viewMode === 'pending' ? 'primary' : 'grey'" label="Pending Bugs" />
            <q-btn @click="viewMode = 'complete'" :color="viewMode === 'complete' ? 'primary' : 'grey'" label="Complete Bugs" />
          </div>

          <!-- Card View for Small Screens -->
          <div v-if="!isLargeScreen">
            <!-- Pending Bugs Section -->
            <div v-if="viewMode === 'pending'">
              <q-card v-for="bug in pendingBugs" :key="bug.id" class="bug-card">
                <q-card-section>
                  <div class="text-h6">All Bug</div>
                  <div class="text-subtitle2">Name: {{ bug.name }}</div>
                  <div class="text-subtitle2">Description: {{ bug.description }}</div>
                  <div class="text-caption">Severity: {{ bug.severity }}</div>
                  <div class="text-caption">Assigned Developer: {{ bug.developer || 'Unassigned' }}</div>
                  <div class="text-caption">Deadline: {{ bug.deadline }}</div>
                  <q-btn @click="editBug(bug)" color="primary" label="Edit" />
                  <q-btn @click="deleteBug(bug)" color="negative" label="Delete" />
                </q-card-section>
              </q-card>
            </div>

            <!-- Complete Bugs Section -->
            <div v-if="viewMode === 'complete'">
              <q-card v-for="bug in completeBugs" :key="bug.id" class="bug-card">
                <q-card-section>
                  <div class="text-h6">Complete Bug</div>
                  <div class="text-subtitle2">Name: {{ bug.name }}</div>
                  <div class="text-subtitle2">Description: {{ bug.description }}</div>
                  <div class="text-caption">Severity: {{ bug.severity }}</div>
                  <div class="text-caption">Assigned Developer: {{ bug.developer || 'Unassigned' }}</div>
                  <div class="text-caption">Deadline: {{ bug.deadline }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Table View for Larger Screens -->
          <div v-else>
            <!-- Pending Bugs Table -->
            <div class="text-h4">All Bug</div>
            <q-row class="tasks-container">
              <q-col cols="12">
                <q-input v-model="filter" placeholder="Filter Bugs..." class="filter-input" />
              </q-col>
              <q-col cols="12">
                <div class="table-wrapper">
                  <q-table :rows="sortedFilteredBugs" :columns="allColumns" row-key="id" dense class="tasks-table">
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <q-btn icon="edit" @click="editBug(props.row)" class="action-btn" flat dense />
                        <q-btn icon="delete" @click="deleteBug(props.row)" class="action-btn delete-btn" flat dense />
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-col>
            </q-row>

            <!-- Complete Bugs Table -->
            <div class="text-h4">Complete Bug</div>
            <q-row class="tasks-container">
              <q-col cols="12">
                <q-input v-model="filterComplete" placeholder="Filter Complete Bugs..." class="filter-input" />
              </q-col>
              <q-col cols="12">
                <div class="table-wrapper">
                  <q-table :rows="sortedFilteredCompleteBugs" :columns="allColumns" row-key="id" dense class="tasks-table">
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <q-btn icon="edit" @click="editBug(props.row)" class="action-btn" flat dense />
                        <q-btn icon="delete" @click="deleteBug(props.row)" class="action-btn delete-btn" flat dense />
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-col>
            </q-row>
          </div>
        </div>

        <!-- Edit Bug Dialog -->
        <q-dialog v-model="showEditDialog">
          <q-card class="edit-dialog-card">
            <q-card-section>
              <div class="text-h6">Edit Bug</div>
            </q-card-section>
            <q-card-section class="form-section">
              <q-input v-model="editingBug.name" label="Bug Name" outlined dense />
              <q-input v-model="editingBug.description" label="Description" type="textarea" outlined dense />
              <q-select v-model="editingBug.severity" :options="['Low', 'Medium', 'High']" label="Severity" outlined dense />
              <q-select v-model="editingBug.developer" :options="developers" label="Assign Developer" outlined dense />
              <q-input v-model="editingBug.deadline" label="Deadline" type="date" outlined dense />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" @click="showEditDialog = false" />
              <q-btn flat label="Save" color="primary" @click="saveBug" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <!-- Assign Developer Dialog -->
        <q-dialog v-model="showAssignDialog">
          <q-card class="assign-dialog-card">
            <q-card-section>
              <div class="text-h6">Assign Developer</div>
            </q-card-section>
            <q-card-section class="form-section">
              <q-select v-model="assigningBug.developer" :options="developers" label="Developer" outlined dense />
              <q-date v-model="assigningBug.deadline" label="Deadline" outlined dense />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" @click="showAssignDialog = false" />
              <q-btn flat label="Assign" color="primary" @click="assignDeveloper" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from 'stores/userStore';
import { useRouter } from 'vue-router';
import { useBugStore } from 'stores/bugStore';
import { QDate } from 'quasar';

export default {
  components: {
    QDate,
  },
  setup() {
    const userStore = useUserStore();
    const bugStore = useBugStore();
    const router = useRouter();

    const filter = ref('');
    const filterComplete = ref('');
    const showEditDialog = ref(false);
    const showAssignDialog = ref(false);
    const editingBug = ref(null);
    const assigningBug = ref(null);
    const isLargeScreen = ref(window.innerWidth >= 600);
    const viewMode = ref('pending'); // Default view mode

    const severityMap = {
      Low: 1,
      Medium: 2,
      High: 3,
    };

    const developers = userStore.users
      .filter(user => user.designation === 'developer')
      .map(user => ({ label: user.fullName, value: user.username }));

    const pendingBugs = computed(() => bugStore.bugs.filter(bug => bug.status === 'Pending'));
    const completeBugs = computed(() => bugStore.bugs.filter(bug => bug.status === 'Complete'));

    const sortedFilteredBugs = computed(() => {
      const filterText = filter.value.toLowerCase();
      return bugStore.bugs
        .filter(bug =>
          bug.name.toLowerCase().includes(filterText) ||
          bug.severity.toLowerCase().includes(filterText) ||
          bug.status.toLowerCase().includes(filterText) ||
          bug.description.toLowerCase().includes(filterText) ||
          (bug.developer && bug.developer.toLowerCase().includes(filterText)) ||
          (bug.deadline && bug.deadline.includes(filterText))
        )
        .sort((a, b) => severityMap[b.severity] - severityMap[a.severity]);
    });

    const sortedFilteredCompleteBugs = computed(() => {
      const filterText = filterComplete.value.toLowerCase();
      return bugStore.bugs
        .filter(bug =>
          bug.status === 'Complete' &&
          (bug.name.toLowerCase().includes(filterText) ||
           bug.severity.toLowerCase().includes(filterText) ||
           bug.description.toLowerCase().includes(filterText) ||
           (bug.developer && bug.developer.toLowerCase().includes(filterText)) ||
           (bug.deadline && bug.deadline.includes(filterText)))
        )
        .sort((a, b) => severityMap[b.severity] - severityMap[a.severity]);
    });

    const allColumns = [
      { name: 'name', label: 'Name', align: 'left', field: row => row.name },
      { name: 'severity', label: 'Severity', align: 'left', field: row => row.severity },
      { name: 'description', label: 'Description', align: 'left', field: row => row.description },
      { name: 'developer', label: 'Assigned Developer', align: 'left', field: row => row.developer || 'Unassigned' },
      { name: 'deadline', label: 'Deadline', align: 'left', field: row => row.deadline },
      { name: 'actions', label: 'Actions', align: 'center', field: row => row }
    ];

    const editBug = (bug) => {
      const developer = developers.find(dev => dev.value === bug.developer);
      editingBug.value = { ...bug, developer: developer || { label: '', value: '' } };
      showEditDialog.value = true;
    };

    const assignBug = (bug) => {
      const developer = developers.find(dev => dev.value === bug.developer);
      assigningBug.value = { ...bug, developer: developer || { label: '', value: '' } };
      showAssignDialog.value = true;
    };

    const assignDeveloper = () => {
      const bugIndex = bugStore.bugs.findIndex(bug => bug.id === assigningBug.value.id);
      if (bugIndex !== -1) {
        bugStore.bugs[bugIndex].developer = assigningBug.value.developer.value;
        bugStore.bugs[bugIndex].deadline = assigningBug.value.deadline;
      }
      showAssignDialog.value = false;
    };

    const saveBug = () => {
      const bugIndex = bugStore.bugs.findIndex(bug => bug.id === editingBug.value.id);
      if (bugIndex !== -1) {
        bugStore.bugs[bugIndex] = {
          ...editingBug.value,
          developer: editingBug.value.developer.value
        };
      }
      showEditDialog.value = false;
    };

    const deleteBug = (bug) => {
      const confirmed = confirm('Are you sure you want to delete this bug?');
      if (confirmed) {
        bugStore.bugs = bugStore.bugs.filter(b => b.id !== bug.id);
      }
    };

    const navigateHome = () => {
      router.push('/');
    };

    const logout = () => {
      router.push('/');
    };

    // Update isLargeScreen on resize
    const handleResize = () => {
      isLargeScreen.value = window.innerWidth >= 600;
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });

    return {
      filter,
      filterComplete,
      showEditDialog,
      showAssignDialog,
      editingBug,
      assigningBug,
      isLargeScreen,
      viewMode,
      developers,
      pendingBugs,
      completeBugs,
      sortedFilteredBugs,
      sortedFilteredCompleteBugs,
      allColumns,
      editBug,
      assignBug,
      saveBug,
      assignDeveloper,
      deleteBug,
      navigateHome,
      logout,
    };
  },
};
</script>
<style scoped>
/* Background and layout for the main container */
.background {
  background: linear-gradient(to bottom, #e0f7fa, #ffffff); 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header styling */
.header {
  background-color: #3155c1; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Page content styling */
.page-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

/* Main container for the bug dashboard */
.bug-dashboard-container {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff; 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

/* Card view styling for small screens */
.bug-card {
  margin-bottom: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

/* Table view styling for larger screens */
.table-wrapper {
  overflow-x: auto; /* Ensures that table scrolls horizontally if necessary */
}

/* Styling for tasks container */
.tasks-container {
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

/* Styling for filter input field */
.filter-input {
  margin-bottom: 16px;
}

/* Styling for the tasks table */
.tasks-table {
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff; 
}

/* Action buttons styling */
.action-btn {
  color: #007bff;
  margin-right: 8px; 
}

/* Delete button specific styling */
.delete-btn {
  color: #fb1111; /* Red color for delete icon */
}

/* Responsive styles for small screens */
@media (max-width: 600px) {
  .tasks-container {
    display: none;
  }

  .bug-card {
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header .q-btn {
    display: none; /* Hide non-essential buttons in mobile view */
  }

  .header .q-toolbar-title {
    font-size: 1rem; /* Adjust font size for mobile view */
  }

  .toggle-buttons {
    flex-direction: column;
  }

  .toggle-buttons q-btn {
    margin: 4px 0;
  }
}

/* Responsive styles for large screens */
@media (min-width: 601px) {
  .bug-card {
    display: none; /* Hide cards in large screens */
  }

  .header .q-btn {
    display: inline-flex;
  }

  .header .q-toolbar-title {
    font-size: 1.25rem; /* Adjust font size for larger screens */
  }
}

/* Toggle buttons styling */
.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.toggle-buttons q-btn {
  margin: 0 8px;
}

/* Card view for Pending and Complete Bugs */
.card-section {
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Dialog Styling */
.q-dialog .edit-dialog-card, .q-dialog .assign-dialog-card {
  width: 90%;
  max-width: 500px;
}

.q-dialog .form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.q-dialog .q-input, .q-dialog .q-select, .q-dialog .q-date {
  width: 100%;
}


@media (max-width: 600px) {
  .header .q-btn:first-of-type {
    margin-left: 0;
  }

  .header .q-btn:last-of-type {
    margin-left: auto;
  }
}
</style>
