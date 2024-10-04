import {createWebHistory, createRouter} from "vue-router";

import Home from "./pages/Home.vue";
import AntiSpoofing from "./pages/AntiSpoofing.vue";
// import Liveness from "./pages/Liveness.vue";

export const routes = [
  {name: "Home", path: "/", component: Home},
  {name: "Anti Spoofing", path: "/anti-spoofing", component: AntiSpoofing},
  // {name: "Liveness", path: "/liveness", component: Liveness},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
