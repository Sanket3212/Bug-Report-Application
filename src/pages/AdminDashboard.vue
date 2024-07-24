<template>
  <q-layout class="background">
    <q-page-container>
      <q-page>
        <div class="dashboard-container">
          <div class="header">
            <div class="welcome-container">
              <div class="text-h5">Welcome, {{ user.fullName }}</div><br>
              <div class="text-h6">Admin Dashboard</div>
            </div>
            <div class="logout-container">
              <q-btn 
                flat 
                icon="logout" 
                @click="logout" 
                class="logout-icon"
              />
            </div>
          </div>
          <div class="button-container">
            <q-btn color="primary" label="Create User" @click="openCreateUserDialog" class="button-style" />
            <q-btn color="primary" label="Show All Users" @click="showUsers" class="button-style" />
            <q-btn color="secondary" label="See the Application" @click="goToBugDashboard" class="button-style" />
          </div>
          <q-dialog v-model="showUserDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">All Users</div>
              </q-card-section>
              <q-card-section>
                <q-list bordered separator>
                  <div v-for="(users, designation) in groupedUsers" :key="designation">
                    <div class="text-h7">{{ designation }}</div>
                    <q-item v-for="user in users" :key="user.userId">
                      <q-item-section>
                        <div>{{ user.fullName }} ({{ user.username }})</div>
                        <div>{{ user.email }} - {{ user.phone }}</div>
                        <div v-if="user.designation === 'tester'">Tester ID: {{ user.testerId }}</div>
                        <div v-if="user.designation === 'developer'">Developer ID: {{ user.developerId }}</div>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-list>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Close" @click="showUserDialog = false" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!-- Dialog for creating a new user -->
          <q-dialog v-model="showCreateUserDialog" persistent>
            <q-card class="create-user-card">
              <q-card-section>
                <div class="text-h6">Create New User</div>
              </q-card-section>
              <q-card-section>
                <component :is="currentStep" :user="newUser" @next-step="nextStep" />
              </q-card-section>
              <q-card-actions class="card-actions">
                <q-btn flat label="Previous" @click="previousStep" v-if="currentStep !== 'AdminFormStep1'" class="prev-btn" />
                <div class="spacer"></div>
                <q-btn flat label="Next" @click="nextStep" v-if="currentStep !== 'AdminFormStep3'" class="next-btn" />
                <q-btn flat label="Create" @click="createUser" v-if="currentStep === 'AdminFormStep3'" />
                <q-btn flat label="Close" @click="closeCreateUserDialog" class="close-btn" />
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
import AdminFormStep1 from 'components/AdminFormStep1.vue';
import AdminFormStep2 from 'components/AdminFormStep2.vue';
import AdminFormStep3 from 'components/AdminFormStep3.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    AdminFormStep1,
    AdminFormStep2,
    AdminFormStep3
  },
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const user = userStore.users.find(u => u.username === 'admin');
    const newUser = ref({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      designation: '',
      testerId: null,
      developerId: null
    });
    const currentStep = ref('AdminFormStep1');
    const showUserDialog = ref(false);
    const showCreateUserDialog = ref(false);

    const nextStep = () => {
      if (currentStep.value === 'AdminFormStep1') {
        currentStep.value = 'AdminFormStep2';
      } else if (currentStep.value === 'AdminFormStep2') {
        currentStep.value = 'AdminFormStep3';
      }
    };

    const previousStep = () => {
      if (currentStep.value === 'AdminFormStep2') {
        currentStep.value = 'AdminFormStep1';
      } else if (currentStep.value === 'AdminFormStep3') {
        currentStep.value = 'AdminFormStep2';
      }
    };

    const createUser = () => {
      console.log('Creating user:', newUser.value);
      const userExists = userStore.users.some(u => u.username === newUser.value.username);
      if (userExists) {
        alert('Username already exists. Please choose a different username.');
        return;
      }

      if (newUser.value.designation === 'tester') {
        newUser.value.testerId = ''; // Will be auto-generated in userStore
      } else if (newUser.value.designation === 'developer') {
        newUser.value.developerId = ''; // Will be auto-generated in userStore
      }

      userStore.addUser(newUser.value);
      console.log('Updated users:', userStore.users);
      alert('User created successfully');
      newUser.value = {
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        designation: '',
        testerId: null,
        developerId: null
      };
      currentStep.value = 'AdminFormStep1'; // Reset to the first step
      closeCreateUserDialog();
    };

    const openCreateUserDialog = () => {
      showCreateUserDialog.value = true;
    };

    const closeCreateUserDialog = () => {
      showCreateUserDialog.value = false;
    };

    const logout = () => {
      router.push('/');
    };

    const showUsers = () => {
      showUserDialog.value = true;
    };

    const goToBugDashboard = () => {
      router.push('/admin-bugs');
    };

    const groupedUsers = computed(() => {
      const groups = {
        Admins: [],
        Testers: [],
        Developers: []
      };
      userStore.users.forEach(user => {
        if (user.designation === 'admin') {
          groups.Admins.push(user);
        } else if (user.designation === 'tester') {
          groups.Testers.push(user);
        } else if (user.designation === 'developer') {
          groups.Developers.push(user);
        }
      });
      return groups;
    });

    return { 
      user, 
      newUser, 
      currentStep, 
      nextStep, 
      previousStep, 
      createUser, 
      logout, 
      showUsers, 
      showUserDialog, 
      showCreateUserDialog, 
      openCreateUserDialog, 
      closeCreateUserDialog, 
      groupedUsers, 
      goToBugDashboard 
    };
  }
};
</script>
<style scoped>
/* Background Color for Layout */
.background {
  background-color: #f4f4f4; /* Light gray background for the entire layout */
}

