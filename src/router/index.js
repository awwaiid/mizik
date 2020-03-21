import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/synth",
    name: "synth",
    component: () =>
      import(/* webpackChunkName: "synth" */ "../views/Synth.vue")
  },
  {
    path: "/mizik",
    name: "mizik",
    component: () =>
      import(/* webpackChunkName: "synth" */ "../views/Mizik.vue")
  },
  {
    path: "/leaders",
    name: "leaders",
    component: () =>
      import(/* webpackChunkName: "leaders" */ "../views/Leaders.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
