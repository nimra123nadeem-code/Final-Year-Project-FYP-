import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import UserDashboard from '../views/UserDashboard.vue';
import AdminProductpage from '../views/AdminProductpage.vue';
import Order from '../views/Order.vue';
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'user' },
  },
 
  {
    path: '/admin/products',
    name: 'AdminProductspage',
    component: AdminProductpage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/orders',
    name: 'Order',
    component: Order,
    meta: { requiresAuth: true, role: 'admin' },
  },
  { path: '/:catchAll(.*)', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth && loggedIn !== 'true') {
    return next({ name: 'Home' });
  }

  if (to.meta.role && to.meta.role !== userRole) {
    return next({ name: userRole === 'admin' ? 'AdminDashboard' : 'UserDashboard' });
  }

  next();
});

export default router;
