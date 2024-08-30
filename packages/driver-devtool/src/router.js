import Vue from 'vue'
import { createRouter } from 'vue-router'
import ExplorerMain from "./components/Explorer/Main.vue";

Vue.use(createRouter);

const router = createRouter({
  routes: [
    {
      path: '/',
      name: "explorer",
      component: ExplorerMain
    }
  ]
})

export default router;
