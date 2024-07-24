import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login.vue';
import Home from '../pages/Home.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import TtesterDashboard from '../pages/TesterDashboard.vue';
import DeveloperDashboard from '../pages/DeveloperDashboard.vue';
import AdminBugDashboard from 'src/pages/AdminBugDashboard.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
  { path: '/admin-dashboard', component: AdminDashboard },
  { path: '/Ttester-dashboard', component: TtesterDashboard },
  { path: '/developer-dashboard', component: DeveloperDashboard },
  { path: '/AdminBugDashboard', component: AdminBugDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
