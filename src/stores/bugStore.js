// stores/bugStore.js
import { defineStore } from 'pinia';

export const useBugStore = defineStore('bugStore', {
  state: () => ({
    bugs: [], // Array to hold all bugs
  }),
  actions: {
    addBug(newBug) {
      newBug.id = this.bugs.length + 1; // Assign a unique ID to the new bug
      this.bugs.push(newBug);
    },
    updateBug(updatedBug) {
      const index = this.bugs.findIndex(bug => bug.id === updatedBug.id);
      if (index !== -1) {
        this.bugs.splice(index, 1, updatedBug);
      }
    },
    deleteBug(bugId) {
      this.bugs = this.bugs.filter(bug => bug.id !== bugId);
    },
    assignDeveloper(bugId, developerUsername) {
      const bug = this.bugs.find(bug => bug.id === bugId);
      if (bug) {
        bug.developer = developerUsername; // Update the developer field
      }
    },
  },
});
