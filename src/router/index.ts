import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
const Home = () => import('../pages/Home.vue');
const Booking = () => import('../pages/Booking.vue');

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/booking', name: 'Booking', component: Booking }
];

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior(){ return { top:0 }; } });
export default router;
