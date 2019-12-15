var _ = require("lodash");

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import VTooltip from "v-tooltip";
import Notifications from "vue-notification";
import * as FirebaseService from "./api/firebase-service";
import store from "./store";
import router from "./router";
import App from "./App";

Vue.use(VTooltip);
Vue.use(Notifications);

Vue.prototype.$http = FirebaseService;

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  store,
  components: { App }
});
