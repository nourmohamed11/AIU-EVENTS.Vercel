import { createRouter, createWebHistory } from "vue-router";
import MainComponent from "../views/user/home.vue";
import adminpanel from "../views/admin/adminpanel.vue";
import events from "../views/admin/events.vue";

const routes = [
  {
    path:'/',
    name:'MainComponent',
    component:MainComponent
  },
  {
    path:"/Home",
    name:"Home",
    component:MainComponent
  },
  {
    path: '/adminpanel',
    name: "adminpanel",
    component: adminpanel,
  },
  {
    path: '/adminpanel/events',
    name: "events",
    component: events,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
