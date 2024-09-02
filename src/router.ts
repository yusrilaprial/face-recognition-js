import {createWebHistory, createRouter} from "vue-router";

import Home from "./pages/Home.vue";
import OpenCV from "./pages/OpenCV.vue";

const routes = [
  {path: "/", component: Home},
  {path: "/open-cv", component: OpenCV},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
