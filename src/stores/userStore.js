import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        username: 'admin',
        fullName: 'Admin Officer',
        email: 'admin@example.com',
        phone: '1234567890',
        designation: 'admin',
        password: 'admin'
      },
      {
        username: 'sanket',
        fullName: 'Sanket kumbhar',
        email: 'user1@example.com',
        phone: '0987654321',
        designation: 'tester',
        password: '12345',
        testerId: 'T1'
      },
      {
        username: 'developer1',
        fullName: 'developer1',
        email: 'dev1@example.com',
        phone: '1122334455',
        designation: 'developer',
        password: '12345',
        developerId: 'D1'
      }
      
    ],
    currentUser: null
  }),
  actions: {
    loginUser(username, password) {
      const user = this.users.find(u => u.username === username && u.password === password);
      if (user) {
        this.currentUser = user;
        return true;
      } else {
        return false;
      }
    },
    addUser(user) {
      // Ensure a valid designation
      if (!user.designation) {
        console.error('User designation is required');
        return;
      }

      // Ensure unique username
      if (this.users.some(u => u.username === user.username)) {
        console.error('Username already exists');
        return;
      }

      // Generate appropriate ID based on designation
      if (user.designation === 'tester') {
        const maxTesterId = Math.max(
          ...this.users
            .filter(u => u.designation === 'tester')
            .map(u => parseInt(u.testerId.replace('T', ''), 10)),
          0
        );
        user.testerId = `T${maxTesterId + 1}`;
      } else if (user.designation === 'developer') {
        const maxDeveloperId = Math.max(
          ...this.users
            .filter(u => u.designation === 'developer')
            .map(u => parseInt(u.developerId.replace('D', ''), 10)),
          0
        );
        user.developerId = `D${maxDeveloperId + 1}`;
      }

      // Add user to the list
      this.users.push(user);
    },
    getUserByTesterId(testerId) {
      return this.users.find(u => u.testerId === testerId);
    },
    getUserByDeveloperId(developerId) {
      return this.users.find(u => u.developerId === developerId);
    }
  }
});
