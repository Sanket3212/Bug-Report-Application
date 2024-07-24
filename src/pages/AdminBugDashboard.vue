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
          <div class="tables-container">
            <!-- All Tasks Table -->
            <div class="tasks-container all-tasks-container">
              <div class="section-header">All Tasks</div>
              <q-input v-model="filter" placeholder="Filter tasks..." class="filter-input" />
              <q-table :rows="sortedFilteredBugs" :columns="allColumns" row-key="id" class="tasks-table">
                <template v-slot:body-cell-name="props">
                  <q-td :props="props">
                    <q-btn flat @click="assignBug(props.row)" class="task-name-btn">{{ props.row.name }}</q-btn>
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn icon="edit" @click="editBug(props.row)" class="action-btn" flat />
                    <q-btn icon="delete" @click="deleteBug(props.row)" class="action-btn" flat />
                  </q-td>
                </template>
              </q-table>
            </div>
            <!-- Complete Tasks Table -->
            <div class="tasks-container complete-tasks-container">
              <div class="section-header">Complete Tasks</div>
              <q-table :rows="sortedCompletedBugs" :columns="completedColumns" row-key="id" class="tasks-table" />
            </div>
          </div>
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
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref, computed } from 'vue';
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

    const user = userStore.currentUser;
    const filter = ref('');
    const showEditDialog = ref(false);
    const showAssignDialog = ref(false);
    const editingBug = ref(null);
    const assigningBug = ref(null);

    const completedColumns = [
      { name: 'name', align: 'left', label: 'Bug', field: 'name' },
      { name: 'severity', align: 'left', label: 'Severity', field: 'severity' },
      { name: 'status', align: 'left', label: 'Status', field: 'status' },
      { name: 'description', align: 'left', label: 'Description', field: 'description' },
      { name: 'developer', align: 'left', label: 'Assigned Developer', field: 'developer', format: val => {
        const developer = developers.find(dev => dev.value === val);
        return developer ? developer.label : 'Unassigned';
      }},
      { name: 'deadline', align: 'left', label: 'Deadline', field: 'deadline' },
    ];

    const allColumns = [
      { name: 'name', align: 'left', label: 'Bug', field: 'name' },
      { name: 'severity', align: 'left', label: 'Severity', field: 'severity' },
      { name: 'status', align: 'left', label: 'Status', field: 'status' },
      { name: 'description', align: 'left', label: 'Description', field: 'description' },
      { name: 'developer', align: 'left', label: 'Assigned Developer', field: 'developer', format: val => {
        const developer = developers.find(dev => dev.value === val);
        return developer ? developer.label : 'Unassigned';
      }},
      { name: 'deadline', align: 'left', label: 'Deadline', field: 'deadline' },
      { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
    ];

    const severityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };

    const pendingBugs = computed(() => bugStore.bugs.filter(bug => bug.status === 'Pending'));
    const completedBugs = computed(() => bugStore.bugs.filter(bug => bug.status === 'Complete'));

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
        .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
    });

    const sortedCompletedBugs = computed(() => {
      return completedBugs.value.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
    });

    const developers = userStore.users
      .filter(user => user.designation === 'developer')
      .map(user => ({ label: user.fullName, value: user.username }));

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
        const bugIndex = bugStore.bugs.findIndex(b => b.id === bug.id);
        if (bugIndex !== -1) {
          bugStore.bugs.splice(bugIndex, 1);
        }
      }
    };

    const logout = () => {
      router.push('/');
    };

    const navigateHome = () => {
      router.push('/home');
    }

    return {
      user,
      filter,
      completedColumns,
      allColumns,
      sortedCompletedBugs,
      sortedFilteredBugs,
      showEditDialog,
      showAssignDialog,
      editingBug,
      assigningBug,
      developers,
      editBug,
      assignBug,
      assignDeveloper,
      saveBug,
      deleteBug,
      logout,
      navigateHome,
    };
  },
};
</script>
<style scoped>
.background {
  background: linear-gradient(to bottom, #e0f7fa, #ffffff); /* Gradient background from light cyan to white */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #3155c1; /* Dark blue background for the header */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.bug-dashboard-container {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff; /* White background for the main content area */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tasks-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9; /* Light background color for each task container */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.section-header {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #007bff; /* Blue color for section headers */
}

.filter-input {
  margin-bottom: 16px;
}

.tasks-table {
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff; /* White background for the table */
}

.task-name-btn {
  text-align: left;
  color: #007bff; /* Blue color for task name button */
  text-decoration: underline;
}

.edit-dialog-card,
.assign-dialog-card {
  border-radius: 12px;
  background-color: #ffffff; /* White background for the dialog card */
}

.form-section {
  padding: 16px;
}

.description-input {
  max-height: 100px; /* Control the height of the description box */
  background-color: #f9f9f9; /* Light background color for the description input */
}

/* Styles for the QDate component */
.q-date {
  margin-top: 16px;
}

/* Action button styles */
.action-btn {
  color: #007bff; /* Blue color for icons */
  margin-right: 8px; /* Space between icons */
}

/* Responsive styles */
@media (max-width: 768px) {
  .page-content {
    padding: 12px;
  }

  .welcome-message {
    font-size: 14px;
  }

  .bug-dashboard-container {
    padding: 16px;
  }

  .section-header {
    font-size: 16px;
  }
}

@media (max-width: 414px) {
  .page-content {
    padding: 8px;
  }

  .welcome-message {
    font-size: 12px;
  }

  .bug-dashboard-container {
    padding: 12px;
  }

  .section-header {
    font-size: 14px;
  }
}
</style>
