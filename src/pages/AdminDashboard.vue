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
            <q-btn color="primary" label="Create User" @click="openCreateUserDialog" class="button-style button-create-user" />
            <q-btn color="primary" label="Show All Users" @click="showUsers" class="button-style button-show-users" />
            <q-btn color="secondary" label="See the Application" @click="goToBugDashboard" class="button-style button-see-application" />
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
                <q-btn flat label="Close" @click="closeCreateUserDialog" class="close-btn" />
                <div class="spacer"></div>
                <q-btn flat label="Previous" @click="previousStep" v-if="currentStep !== 'AdminFormStep1'" class="prev-btn" />
                <q-btn flat label="Next" @click="nextStep" v-if="currentStep !== 'AdminFormStep3'" class="next-btn" />
                <q-btn flat label="Create" @click="createUser" v-if="currentStep === 'AdminFormStep3'" />
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

/* Welcome Container Styling */
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

/* Button Container Styling */
.button-container {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap */
  justify-content: center;
  gap: 10px; /* Space between buttons */
  margin-top: 20px;
}

/* Button Styling */
.button-style {
  border-radius: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s, transform 0.3s; /* Smooth transition for background and transform */
  background-color: #007bff; /* Simple background color */
  color: #fff; /* White text color */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle box shadow */
  font-weight: bold; /* Bold text */
}

.button-style:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-2px); /* Slightly lift button on hover */
}

/* Dialog Card Styling */
.create-user-card {
  width: 100%; /* Ensure the dialog card uses the full width */
  max-width: 400px; /* Optional: to limit maximum width */
  margin: auto;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  gap: 10px; /* Space between buttons */
}

.spacer {
  flex: 1; /* Take up remaining space */
}

/* Common Button Styling in Dialog */
.prev-btn,
.next-btn,
.close-btn {
  border-radius: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s, transform 0.3s; /* Smooth transition for background and transform */
  background-color: #007bff; /* Simple background color */
  color: #fff; /* White text color */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle box shadow */
  font-weight: bold; /* Bold text */
}

.prev-btn:hover,
.next-btn:hover,
.close-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-2px); /* Slightly lift button on hover */
}

/* Responsive Styles */
@media (max-width: 768px) {
  .header {
    flex-direction: column; /* Stack header content vertically on smaller screens */
    align-items: center;
    text-align: center;
  }

  .welcome-container {
    margin-bottom: 10px; /* Add space between elements */
  }

  .logout-container {
    margin-right: 0; /* Remove right margin for smaller screens */
  }

  .button-container {
    justify-content: center; /* Center buttons on smaller screens */
  }

  .card-actions {
    flex-direction: column; /* Stack buttons vertically on smaller screens */
    align-items: stretch; /* Stretch buttons to full width */
  }

  .prev-btn,
  .next-btn,
  .close-btn {
    width: 100%; /* Full width buttons on smaller screens */
    margin-bottom: 10px; /* Space between buttons */
  }
}
</style>
