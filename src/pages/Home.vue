<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="goToLogin" />
        <q-toolbar-title>
          Welcome, {{ userStore.currentUser.fullName }}!
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="content-container">
          <div class="text-h5">Select a Dashboard</div>
          <div class="q-mt-md button-container">
            <q-btn label="Tester Dashboard" color="primary" @click="promptForId('Ttester-dashboard')" />
            <q-btn label="Developer Dashboard" color="primary" class="q-ml-md" @click="promptForId('developer-dashboard')" />
            <q-btn label="Admin Dashboard" color="primary" class="q-ml-md" @click="promptForId('admin-dashboard')" />
          </div>
        </div>
      </q-page>
    </q-page-container>
    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Enter your ID</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="enteredId" label="ID" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="dialogVisible = false" />
          <q-btn flat label="Submit" @click="verifyId" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const dialogVisible = ref(false);
    const enteredId = ref('');
    let selectedDashboard = '';

    const promptForId = (dashboard) => {
      selectedDashboard = dashboard;
      dialogVisible.value = true;
    };

    const verifyId = () => {
      let expectedId = '';
      const designation = userStore.currentUser.designation;
      if (selectedDashboard === 'Ttester-dashboard' && designation === 'tester') {
        expectedId = userStore.currentUser.testerId;
      } else if (selectedDashboard === 'developer-dashboard' && designation === 'developer') {
        expectedId = userStore.currentUser.developerId;
      } else if (selectedDashboard === 'admin-dashboard' && designation === 'admin') {
        expectedId = ''; // Admins do not require an additional ID check
      }

      if (enteredId.value === expectedId || designation === 'admin') {
        router.push(`/${selectedDashboard}`);
      } else {
        alert('Invalid ID');
      }
      dialogVisible.value = false;
    };

    const goToLogin = () => {
      router.push('/');
    };

    return { userStore, dialogVisible, enteredId, promptForId, verifyId, goToLogin };
  }
};
</script>
<style scoped>
.text-h5 {
  font-size: 24px;
  font-weight: bold;
  color: #540cfc;
  text-align: center;
  margin-bottom: 16px;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px); /* Adjust based on header height */
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.q-btn {
  width: 100%; /* Full width for mobile screens */
  max-width: 300px; /* Max width for buttons */
  padding: 16px 32px; /* Increased padding for a larger button */
  border-radius: 10px; /* Rounded corners */
  font-size: 18px; /* Larger text size */
  font-weight: 600; /* Bolder text */
  transition: background-color 0.3s, transform 0.2s; /* Smooth transition effects */
}

.q-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-2px); /* Slightly lift the button on hover */
}

.q-btn:active {
  background-color: #004494; /* Even darker blue when button is pressed */
  transform: translateY(0); /* Reset the lift effect */
}

@media (min-width: 600px) {
  .button-container {
    flex-direction: row;
  }

  .q-btn {
    width: auto; /* Adjust button width for larger screens */
  }
}
</style>
