<template>
  <q-layout class="login-layout">
    <q-page-container>
      <q-page class="login-page">
        <q-card class="login-card">
          <q-card-section>
            <div class="text-h6">LOGIN</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="handleSubmit">
              <q-input v-model="username" label="Username" outlined dense class="input-field" />
              <q-input v-model="password" type="password" label="Password" outlined dense class="input-field" />
              <q-btn type="submit" label="Login" color="primary" class="full-width q-mt-md login-btn" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export default {
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const username = ref('');
    const password = ref('');

    const handleSubmit = async () => {
      const loggedIn = userStore.loginUser(username.value, password.value);
      if (loggedIn) {
        const role = userStore.currentUser.designation;
        switch (role) {
          case 'tester':
            await router.push('/Ttester-dashboard');
            break;
          case 'developer':
            await router.push('/developer-dashboard');
            break;
          case 'admin':
            await router.push('/admin-dashboard');
            break;
          default:
            alert('Unknown user role');
        }
      } else {
        alert('Invalid username or password');
      }
    };

    return { username, password, handleSubmit };
  }
};
</script>
<style scoped>
.login-layout {
  background-color: #e0f7fa; /* Light cyan background */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.login-card {
  max-width: 600px; /* Increased width */
  width: 100%;
  padding: 40px; /* Padding remains the same */
  background: #ffffff; /* Solid white background color */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow */
  border-radius: 16px; /* Rounded corners */
  text-align: center; /* Center-align text */
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
}

.text-h6 {
  font-size: 36px; /* Larger font size */
  font-weight: bold;
  color: #00695c; /* Dark teal color */
  margin-bottom: 30px;
}

.input-field {
  margin-bottom: 20px; /* Add spacing between inputs */
}

.q-input:focus, .q-btn:focus {
  outline: 2px solid #00695c; /* Focus outline */
}

.login-btn {
  background-color: #00796b; /* Dark teal button color */
  color: #fff;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #004d40; /* Darker shade on hover */
}

/* Responsive styles */
@media (max-width: 600px) {
  .text-h6 {
    font-size: 30px;
  }

  .login-card {
    max-width: 90%; /* Adjusted for smaller screens */
    padding: 20px;
  }
}

@media (max-width: 400px) {
  .text-h6 {
    font-size: 24px;
  }

  .login-card {
    max-width: 95%; /* Further adjustment for very small screens */
    padding: 15px;
  }
}
</style>
