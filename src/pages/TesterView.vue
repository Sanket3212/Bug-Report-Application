<template>
  <div class="tester-view">
    <Layout>
      <TesterDashboard />
    </Layout>
  </div>
</template>

<script>
import TesterDashboard from '../components/TesterDashboard.vue'; // Adjust path as per your project structure
import Layout from '../layouts/Layout.vue'; // Adjust path as per your project structure

export default {
  name: 'TesterView',
  components: {
    TesterDashboard,
    Layout,
  },
};
</script>

<style scoped>
.tester-view {
  background-color: var(--background-color);
  padding: 20px;
}

@media (max-width: 768px) {
  .tester-view {
    padding: 10px;
  }
}

:root {
  --background-color: #f0f4f8; /* Light background color */
  --primary-color: #4a90e2; /* Primary button color */
  --secondary-color: #50e3c2; /* Secondary button color */
  --text-color: #333; /* Default text color */
  --header-color: #ffffff; /* Header background color */
  --card-background: #ffffff; /* Card background color */
}

.layout {
  background-color: var(--header-color);
}

.q-btn.primary {
  background-color: var(--primary-color);
  color: #fff;
}

.q-btn.secondary {
  background-color: var(--secondary-color);
  color: #fff;
}

.q-card {
  background-color: var(--card-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.q-page {
  color: var(--text-color);
}
</style>
