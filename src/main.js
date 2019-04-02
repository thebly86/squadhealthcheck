var _ = require("lodash");

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VTooltip from "v-tooltip";
import store from "./store/";
import router from "./router";
import App from "./App";

Vue.use(VTooltip);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  template: "<App/>",
  store,
  components: { App }
});
