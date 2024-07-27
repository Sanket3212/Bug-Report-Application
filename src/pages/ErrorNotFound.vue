<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div class="error-container">
      <div class="error-code">
        404
      </div>

      <div class="error-message">
        Oops. Nothing here...
      </div>

      <q-btn
        class="go-home-btn"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ErrorNotFound'
});
</script>

<style scoped>
.fullscreen {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6); /* Gradient background */
}

.error-container {
  text-align: center;
}

.error-code {
  font-size: 30vh;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.3); /* Adding shadow for better contrast */
}

.error-message {
  font-size: 2rem;
  margin-top: -20px;
  color: rgba(255, 255, 255, 0.7); /* Slightly transparent */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.go-home-btn {
  margin-top: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.2rem;
  text-transform: uppercase;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.go-home-btn:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Subtle hover effect */
}
</style>
