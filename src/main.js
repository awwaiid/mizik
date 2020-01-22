import Vue from "vue";

import Vue2TouchEvents from "vue2-touch-events";

Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: "",
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400
});

import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