/* Header Styling */
.header {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff; /* Blue background color for header */
  color: #fff; /* White text color */
  padding: 10px 20px;
  border-radius: 8px; /* Optional: for rounded corners */
}

.welcome-container {
  text-align: center;
  flex: 1;
}

.text-h5 {
  font-size: 24px; /* Adjusted for better responsiveness */
  font-weight: bold;
}

.text-h6 {
  font-size: 18px; /* Adjusted for better responsiveness */
}

.logout-container {
  margin-right: 10px; /* Reduced margin for smaller screens */
}

.logout-icon {
  color: #fff; /* White icon color */
}

.button-container {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap */
  justify-content: center;
  gap: 10px; /* Space between buttons */
}

.button-style {
  border-radius: 20px;
  margin-top: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s, transform 0.3s; /* Smooth transition for background and transform */
}

/* Create User Button Styling */
.button-create-user {
  background-color: #007bff; /* Primary color for "Create User" button */
  color: #fff;
}

.button-create-user:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

/* Show All Users Button Styling */
.button-show-users {
  background-color: #28a745; /* Green color for "Show All Users" button */
  color: #fff;
}

.button-show-users:hover {
  background-color: #218838; /* Darker green on hover */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

/* See the Application Button Styling */
.button-see-application {
  background-color: #6c757d; /* Gray color for "See the Application" button */
  color: #fff;
}

.button-see-application:hover {
  background-color: #5a6268; /* Darker gray on hover */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

/* Styling for Dialog */
.create-user-card {
  width: 90vw; /* Full width with a max-width constraint */
  max-width: 600px; /* Maximum width for large screens */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.create-user-header {
  background-color: #00aaff; /* Light blue color for the header */
  color: #fff; /* White text color for contrast */
  padding: 16px;
  font-size: 24px;
  font-weight: bold;
}

.card-actions {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap */
  align-items: center;
  padding: 16px;
  justify-content: space-between;
}

.prev-btn, .next-btn, .create-btn, .close-btn {
  border-radius: 20px;
  margin: 5px; /* Reduced margin for smaller screens */
  padding: 8px 16px;
  transition: background-color 0.3s, transform 0.3s; /* Smooth transition for background and transform */
}

.prev-btn {
  margin-right: auto; /* Pushes the button to the left */
}

.next-btn {
  margin-left: auto; /* Pushes the button to the right */
}

.create-btn {
  background-color: #4CAF50; /* Green background for Create button */
  color: #fff;
}

.create-btn:hover {
  background-color: #45a049; /* Darker green on hover */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

.close-btn {
  background-color: #f44336; /* Red background for Close button */
  color: #fff;
}

.close-btn:hover {
  background-color: #e53935; /* Darker red on hover */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

.spacer {
  flex: 1; /* Spacer to push buttons apart */
}

/* Responsive Design for Small Screens */
@media (max-width: 768px) {
  .header {
    flex-direction: column; /* Stack header items vertically on smaller screens */
    align-items: flex-start;
    padding: 10px;
  }

  .logout-container {
    align-self: flex-end; /* Move logout button to the right */
    margin-right: 0; /* Remove right margin */
    margin-top: 10px; /* Margin top to separate from welcome-container */
  }

  .button-container {
    flex-direction: column; /* Stack buttons vertically on smaller screens */
  }

  .create-user-card {
    width: 95vw; /* Full width for small screens */
    max-width: none; /* Remove max-width constraint */
  }

  .card-actions {
    flex-direction: column; /* Stack action buttons vertically */
  }

  .prev-btn, .next-btn, .create-btn, .close-btn {
    margin: 10px 0; /* Margin top and bottom for vertical stacking */
  }
}

/* Responsive Design for Extra Small Screens */
@media (max-width: 480px) {
  .header {
    flex-direction: column; /* Stack header items vertically on smaller screens */
    align-items: flex-start; /* Align items to the start (left) */
    padding: 10px;
  }

  .welcome-container {
    text-align: center;
    width: 100%;
  }

  .text-h5 {
    font-size: 20px; /* Smaller font size for very small screens */
  }

  .text-h6 {
    font-size: 16px; /* Smaller font size for very small screens */
  }

  .button-container {
    flex-direction: column; /* Stack buttons vertically on smaller screens */
    gap: 10px; /* Space between buttons */
    width: 100%; /* Full width for the button container */
  }

  .button-style {
    margin: 10px 10px 0; /* Top margin of 10px, side margins of 10px, and no bottom margin */
    font-size: 14px; /* Smaller font size for buttons */
    padding: 8px 16px; /* Reduced padding for buttons */
  }

  .create-user-card {
    width: 95vw; /* Full width for small screens */
    max-width: none; /* Remove max-width constraint */
  }

  .card-actions {
    flex-direction: column; /* Stack action buttons vertically */
  }

  .prev-btn, .next-btn, .create-btn, .close-btn {
    margin: 10px 0; /* Margin top and bottom for vertical stacking */
  }

  .logout-container {
    align-self: flex-end; /* Align logout icon to the right */
    margin-top: 10px; /* Space from other items */
    margin-right: 0; /* Remove right margin */
  }
}
</style>

