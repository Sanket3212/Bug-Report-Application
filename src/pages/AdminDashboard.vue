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
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-md-6 col-lg-4">
              <q-card class="q-pa-md">
                <q-knob
                  v-model="pendingBugsCount"
                  size="100px"
                  show-value
                  color="red"
                  center-color="white"
                  track-color="grey-4"
                  thickness="0.3"
                  value-style="font-size: 24px"
                  readonly
                  class="custom-knob"
                />
                <div class="text-center">Pending Bugs</div>
              </q-card>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <q-card class="q-pa-md">
                <q-knob
                  v-model="completedBugsCount"
                  size="100px"
                  show-value
                  color="green"
                  center-color="white"
                  track-color="grey-4"
                  thickness="0.3"
                  value-style="font-size: 24px"
                  readonly
                  class="custom-knob"
                />
                <div class="text-center">Completed Bugs</div>
              </q-card>
            </div>
          </q-card-section>
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
import { useBugStore } from 'stores/bugStore';
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
    const bugStore = useBugStore();
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

    const pendingBugsCount = computed(() => bugStore.bugs.filter(bug => bug.status === 'Pending').length);
    const completedBugsCount = computed(() => bugStore.bugs.filter(bug => bug.status === 'Complete').length);
    const unassignedBugsCount = computed(() => bugStore.bugs.filter(bug => bug.developer === 'Unassigned').length);

    return { 
      user, 
      pendingBugsCount, 
      completedBugsCount, 
      unassignedBugsCount, 
      showUserDialog, 
      showCreateUserDialog, 
      openCreateUserDialog, 
      closeCreateUserDialog, 
      logout, 
      showUsers, 
      goToBugDashboard, 
      groupedUsers, 
      nextStep, 
      previousStep, 
      createUser, 
      currentStep, 
      newUser 
    };
  }
};
</script>

<style scoped>
/* General Background */
/* General Background */
.background {
  background: linear-gradient(to bottom, #e0f7fa, #ffffff); 
  /* width: 1000px; */
  padding-top: 100px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Dashboard Container */
.dashboard-container {
  
  padding: 20px;
  width: 90%;
  width: 1000px;
  height: auto;
  margin: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Header Styling */
.header {
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #0c4bde; /* Dark blue background */
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Welcome Container */
.welcome-container {
  flex: 1;
  text-align: left;
}

.text-h5 {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff; /* White text */
  margin: 0;
}

.text-h6 {
  font-size: 18px;
  color: #cfcfcf; /* Light grey text */
  margin: 0;
}

.logout-container {
  display: flex;
  align-items: center;
}

.logout-icon {
  color: #ff4d4f; /* Red icon */
  cursor: pointer;
  font-size: 24px;
  transition: color 0.3s, transform 0.3s;
}

.logout-icon:hover {
  color: #ff1a1a; /* Darker red on hover */
  transform: scale(1.1);
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

/* Button Styling */
.button-style {
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
  display: inline-block;
  margin: 5px;
}

.button-create-user {
  background-color: #1890ff; /* Blue button */
  color: white;
}

.button-create-user:hover {
  background-color: #1677ff; /* Darker blue on hover */
  transform: scale(1.05);
}

.button-show-users {
  background-color: #52c41a; /* Green button */
  color: white;
}

.button-show-users:hover {
  background-color: #39a935; /* Darker green on hover */
  transform: scale(1.05);
}

.button-see-application {
  background-color: #faad14; /* Yellow button */
  color: white;
}

.button-see-application:hover {
  background-color: #e5a700; /* Darker yellow on hover */
  transform: scale(1.05);
}

/* Knob Container */
.knob-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

/* Knob Card Styling */
.q-card {
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.q-knob {
  margin: 0 auto;
  border-radius: 50%;
  transition: transform 0.3s;
}

.q-knob:hover {
  transform: scale(1.05);
}

.custom-knob {
  background: none !important;
}

/* Dialog Card Styling */
.create-user-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #ffffff;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  color: #ff4d4f;
}

.prev-btn {
  color: #1890ff;
}

.next-btn {
  color: #52c41a;
}

.spacer {
  flex: 1;
}

.tasks.container{
  display: none;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .dashboard-container {
    padding-top: none;
    width: 100%;
    height: auto;
    padding: 10px;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  .button-container {
    flex-direction: column;
  }

  .q-knob.custom-knob {
    background: none !important;
  }
}

</style>