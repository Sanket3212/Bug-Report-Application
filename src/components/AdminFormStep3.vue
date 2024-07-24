<template>
  <div>
    <div>Username: {{ user.username }}</div>
    <div>Full Name: {{ user.fullName }}</div>
    <div>Email: {{ user.email }}</div>
    <div>Phone Number: {{ user.phone }}</div>
    <div>Designation: {{ user.designation }}</div>
    <div>Password: {{ user.password }}</div>
    <div v-if="user.designation === 'tester'">Tester ID: {{ user.testerId }}</div>
    <div v-if="user.designation === 'developer'">Developer ID: {{ user.developerId }}</div>
    <q-btn @click="createUser" label="Create New User" color="primary" />
  </div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    createUser() {
      this.$emit('create-user');
    }
  }
};
</script>
