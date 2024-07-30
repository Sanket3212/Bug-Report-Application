// stores/bugStore.js
import { defineStore } from 'pinia';

export const useBugStore = defineStore('bugStore', {
  state: () => ({
    bugs: JSON.parse(localStorage.getItem('bugs')) || [], // Load bugs from local storage or use an empty array if not found
  }),
  actions: {
    addBug(newBug) {
      newBug.id = this.bugs.length + 1; // Assign a unique ID to the new bug
      this.bugs.push(newBug);
      this.saveBugsToLocalStorage();
    },
    updateBug(updatedBug) {
      const index = this.bugs.findIndex(bug => bug.id === updatedBug.id);
      if (index !== -1) {
        this.bugs.splice(index, 1, updatedBug);
        this.saveBugsToLocalStorage();
      }
    },
    deleteBug(bugId) {
      this.bugs = this.bugs.filter(bug => bug.id !== bugId);
      this.saveBugsToLocalStorage();
    },
    assignDeveloper(bugId, developerUsername) {
      const bug = this.bugs.find(bug => bug.id === bugId);
      if (bug) {
        bug.developer = developerUsername; // Update the developer field
        this.saveBugsToLocalStorage();
      }
    },
    saveBugsToLocalStorage() {
      localStorage.setItem('bugs', JSON.stringify(this.bugs)); // Save bugs to local storage
    },
  },
});
