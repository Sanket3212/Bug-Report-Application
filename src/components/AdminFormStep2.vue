<template>
  <q-form @submit.prevent="nextStep">
    <q-select 
      v-model="user.designation" 
      :options="['admin', 'tester', 'developer']" 
      label="Designation" 
      @update:model-value="generateId" 
      required 
    />
    <q-input 
      v-if="user.designation === 'tester'" 
      v-model="user.testerId" 
      label="Tester ID" 
      readonly 
    />
    <q-input 
      v-if="user.designation === 'developer'" 
      v-model="user.developerId" 
      label="Developer ID" 
      readonly 
    />
    <q-btn v-if="showNextButton" type="submit" label="Next" color="primary" />
  </q-form>
</template>

<script>
import { computed, watch } from 'vue';
import { useUserStore } from 'stores/userStore';

export default {
  props: ['user'],
  setup(props) {
    const userStore = useUserStore();

    const generateId = (designation) => {
      if (designation === 'tester') {
        const testerCount = userStore.users.filter(u => u.designation === 'tester').length;
        props.user.testerId = `T${(testerCount + 1).toString().padStart(3, '0')}`;
      } else if (designation === 'developer') {
        const developerCount = userStore.users.filter(u => u.designation === 'developer').length;
        props.user.developerId = `D${(developerCount + 1).toString().padStart(3, '0')}`;
      }
    };

    watch(() => props.user.designation, (newVal) => {
      generateId(newVal);
    }, { immediate: true });

    const showNextButton = computed(() => {
      return !!props.user.designation;
    });

    return { generateId, showNextButton };
  },
  methods: {
    nextStep() {
      this.$emit('next-step');
    }
  }
};
</script>
