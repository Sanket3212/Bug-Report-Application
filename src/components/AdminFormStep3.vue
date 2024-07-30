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
    <q-btn v-if="canCreateUser" @click="createUser" label="Create New User" color="primary" />
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: ['user'],
  setup(props) {
    const canCreateUser = computed(() => {
      const requiredFields = ['username', 'fullName', 'email', 'phone', 'designation', 'password'];
      const isUserFilled = requiredFields.every(field => !!props.user[field]);

      if (props.user.designation === 'tester') {
        return isUserFilled && !!props.user.testerId;
      } else if (props.user.designation === 'developer') {
        return isUserFilled && !!props.user.developerId;
      }
      return isUserFilled;
    });

    return { canCreateUser };
  },
  methods: {
    createUser() {
      this.$emit('create-user');
    }
  }
};
</script>
