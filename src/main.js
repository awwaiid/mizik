import Vue from "vue";

import Vue2TouchEvents from "vue2-touch-events";
Vue.use(Vue2TouchEvents);

import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
