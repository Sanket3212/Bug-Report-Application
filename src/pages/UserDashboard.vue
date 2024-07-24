<template>
  <q-layout class="bg-gradient">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="welcome-container">
          <div class="text-h5">Welcome, {{ currentUser.fullName }}</div>
        </div>
        <div class="logout-container">
          <q-btn color="primary" label="Logout" @click="handleLogout" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useUserStore } from '../stores/userStore';
import { computed } from 'vue';

export default {
  setup() {
    const userStore = useUserStore();
    const currentUser = computed(() => userStore.currentUser);

    const handleLogout = () => {
      userStore.logoutUser();
      this.$router.push('/');
    };

    return {
      currentUser,
      handleLogout
    };
  }
};
</script>

<style scoped>
.bg-gradient {
  background-image: url('C:\Users\sails\Desktop\vue\demoprojectt\bg2.jpg'); /* Background image */
  background-size: cover;
  background-position: center;
}
.welcome-container {
  
  text-align: center;
  margin-top: 300px; /* Adjust vertical spacing */

}
.text-h5 {
  font-size: 70px;
  font-weight: bold;
  color: #0f0f0fe9;
}
.logout-container {
  position: absolute;
 top:10px;
left: 1300px;

  
}
</style>
