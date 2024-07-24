import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import UserDashboard from '../pages/UserDashboard.vue';
import TtesterDashboard from '../pages/TtesterDashboard.vue';
import DeveloperDashboard from '../pages/DeveloperDashboard.vue';
import AdminBugDashboard from 'pages/AdminBugDashboard.vue';
import Home from 'pages/Home.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/admin-dashboard', component: AdminDashboard },
  { path: '/user-dashboard', component: UserDashboard },
  {path:'/Ttester-dashboard',component:TtesterDashboard},
  { path: '/developer-dashboard', component: DeveloperDashboard},
  { path: '/admin-bugs', component: AdminBugDashboard },
  { path: '/Home', component: Home}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
